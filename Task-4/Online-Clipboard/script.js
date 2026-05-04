document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  if (!copyButton || typeof window.clipboardText !== 'string') {
    return;
  }

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.clipboardText);
      copyButton.textContent = 'Copied';
    } catch {
      copyButton.textContent = 'Copy failed';
    }
  });
});
