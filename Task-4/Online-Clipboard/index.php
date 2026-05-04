<?php

declare(strict_types=1);

$message = '';
$code = isset($_GET['code']) ? preg_replace('/\D/', '', (string) $_GET['code']) : '';

if (isset($_GET['saved']) && $code !== '') {
    $message = 'Text saved successfully. Share this 4-digit code: ' . $code;
} elseif (isset($_GET['error']) && $_GET['error'] === 'empty') {
    $message = 'Please enter some text before saving.';
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Online Clipboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main class="container">
        <h1>Online Clipboard</h1>
        <p class="subtitle">Save text, get a 4-digit code, and share it with anyone.</p>

        <?php if ($message !== ''): ?>
            <div class="notice"><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>

        <section class="card">
            <h2>Save Text</h2>
            <form action="save.php" method="post">
                <label for="content">Text</label>
                <textarea id="content" name="content" rows="8" required></textarea>
                <button type="submit">Generate Code</button>
            </form>
        </section>

        <section class="card">
            <h2>Fetch Text</h2>
            <form action="fetch.php" method="get">
                <label for="code">4-digit Code</label>
                <input id="code" name="code" type="text" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required>
                <button type="submit">Open Clipboard</button>
            </form>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>
