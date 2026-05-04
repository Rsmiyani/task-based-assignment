<?php

declare(strict_types=1);

require __DIR__ . '/config.php';

$code = preg_replace('/\D/', '', (string) ($_GET['code'] ?? ''));
$content = '';
$error = '';

if (strlen($code) !== 4) {
    $error = 'Please enter a valid 4-digit code.';
} else {
    $stmt = db()->prepare('SELECT content FROM clipboards WHERE code = ? LIMIT 1');
    $stmt->execute([$code]);
    $row = $stmt->fetch();

    if ($row) {
        $content = (string) $row['content'];
    } else {
        $error = 'No saved text found for that code.';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>View Clipboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main class="container">
        <h1>Clipboard Result</h1>
        <p class="subtitle">Code: <?php echo htmlspecialchars($code, ENT_QUOTES, 'UTF-8'); ?></p>

        <?php if ($error !== ''): ?>
            <div class="notice error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
            <p><a href="index.php">Back</a></p>
        <?php else: ?>
            <section class="card">
                <h2>Saved Text</h2>
                <pre id="clipboardText"><?php echo htmlspecialchars($content, ENT_QUOTES, 'UTF-8'); ?></pre>
                <button type="button" id="copyButton">Copy Text</button>
            </section>
            <p><a href="index.php">Back</a></p>
        <?php endif; ?>
    </main>

    <?php if ($content !== ''): ?>
        <script>
            window.clipboardText = <?php echo json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
        </script>
        <script src="script.js"></script>
    <?php endif; ?>
</body>
</html>
