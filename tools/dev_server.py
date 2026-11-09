"""
tools/dev_server.py · servidor local de desarrollo
--------------------------------------------------------------------------
Sirve el sitio como `python -m http.server` y además imita api/visitas.php
(mismo formato JSON y mismo archivo api/data/visitas.json), para poder ver
el contador de visitas sin instalar PHP.

Uso (desde cualquier carpeta):
    python servipos2019/tools/dev_server.py 5520
"""
import json
import sys
import threading
from datetime import datetime, timedelta, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Carpeta del sitio (este archivo vive en tools/, el sitio está un nivel arriba)
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "api" / "data" / "visitas.json"
CARACAS = timezone(timedelta(hours=-4))  # hora de Venezuela, para reiniciar "hoy" a medianoche
LOCK = threading.Lock()  # el servidor atiende en paralelo: una escritura a la vez


def count(hit):
    """Lee el conteo y, si hit es True, suma una visita. Misma lógica que api/visitas.php."""
    with LOCK:
        today = datetime.now(CARACAS).strftime("%Y-%m-%d")
        try:
            data = json.loads(DATA.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            data = {}
        data = {"total": 0, "dia": today, "hoy": 0, **data}  # valores por defecto si el archivo es nuevo
        if data["dia"] != today:
            data["dia"], data["hoy"] = today, 0
        if hit:
            data["total"] += 1
            data["hoy"] += 1
            DATA.parent.mkdir(parents=True, exist_ok=True)
            DATA.write_text(json.dumps(data), encoding="utf-8")
        return {"total": data["total"], "hoy": data["hoy"]}


class Handler(SimpleHTTPRequestHandler):
    """Sirve los archivos del sitio e intercepta /api/visitas.php."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _visits(self, hit):
        """Responde con el conteo en JSON, sin caché (igual que el PHP)."""
        body = json.dumps(count(hit)).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        # GET al contador = solo leer
        if self.path.split("?")[0] == "/api/visitas.php":
            return self._visits(False)
        if self.path.startswith("/api/data/"):  # igual que el .htaccess
            return self.send_error(403)
        return super().do_GET()

    def do_POST(self):
        # POST al contador = sumar una visita (el navegador lo hace 1 vez por sesión)
        if self.path.split("?")[0] == "/api/visitas.php":
            return self._visits(True)
        return self.send_error(405)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5520  # puerto opcional como argumento
    print(f"ServiPos 2019 · http://localhost:{port}")
    ThreadingHTTPServer(("", port), Handler).serve_forever()
