/* «Вместе» — режим макета: картинки заменяются серыми плашками с подписью, что там будет. */
(function () {
  document.documentElement.id = 'w';
  function ph(img) {
    const box = document.createElement('div');
    const r = img.getBoundingClientRect();
    box.className = 'w-ph' + (img.closest('.partners') ? ' logo' : '');
    box.textContent = (img.closest('.partners') ? 'Логотип: ' : 'Фото: ') + (img.alt || 'изображение');
    if (r.height) box.style.height = Math.round(r.height) + 'px';
    else if (!box.classList.contains('logo')) box.style.aspectRatio = '4 / 3';
    img.replaceWith(box);
  }
  function run() {
    document.querySelectorAll('img').forEach(ph);
    document.body.insertAdjacentHTML('beforeend', '<div class="w-badge">Макет без дизайна</div>');
  }
  document.readyState === 'complete' ? run() : addEventListener('load', run);
})();
