<?php
/* ==========================================================================
   api/visitas.php · contador de visitas (sin base de datos)
   --------------------------------------------------------------------------
   GET  → devuelve el conteo actual          {"total": 1234, "hoy": 18}
   POST → suma una visita y devuelve el conteo
   El navegador hace POST solo una vez por sesión (components/visits.js),
   así recargar o navegar entre páginas no infla el número.
   Los datos se guardan en api/data/visitas.json (protegido por .htaccess).
   Requiere PHP 7.4+ (cualquier hosting compartido, p. ej. SiteGround).
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// Archivo donde se guarda el conteo y fecha de hoy en Venezuela (para "hoy")
$file = __DIR__ . '/data/visitas.json';
$tz   = new DateTimeZone('America/Caracas');
$today = (new DateTime('now', $tz))->format('Y-m-d');

// Solo cuentan los POST de navegadores reales (los bots no ejecutan el POST,
// pero algunos sí: se descartan por user-agent)
$ua    = $_SERVER['HTTP_USER_AGENT'] ?? '';
$isBot = $ua === '' || preg_match('/bot|crawl|spider|slurp|preview|monitor|curl|wget/i', $ua);
$hit   = $_SERVER['REQUEST_METHOD'] === 'POST' && !$isBot;

// Crea api/data/ la primera vez (el servidor necesita permiso de escritura)
if (!is_dir(dirname($file))) {
    mkdir(dirname($file), 0755, true);
}

// 'c+' = abrir para leer y escribir; lo crea si no existe y NO lo vacía
$fp = fopen($file, 'c+');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo abrir el almacenamiento']);
    exit;
}

// Bloqueo exclusivo: dos visitas simultáneas no se pisan
flock($fp, LOCK_EX);
$data = json_decode(stream_get_contents($fp) ?: '{}', true) ?: [];
$data += ['total' => 0, 'dia' => $today, 'hoy' => 0];  // valores por defecto si el archivo es nuevo

if ($data['dia'] !== $today) {      // cambio de día → reinicia "hoy"
    $data['dia'] = $today;
    $data['hoy'] = 0;
}

if ($hit) {
    $data['total']++;
    $data['hoy']++;
    // Reescribe el archivo completo: vaciar, volver al inicio y escribir
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
}

flock($fp, LOCK_UN);  // libera el bloqueo para la siguiente visita
fclose($fp);

// Respuesta que lee components/visits.js
echo json_encode(['total' => (int) $data['total'], 'hoy' => (int) $data['hoy']]);
