<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$content = trim((string) ($_POST['content'] ?? ''));

if ($content === '') {
    header('Location: index.php?error=empty');
    exit;
}

$pdo = db();
$code = '';

for ($attempt = 0; $attempt < 100; $attempt++) {
    $code = (string) random_int(1000, 9999);

    $check = $pdo->prepare('SELECT 1 FROM clipboards WHERE code = ? LIMIT 1');
    $check->execute([$code]);

    if ($check->fetchColumn() === false) {
        break;
    }
}

if ($code === '') {
    http_response_code(500);
    echo 'Unable to generate a unique code.';
    exit;
}

$stmt = $pdo->prepare('INSERT INTO clipboards (code, content) VALUES (?, ?)');
$stmt->execute([$code, $content]);

header('Location: index.php?saved=1&code=' . urlencode($code));
exit;
