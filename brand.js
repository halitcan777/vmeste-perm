/* «вместе» — общие шапка, подвал и киноплёнка для всех страниц.
   Логотип берётся из assets/logo/sprite.svg (#logo — круг, #word — слово без круга). */
const B_SPRITE = 'assets/logo/sprite.svg';
const B_NAV = [['about.html', 'О нас'], ['afisha.html', 'Афиша'], ['directions.html', 'Направления'], ['experts.html', 'Эксперты'], ['news.html', 'Новости']];
const B_FILM = ['открываемся 1 ноября', 'ленина, 44', 'приходи одному, уйдёшь с друзьями', 'пн профориентация', 'вт общение', 'ср бизнес', 'чт проекты', 'пт для своих', 'вход бесплатный'];

function bLogo() { return `<svg viewBox="0 0 1000 1000" aria-hidden="true"><use href="${B_SPRITE}#logo"/></svg>`; }

(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = B_NAV.map(([href, name]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${name}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin',
    `<header class="b-head"><div class="b-wrap"><a class="b-logo" href="index.html" aria-label="вместе, на главную">${bLogo()}</a>
<nav class="b-nav" id="b-nav">${nav}</nav>
<div class="b-head-r"><a class="b-btn sm" href="index.html#join">Вступить</a><button class="b-burger" type="button" aria-expanded="false" aria-controls="b-nav">Меню</button></div></div></header>`);

  document.body.insertAdjacentHTML('beforeend',
    `<footer class="b-foot"><div class="b-wrap"><div class="b-foot-grid">
<div><div class="b-foot-logo">${bLogo()}</div><p class="tag">Молодёжное движение в Перми</p></div>
<div class="col"><b>разделы</b>${B_NAV.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}</div>
<div class="col"><b>где мы</b><p>Пермь, ул. Ленина, 44</p><a href="https://t.me/Paltus10">Телеграм</a><a href="https://t.me/+Bs7x5h7SbtI4NWQy">Рабочий чат</a><a href="privacy.html">Политика данных</a></div>
</div><div class="copy"><span>© 2026 вместе</span><span>сделано в перми своими руками</span></div></div></footer>`);

  // мобильное меню
  const head = document.querySelector('.b-head'), burger = head.querySelector('.b-burger');
  burger.addEventListener('click', () => {
    const open = head.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? 'Закрыть' : 'Меню';
  });

  // киноплёнка: <div class="b-film" aria-hidden="true"></div>; половина дорожки шире любого экрана
  document.querySelectorAll('.b-film').forEach(el => {
    const run = B_FILM.map(t => `<span>${t}</span><i>●</i>`).join('');
    el.innerHTML = `<div>${run.repeat(2)}${run.repeat(2)}</div>`;
  });
})();
