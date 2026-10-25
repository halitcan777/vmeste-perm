/* «вместе» — общие шапка, подвал, наклейки-фигуры и ленты для всех страниц.
   Логотип берётся из assets/logo/sprite.svg (#logo — круг, #word — слово без круга). */
const B_SPRITE = 'assets/logo/sprite.svg';
const B_NAV = [['about.html', 'О нас'], ['afisha.html', 'Афиша'], ['directions.html', 'Направления'], ['experts.html', 'Эксперты'], ['news.html', 'Новости']];
const B_TAPES = {
  a: ['открываемся 1 ноября', 'ленина, 44', 'приходи одному, уйдёшь с друзьями', 'вход бесплатный', 'пять вечеров в неделю'],
  b: ['пн профориентация', 'вт общение', 'ср бизнес', 'чт проекты', 'пт для своих']
};

function bLogo(cls) { return `<svg class="${cls || ''}" viewBox="0 0 1000 1000" aria-hidden="true"><use href="${B_SPRITE}#logo"/></svg>`; }

// звезда-взрыв: n лучей, внешний и внутренний радиус
function bBurst(n, r1, r2) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
}

const B_SHAPES = {
  burst: `<path fill="currentColor" d="${bBurst(12, 50, 31)}"/>`,
  spiky: `<path fill="currentColor" d="${bBurst(9, 50, 22)}"/>`,
  spark: '<path fill="currentColor" d="M50 0C54 27 73 46 100 50 73 54 54 73 50 100 46 73 27 54 0 50 27 46 46 27 50 0Z"/>',
  star: '<path fill="currentColor" stroke="currentColor" stroke-width="8" stroke-linejoin="round" d="M50 7 62 37 94 38 69 58 78 90 50 72 22 90 31 58 6 38 38 37Z"/>',
  tri: '<path fill="currentColor" stroke="currentColor" stroke-width="10" stroke-linejoin="round" d="M50 12 91 84H9Z"/>',
  ring: '<circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" stroke-width="14"/>',
  dot: '<circle cx="50" cy="50" r="46" fill="currentColor"/>',
  heart: '<path fill="currentColor" d="M50 90C19 67 5 51 5 32 5 18 16 8 30 8c9 0 16 5 20 13 4-8 11-13 20-13 14 0 25 10 25 24 0 19-14 35-45 58Z"/>',
  wave: '<path fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" d="M5 50c8-16 15-16 22 0s14 16 22 0 15-16 22 0 14 16 22 0"/>',
  plus: '<path fill="currentColor" d="M39 5h22v34h34v22H61v34H39V61H5V39h34Z"/>',
  flower: '<g fill="currentColor"><circle cx="50" cy="24" r="22"/><circle cx="76" cy="50" r="22"/><circle cx="50" cy="76" r="22"/><circle cx="24" cy="50" r="22"/><circle cx="50" cy="50" r="22"/></g>',
  logo: `<use href="${B_SPRITE}#logo"/>`,
  // дудлы от руки: только контур
  loop: '<path class="d" d="M12 60C18 30 60 22 70 44 78 62 52 74 44 60 36 46 60 34 76 46 88 56 86 74 72 86"/>',
  rays: '<path class="d" d="M16 42 36 54M50 12 52 40M86 38 66 52"/>',
  dstar: '<path class="d" d="M50 8 61 38 93 39 68 58 77 90 50 72 23 90 32 58 7 39 39 38Z"/><path class="d" style="stroke-width:3" d="M53 12 62 41 89 43 66 60 73 86 50 70 27 87 35 60 11 43 41 41Z"/>',
  dheart: '<path class="d" d="M50 86C22 66 8 50 9 33 10 19 21 11 33 12c9 1 14 7 17 14 3-8 9-14 18-14 12 0 22 9 21 23-1 17-15 33-39 51Z"/><path class="d" style="stroke-width:3" d="M18 30c2-9 9-13 16-12"/>'
};
// стрелки от руки для пометок .b-note[data-a]: dr вниз-вправо, dl вниз-влево, l влево
const B_ARROWS = {
  dr: '<path d="M6 10C30 6 52 18 60 46"/><path d="M47 39 60 47 65 33"/>',
  dl: '<path d="M74 10C50 8 28 22 20 46"/><path d="M13 33 19 48 33 43"/>',
  l: '<path d="M76 34C58 12 28 12 10 30"/><path d="M21 19 9 31 24 37"/>'
};


(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = B_NAV.map(([href, name]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${name}</a>`).join('');
  const home = document.body.classList.contains('b-page');

  document.body.insertAdjacentHTML('afterbegin',
    `<header class="b-head"><div class="b-wrap"><a class="b-logo" href="index.html" aria-label="вместе, на главную">${bLogo()}</a>
<nav class="b-nav" id="b-nav">${nav}</nav>
<div class="b-head-r"><a class="b-btn sm" href="index.html#join">Вступить</a><button class="b-burger" type="button" aria-expanded="false" aria-controls="b-nav">Меню</button></div></div></header>`);

  document.body.insertAdjacentHTML('beforeend',
    `<footer class="b-foot${home ? ' b-zig-t' : ''}"><div class="b-wrap"><div class="b-foot-grid">
<div><div class="b-foot-logo">${bLogo()}</div><p style="margin-top:18px;max-width:360px">Молодёжное движение в Перми</p></div>
<div class="col"><b>разделы</b>${B_NAV.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}</div>
<div class="col"><b>где мы</b><p>Пермь, ул. Ленина, 44</p><a href="https://t.me/Paltus10">Телеграм</a><a href="https://t.me/+Bs7x5h7SbtI4NWQy">Рабочий чат</a><a href="privacy.html">Политика данных</a></div>
</div><div class="copy"><span>© 2026 вместе</span><span class="hand">сделано в перми своими руками</span></div></div></footer>`);

  // мобильное меню
  const head = document.querySelector('.b-head'), burger = head.querySelector('.b-burger');
  burger.addEventListener('click', () => {
    const open = head.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? 'Закрыть' : 'Меню';
  });

  // наклейки: <i class="b-st" data-s="burst" style="--x:..;--y:..;--s:..;--c:..">
  document.querySelectorAll('.b-st[data-s]').forEach(el => {
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 ${el.dataset.s === 'logo' ? 1000 : 100} ${el.dataset.s === 'logo' ? 1000 : 100}">${B_SHAPES[el.dataset.s] || ''}</svg>`;
  });

  // пометки от руки: стрелка до или после текста
  document.querySelectorAll('.b-note[data-a]').forEach(el => {
    const svg = `<svg viewBox="0 0 80 60" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${B_ARROWS[el.dataset.a] || ''}</g></svg>`;
    el.insertAdjacentHTML(el.dataset.side === 'before' ? 'afterbegin' : 'beforeend', svg);
  });

  // ленты: <div class="b-tape a" data-t="a"></div>; половина дорожки шире любого экрана
  document.querySelectorAll('.b-tape[data-t]').forEach(el => {
    const run = (B_TAPES[el.dataset.t] || []).map(t => `<span>${t}</span><i>✦</i>`).join('');
    el.innerHTML = `<div>${run.repeat(3)}${run.repeat(3)}</div>`;
  });
})();
