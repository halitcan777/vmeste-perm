/* «Вместе» — общие части сайта: лента событий, шапка, меню, подвал и рендер блоков.
   Подключать после events.js и content.js. Страница помечает себя <body data-page="...">.
   Правила владельца (26.10): без линий-разделителей и точек-разделителей; фото показываем только при SHOW_PHOTOS. */

// Пункты меню; «Блог» выводится, только когда есть записи (navItems)
const NAV = [
  ['afisha.html', 'Афиша', 'afisha'],
  ['team.html', 'Команда', 'team'],
  ['people.html', 'Эксперты', 'people'],
  ['partners.html', 'Партнёры', 'partners'],
  ['blog.html', 'Блог', 'blog'],   // показывается, только если есть записи (см. renderHead)
  ['about.html', 'О нас', 'about'],
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const page = document.body.dataset.page || '';
const photo = src => (typeof SHOW_PHOTOS !== 'undefined' && SHOW_PHOTOS && src) ? src : '';
const ROLE_NAME = { team: 'Команда', expert: 'Эксперт', guest: 'Гость встречи' };
// какие ассоциативные кадры уже сгенерированы (список обновляется при генерации)
const ASSOC_READY = typeof ASSOC_FILES !== 'undefined' ? ASSOC_FILES : [];
const assocReady = src => ASSOC_READY.some(f => src.endsWith('/' + f));

/* ---------- лента над шапкой: фразы из принципов ---------- */
// «Блог» — только при записях; «Партнёры» — когда подтверждённых партнёров хотя бы три (28.10, решение владельца)
function navItems(){
  const posts = typeof POSTS !== 'undefined' && POSTS.length;
  const partners = typeof PARTNERS !== 'undefined' && PARTNERS.filter(p => p.status === 'partner').length >= 3;
  return NAV.filter(n => (n[2] !== 'blog' || posts) && (n[2] !== 'partners' || partners));
}

function renderTicker(){
  const el = document.getElementById('tick');
  if (!el) return;
  let items = TICKER.map(t => `<span class="tick__item">${esc(t)}</span>`);
  while (items.length < 8) items = items.concat(items);
  // дорожка дублируется целиком, чтобы прокрутка шла без шва
  const once = items.join('');
  el.innerHTML = `<div class="tick__track">${once}<span aria-hidden="true">${once}</span></div>`;
}

/* ---------- шапка и мобильное меню ---------- */
function renderHead(){
  const el = document.getElementById('head');
  if (!el) return;
  const links = navItems().map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  el.innerHTML = `<div class="container head__in">
    <a class="head__logo" href="index.html" aria-label="Вместе — на главную"><img src="assets/brand/wordmark-blue.svg" alt="Вместе" width="122" height="28"></a>
    <nav class="head__nav" aria-label="Разделы">${links}</nav>
    <a class="btn btn--sm head__cta" href="${SITE.channel}" target="_blank" rel="noopener">Вступить</a>
    <button class="head__burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><span></span></button>
  </div>
  <div class="menu on-dark" id="menu" hidden role="dialog" aria-modal="true" aria-label="Меню">
    <div class="menu__top"><img src="assets/brand/wordmark-paper.svg" alt="Вместе"><button class="menu__close" type="button" aria-label="Закрыть меню">×</button></div>
    <nav>${navItems().map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
    <a class="btn btn--paper" href="${SITE.channel}" target="_blank" rel="noopener">Вступить</a>
  </div>`;
  const menu = el.querySelector('#menu'), burger = el.querySelector('.head__burger'), main = document.querySelector('main');
  const set = open => {
    menu.hidden = !open; burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (main) main.inert = open;
    (open ? menu.querySelector('.menu__close') : burger).focus();
  };
  burger.addEventListener('click', () => set(true));
  menu.querySelector('.menu__close').addEventListener('click', () => set(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
}

/* ---------- подвал ---------- */
function renderFoot(){
  const el = document.getElementById('foot');
  if (!el) return;
  el.innerHTML = `<div class="container">
    <div class="foot__grid">
      <div class="foot__brand">
        <img class="wordmark" src="assets/brand/wordmark-blue.svg" alt="Вместе" width="243" height="56">
        <p>${esc(SITE.slogan)} ${esc(SITE.about)}</p>
        <a class="btn" href="${SITE.channel}" target="_blank" rel="noopener">Канал в Телеграме</a>
      </div>
      <div><h3>Разделы</h3><ul>${navItems().map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div>
      <div><h3>Где мы</h3><ul><li>${esc(SITE.address)}</li><li>Вход со Старокирпичного переулка</li></ul></div>
      <div><h3>Связь</h3><ul>
        <li><a href="${SITE.channel}" target="_blank" rel="noopener">Канал в Телеграме</a></li>
        <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Инстаграм</a></li>
        <li><a href="${SITE.telegram}" target="_blank" rel="noopener">Написать Платону</a></li>
      </ul></div>
    </div>
    <div class="foot__bottom">
      <span>© ${new Date().getFullYear()} «Вместе», Пермь</span>
      <nav aria-label="Документы"><a href="privacy.html">Политика обработки персональных данных</a><a href="consent.html">Согласие на обработку данных</a></nav>
    </div>
  </div>`;
}

/* ---------- главный кадр: ближайшие события ---------- */
function slideBg(ev, i){
  const src = photo(ev.image);
  return src ? `<figure class="slide__bg"><img src="${src}" alt=""${i ? ' loading="lazy"' : ''}${ev.imagePos ? ` style="object-position:${ev.imagePos}"` : ''}></figure>` : '';
}

function renderHero(){
  const el = document.getElementById('hero');
  if (!el) return;
  const list = upcomingEvents().slice(0, 5);
  if (!list.length) {
    el.classList.add('hero--empty');
    el.innerHTML = `<div class="container"><div class="hero__frame grain hero__frame--flat"><div class="slide">
      <div class="container slide__in"><h1 class="slide__title">${esc(SITE.slogan)}</h1>
      <p class="slide__text">Новые встречи скоро. Анонсы сначала выходят в канале.</p>
      <div class="slide__actions"><a class="btn" href="${SITE.channel}" target="_blank" rel="noopener">Канал в Телеграме</a></div></div>
    </div></div></div>`;
    return;
  }
  const slides = list.map((ev, i) => {
    const d = nextDate(ev);
    return `<article class="slide${ev.textSide === 'right' ? ' slide--right' : ''}"${i ? ' hidden' : ''} aria-roledescription="слайд" aria-label="${i + 1} из ${list.length}">
      ${slideBg(ev, i)}
      <div class="container slide__in">
        <p class="slide__when">${dateKnown(ev) ? `<span>${fmtDay(d)}, ${weekday(d)}</span>${timeKnown(ev) ? `<span>${esc(ev.time)}</span>` : ''}` : `<span>${esc(ev.type || 'Встреча')}</span>`}<span>${esc(ev.place || DEFAULT_PLACE)}</span></p>
        <h1 class="slide__title">${esc(ev.title)}</h1>
        <p class="slide__text">${esc(ev.text)}</p>
        <div class="slide__actions">
          <a class="btn" href="${eventUrl(ev)}">${regNotOpenYet(ev) ? 'Подробнее' : esc(ev.action)}</a>
          <a class="btn btn--line" href="afisha.html">Вся афиша</a>
        </div>
      </div>
    </article>`;
  }).join('');
  const flat = photo(list[0].image) ? 'hero__frame--photo' : 'hero__frame--flat';
  el.innerHTML = `<div class="container"><div class="hero__frame grain ${flat} ${list[0].color || ''}">
    <div class="hero__slides">${slides}</div>
    <div class="hero__bar"><div class="container">
      <span class="num" id="hero-num">${pad2(1)}/${pad2(list.length)}</span>
      <span id="hero-name">${esc(list[0].type || 'Встреча')}</span>
      <div class="hero__ctrl"${list.length < 2 ? ' hidden' : ''}><button type="button" data-step="-1" aria-label="Предыдущее событие">←</button><button type="button" data-step="1" aria-label="Следующее событие">→</button></div>
    </div></div>
  </div></div>`;
  if (list.length < 2) return;
  let cur = 0;
  const all = el.querySelectorAll('.slide'), frame = el.querySelector('.hero__frame');
  const show = n => {
    cur = (n + list.length) % list.length;
    all.forEach((s, i) => s.hidden = i !== cur);
    frame.className = `hero__frame grain ${photo(list[cur].image) ? 'hero__frame--photo' : 'hero__frame--flat'} ${list[cur].color || ''}`;
    el.querySelector('#hero-num').textContent = `${pad2(cur + 1)}/${pad2(list.length)}`;
    el.querySelector('#hero-name').textContent = list[cur].type || 'Встреча';
  };
  el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { show(cur + Number(b.dataset.step)); restart(); }));
  // автопрокрутка по кругу каждые 3 секунды; пауза при наведении/фокусе и при «уменьшить движение»
  let timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = () => { if (!reduce && !timer) timer = setInterval(() => show(cur + 1), 3000); };
  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => { stop(); start(); };
  frame.addEventListener('mouseenter', stop); frame.addEventListener('mouseleave', start);
  frame.addEventListener('focusin', stop); frame.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  start();
}

/* ---------- афиша: месяцы и карточки ---------- */
// Куда вести с прошедшей встречи: на запись в блоге, если она есть
function pastUrl(ev){ const post = POSTS.find(p => p.event === ev.id); return post ? `post.html?id=${encodeURIComponent(post.id)}` : eventUrl(ev); }

// Карточка встречи как в кинокаталоге: дата сверху, кадр, название. Вся карточка — ссылка.
function eventCard(ev, seats, { big = false } = {}){
  const d = nextDate(ev) || ev.dates[ev.dates.length - 1];
  const future = !!nextDate(ev);
  const url = future ? eventUrl(ev) : pastUrl(ev);
  const multi = ev.dates.length > 1;
  const line = future ? seatLine(ev, d, seats || {}) : '';
  const dd = parseDay(d);
  const pic = photo(ev.image);
  const frame = pic
    ? `<div class="card__img grain"><img src="${pic}" alt="" loading="lazy"${ev.imagePos ? ` style="object-position:${ev.imagePos}"` : ''}></div>`
    : `<div class="card__plate card__plate--poster"><b>${esc(ev.type || 'Встреча')}</b></div>`;
  const where = ev.place && ev.place !== DEFAULT_PLACE ? `, ${esc(ev.place)}` : '';
  // дата и время — только подтверждённые (SHOW_DATES / confirmed); иначе формат и «дата уточняется»
  const top = dateKnown(ev)
    ? `<div class="card__top"><span class="card__num">${pad2(dd.getDate())}.${pad2(dd.getMonth() + 1)}</span><span><span class="card__name">${multi ? 'любой день' : weekday(d)}${timeKnown(ev) ? `, ${esc(ev.time.toLowerCase())}` : ''}</span><br><span class="card__role">${esc(ev.type || 'Встреча')}${where}</span></span></div>`
    : `<div class="card__top card__top--nodate"><span><span class="card__name">${esc(ev.type || 'Встреча')}</span><br><span class="card__role">${future ? 'Дата уточняется' : 'Прошло'}${where}</span></span></div>`;
  return `<a class="ev-card${big ? ' ev-card--big' : ''}${future ? '' : ' ev-card--past'}" href="${url}">
    ${top}
    ${frame}
    <h3 class="ev-card__title">${esc(ev.title)}</h3>
    <p class="ev-card__text">${esc(ev.text)}</p>
    ${line ? `<p class="ev-card__seats">${esc(line)}</p>` : future ? '' : `<p class="ev-card__seats">Уже прошло</p>`}
  </a>`;
}
const eventRow = eventCard; // старое имя

async function renderAfisha(target, { limit = 0, big = false, months = false } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = upcomingEvents().slice(0, limit || undefined);
  const seats = await loadSeats();
  const key = dt => `${dt.getFullYear()}-${dt.getMonth()}`;
  const draw = items => items.length
    ? `<div class="reel">${items.map((ev, i) => eventCard(ev, seats, { big: big && i === 0 })).join('')}</div>`
    : `<p class="events__empty">В этом месяце встреч пока нет. Анонсы сначала выходят в <a class="link" href="${SITE.channel}" target="_blank" rel="noopener">канале</a>.</p>`;
  const tabs = document.getElementById(target + '-months');
  // вкладки месяцев имеют смысл только при подтверждённых датах
  if (tabs && !SHOW_DATES) tabs.hidden = true;
  if (!months || !tabs || !SHOW_DATES) { el.innerHTML = draw(list); return; }
  // ряд месяцев как у Триумфа: текущий и шесть следующих; активен первый с встречами
  const now = new Date(), first = list.length ? parseDay(nextDate(list[0])) : now;
  const seq = [...Array(7)].map((_, i) => new Date(now.getFullYear(), now.getMonth() + i, 1));
  const has = k => list.some(ev => key(parseDay(nextDate(ev))) === k);
  let cur = key(first);
  if (!seq.some(d => key(d) === cur)) seq.unshift(new Date(first.getFullYear(), first.getMonth(), 1));
  const render = () => {
    tabs.innerHTML = seq.map(d => `<button type="button" data-m="${key(d)}" aria-pressed="${key(d) === cur}"${has(key(d)) ? '' : ' disabled'}>${MONTHS_NOM[d.getMonth()]}</button>`).join('');
    el.innerHTML = draw(list.filter(ev => key(parseDay(nextDate(ev))) === cur));
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; cur = b.dataset.m; render(); });
  render();
}

// Прошедшие встречи
function renderPast(target){
  const el = document.getElementById(target);
  if (!el) return;
  const list = pastEvents();
  el.innerHTML = list.length ? `<div class="reel">${list.map(ev => eventCard(ev, {})).join('')}</div>` : `<p class="events__empty">Пока ничего не прошло: мы только открываемся.</p>`;
}

/* ---------- постеры событий ---------- */
// У каждой встречи свой постер 16:9: реальный кадр гостя (или кадр встречи) + типографика. Девять композиций,
// в events.js у встречи poster: { variant, color, title ('|' = перенос строки), kicker, sub, photo, pos }.
// Фирменная обработка общая: кадры ч/б или дуотон в цветах бренда, зерно и растр печати, сдвиг цвета на заголовке, штамп «Вместе».
const POSTER_VARIANTS = ['paper', 'duo', 'night', 'acid', 'frame', 'stars', 'white', 'circle', 'swiss', 'numeral', 'strips', 'boxes', 'riso', 'vertical', 'type'];
// Заголовок: базовый размер и ширина колонки по композициям (cqw), чтобы длинное слово («Бесфамильная») ужалось, а не обрезалось
const POSTER_FIT = { paper: [9, 44], duo: [10, 36], night: [10.5, 64], acid: [12.5, 72], frame: [8.5, 42], stars: [9.5, 47], white: [11, 56], circle: [9, 62], swiss: [9, 46], numeral: [7.5, 50], strips: [12, 80], boxes: [9, 70], riso: [11, 60], vertical: [11, 70], type: [10.5, 80] };
function posterData(ev){
  const p = ev.poster || {};
  const guests = (ev.people || []).map(id => PEOPLE.find(x => x.id === id)).filter(Boolean);
  const guest = guests[0];
  const d = nextDate(ev) || ev.dates[ev.dates.length - 1];
  const own = p.photo || (guest && guest.photo) || ev.image;
  return {
    variant: POSTER_VARIANTS.includes(p.variant) ? p.variant : POSTER_VARIANTS[[...ev.id].reduce((a, c) => a + c.charCodeAt(0), 0) % POSTER_VARIANTS.length],
    color: p.color || ev.color || 'wine',
    photo: photo(own),
    pos: p.pos || (p.photo ? '' : guest && guest.photo ? guest.photoPos : ev.imagePos) || '50% 50%',
    kicker: p.kicker || ev.type || 'Встреча',
    title: p.title || ev.title,
    sub: p.sub || (guest ? guest.position : ev.text),
    when: whenLine(ev) || MONTHS_NOM[parseDay(d).getMonth()],
    num: dateKnown(ev) ? `${pad2(parseDay(d).getDate())}.${pad2(parseDay(d).getMonth() + 1)}` : MONTHS_NOM[parseDay(d).getMonth()],
    place: ev.place || 'Ленина, 44',
    guests,
  };
}
const POSTER_STARS = `<svg class="poster__stars" viewBox="0 0 60 34" aria-hidden="true" preserveAspectRatio="none">
  <path d="M12 15 L13.8 20.6 L19.5 22.5 L13.8 24.4 L12 30 L10.2 24.4 L4.5 22.5 L10.2 20.6 Z"/>
  <path d="M3 2 L3.9 5 L7 6 L3.9 7 L3 10 L2.1 7 L-1 6 L2.1 5 Z"/>
  <path d="M6 12 L6.6 13.8 L8.5 14.4 L6.6 15 L6 16.8 L5.4 15 L3.5 14.4 L5.4 13.8 Z"/>
  <path d="M24 29 L24.6 30.8 L26.5 31.4 L24.6 32 L24 33.8 L23.4 32 L21.5 31.4 L23.4 30.8 Z"/>
  <path d="M56 19 L56.8 21.4 L59.2 22.2 L56.8 23 L56 25.4 L55.2 23 L52.8 22.2 L55.2 21.4 Z"/>
</svg>`;
// Обводка от руки вокруг человека в центре кадра (Заза на ринге): два неровных овала
const POSTER_RING = `<svg class="poster__ring" viewBox="0 0 160 90" aria-hidden="true" preserveAspectRatio="none">
  <path d="M80 5 C 96 4, 98 24, 96 36 C 94 50, 87 58, 78 57.5 C 66 57, 62 45, 63 31 C 64 16, 69 5.5, 80 5 Z"/>
  <path d="M81.5 8 C 94 8, 95.5 25, 93.5 36 C 91.5 48, 86 55, 78.5 54.5 C 68.5 54, 65 44, 66 31 C 67 18, 71 8.5, 81.5 8" style="stroke-width:.45"/>
</svg>`;
function posterHTML(ev, { link = true } = {}){
  const x = posterData(ev);
  const img = (src, pos, extra = '') => `<img src="${src}" alt="" loading="lazy" style="object-position:${pos}"${extra}>`;
  const ph = x.photo ? `<div class="poster__ph">${img(x.photo, x.pos)}</div>` : '';
  const lines = x.title.split(/\s*\|\s*/), longest = Math.max(...lines.map(l => l.length)) + (x.variant === 'acid' ? 1 : 0);
  const [base, width] = POSTER_FIT[x.variant], lower = x.variant === 'duo' || x.variant === 'stars';
  const size = Math.min(base, width / ((lower ? .5 : .54) * longest)).toFixed(2);
  const title = `<h3 class="poster__title" style="--ts:${size}cqw">${lines.map(esc).join('<br>')}${x.variant === 'acid' ? '.' : ''}</h3>`;
  // цифры даты (или слово месяца, пока даты нет): ужимаются по длине, чтобы не лезть на кадр
  const numSize = Math.min(26, 50 / (0.56 * x.num.length)).toFixed(1);
  const marq = () => `<p class="poster__marq" aria-hidden="true">${`<span>${esc(x.kicker)}</span><span>Вместе</span><span>${esc(x.place)}</span>`.repeat(6)}</p>`;
  const k = text => `<p class="poster__k">${text}</p>`;
  const meta = text => `<p class="poster__meta">${esc(text)}</p>`;
  const foot = (...parts) => `<div class="poster__foot">${parts.join('')}</div>`;
  // штамп «Вместе» — наклейка: кремовая плашка с чёрным словом, читается на любом фоне
  const stamp = `<span class="poster__stamp"><img src="assets/brand/wordmark-ink.svg" alt="Вместе"></span>`;
  // Swiss: два ведущих — два портрета с подписями вместо одного кадра
  const faces = x.guests.length > 1
    ? `<div class="poster__faces">${x.guests.slice(0, 3).map(g => `<div class="poster__face">${g.photo ? img(g.photo, g.photoPos || '50% 30%') : ''}<small><b>${esc(g.name)}</b><span>${esc(g.position || '')}</span></small></div>`).join('')}</div>`
    : ph;
  const grid = `<div class="poster__grid"><span><b>Формат</b>${esc(x.kicker)}</span><span><b>Когда</b>${esc(x.when)}</span><span><b>Где</b>${esc(x.place)}</span></div>`;
  const body = {
    paper:  `${ph}${k(esc(x.kicker))}${title}${foot(meta(x.sub), `<p class="poster__big">${esc(x.when)}</p>`)}${stamp}`,
    duo:    `${ph}${title}${foot(k(`${esc(x.kicker)}<br>${esc(x.when)}`), meta(x.sub))}${stamp}`,
    night:  `${ph}${marq()}${marq()}${title}${k(`${esc(x.when)}<br>${esc(x.place)}`)}${stamp}`,
    acid:   `${ph}<span class="poster__sq poster__sq--tl"></span><span class="poster__sq poster__sq--bl"></span>${k(`${esc(x.kicker)}<br>${esc(x.place)}`)}${title}<p class="poster__big">${esc(x.when)}</p>${stamp}`,
    frame:  `${ph}${k(`<span>${esc(x.kicker)}</span><span>${esc(x.when)}</span>`)}${foot(title, meta(x.sub))}${stamp}`,
    stars:  `${ph}${POSTER_STARS}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    white:  `${ph}${k(`${esc(x.kicker)}`)}${meta(x.sub)}<p class="poster__big">${esc(x.when)}</p>${title}${stamp}`,
    circle: `${ph}${POSTER_RING}${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${title}${stamp}`,
    numeral: `${ph}${k(esc(x.kicker))}<p class="poster__num" style="--ns:${numSize}cqw">${esc(x.num)}</p>${foot(title, meta(x.sub))}${stamp}`,
    strips: `${[0, 1, 2].map(i => `<div class="poster__ph poster__strip" style="left:${i * 34}cqw">${x.photo ? `<img src="${x.photo}" alt="" loading="lazy" style="object-position:${x.pos};margin-left:${-i * 34}cqw">` : ''}</div>`).join('')}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    boxes:  `${ph}<h3 class="poster__title poster__boxes" style="--ts:${size}cqw">${lines.map(l => `<span>${esc(l)}</span>`).join('')}</h3>${k(`${esc(x.kicker)}<br>${esc(x.when)}, ${esc(x.place)}`)}${meta(x.sub)}${stamp}`,
    riso:   `${ph}${k(`${esc(x.kicker)}<br>${esc(x.when)}`)}${title}${meta(x.sub)}${stamp}`,
    vertical: `${ph}<p class="poster__vert">${esc(x.kicker)}</p><p class="poster__box">${esc(x.when)}</p>${title}${meta(x.sub)}${stamp}`,
    type:   `${k(esc(x.kicker))}<p class="poster__big">${esc(x.when)}</p>${title}${meta(x.sub)}${stamp}`,
    swiss:  `${faces}${k(esc(x.guests.length > 1 ? 'Ведут ' + x.guests.map(g => g.name.split(' ')[0]).join(' и ') : x.kicker))}${title}${grid}${stamp}`,
  }[x.variant];
  const tag = link ? 'a' : 'div';
  return `<${tag} class="poster p-${x.variant} ${x.color} grain"${link ? ` href="${eventUrl(ev)}" aria-label="${esc(ev.title)}"` : ''}>${body}</${tag}>`;
}

// Лента постеров: один месяц на экране, кнопки соседних месяцев. Месяц берём по внутренней дате
// (числа без подтверждения не показываем — см. SHOW_DATES в events.js).
function renderPosters(target, { months = true, limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = upcomingEvents();
  if (!list.length) { el.innerHTML = `<p class="events__empty">Новых встреч пока нет. Анонсы сначала выходят в <a class="link" href="${SITE.channel}" target="_blank" rel="noopener">канале</a>.</p>`; return; }
  const key = ev => { const d = parseDay(nextDate(ev)); return `${d.getFullYear()}-${d.getMonth()}`; };
  const keys = [...new Set(list.map(key))];
  const name = k => MONTHS_NOM[Number(k.split('-')[1])];
  let i = 0;
  const draw = () => {
    const items = list.filter(ev => key(ev) === keys[i]).slice(0, limit || undefined);
    const nav = months ? `<div class="mbar"><b>${name(keys[i])}</b><div class="mbar__nav">${i > 0 ? `<button type="button" class="btn btn--line btn--sm" data-m="-1">${name(keys[i - 1])}</button>` : ''}${i < keys.length - 1 ? `<button type="button" class="btn btn--line btn--sm" data-m="1">${name(keys[i + 1])}</button>` : ''}</div></div>` : '';
    el.innerHTML = `${nav}<div class="pfeed">${items.map(ev => posterHTML(ev)).join('')}</div>`;
    el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { i += Number(b.dataset.m); draw(); el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }));
  };
  draw();
}
const renderSchedule = renderPosters; // старое имя

// Эксперт крупно: фото слева, текст справа; остальные — строкой имён
function renderSpotlight(target){
  const el = document.getElementById(target);
  if (!el) return;
  const all = PEOPLE.filter(p => p.role === 'expert' || p.role === 'guest').sort((a, b) => (a.role === 'expert' ? 0 : 1) - (b.role === 'expert' ? 0 : 1));
  const main = all.find(p => p.photo) || all[0];
  if (!main) { el.innerHTML = ''; return; }
  const rest = all.filter(p => p !== main);
  el.innerHTML = `<div class="spot">
    ${main.photo ? `<a class="spot__img grain" href="person.html?id=${encodeURIComponent(main.id)}"><img src="${main.photo}" alt="${esc(main.name)}" loading="lazy"${main.photoPos ? ` style="object-position:${main.photoPos}"` : ''}></a>` : ''}
    <div class="spot__text">
      <h3>${esc(main.name)}</h3>
      <p class="spot__role">${esc(main.position || ROLE_NAME[main.role])}</p>
      <p class="spot__about">${esc(((main.about && main.about[0]) || '').split(/(?<=\.)\s/)[0])}</p>
      ${main.talk ? `<p class="spot__talk"><b>О чём поговорить</b>${esc(main.talk)}</p>` : ''}
      <div class="actions"><a class="btn btn--line" href="person.html?id=${encodeURIComponent(main.id)}">Страница эксперта</a></div>
    </div>
  </div>
  ${rest.length ? `<p class="spot__rest"><span>Также</span>${rest.map(p => `<a href="person.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a>`).join('')}</p>` : ''}`;
}

// Лента партнёров: компактные плашки без номеров
function renderPartnerStrip(target, { limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  el.innerHTML = `<div class="pstrip">${PARTNERS.filter(p => p.status === 'partner').slice(0, limit || undefined).map(p => { const tag = p.url ? 'a' : 'span'; return `<${tag} class="pstrip__item"${p.url ? ` href="${p.url}" target="_blank" rel="noopener"` : ''}>${p.logo ? `<img src="${p.logo}" alt="${esc(p.name)}" loading="lazy">` : `<b>${esc(p.name)}</b>`}</${tag}>`; }).join('')}
    <a class="pstrip__item pstrip__item--call" href="partners.html"><b>Стать партнёром</b></a></div>`;
}

/* ---------- форматы встреч ---------- */
// Форматы строками: название в своём цвете, что это, ближайшая встреча этого формата (по type в афише)
function renderFormats(target){
  const el = document.getElementById(target);
  if (!el) return;
  const up = upcomingEvents();
  el.innerHTML = `<div class="fmts">${FORMATS.map(f => {
    const ev = up.find(e => e.type === f.name);
    const next = ev ? `<span class="fmt__next"><small>Ближайшая</small>${esc(ev.title)}<em>${esc(whenLine(ev) || MONTHS_NOM[parseDay(nextDate(ev)).getMonth()])}</em></span>`
                    : `<span class="fmt__next"><small>Ближайшая</small>Скоро в афише</span>`;
    return `<a class="fmt fmt--${f.color}" href="${ev ? eventUrl(ev) : 'afisha.html'}">
      <span class="fmt__name">${esc(f.name)}</span>
      <span class="fmt__text">${esc(f.text)}</span>
      ${next}
    </a>`; }).join('')}</div>`;
}

/* ---------- карточки: люди, партнёры, блог ----------
   Кадр карточки = фото; пока фото нет — плашка с текстом. */
function personCard(p, i){
  const frame = p.photo
    ? `<div class="card__img grain"><img src="${p.photo}" alt="${esc(p.name)}" loading="lazy"${p.photoPos ? ` style="object-position:${p.photoPos}"` : ''}></div>`
    : `<div class="card__plate card__plate--empty"><span>Кадр скоро</span></div>`;
  return `<a class="card" href="person.html?id=${encodeURIComponent(p.id)}">
    <div class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(p.name)}</span><br><span class="card__role">${esc(p.position || ROLE_NAME[p.role] || '')}</span></span></div>
    ${frame}
  </a>`;
}

function callCard(i, title, text, href, label, note, color){
  return `<a class="card" href="${href}" target="_blank" rel="noopener">
    <div class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(label)}</span><br><span class="card__role">${esc(note)}</span></span></div>
    <div class="card__plate card__plate--call ${color || ''}"><b>${esc(title)}</b><span>${esc(text)}</span></div>
  </a>`;
}

// Команда — сетка на 4 колонки
// В команду вступают только через личные сообщения Илье (общего чата пока нет) — последняя карточка сетки.
function renderTeam(target, { limit = 0, invite = true } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PEOPLE.filter(p => p.role === 'team').slice(0, limit ? limit - (invite ? 1 : 0) : undefined);
  const cards = list.map(personCard);
  if (invite) {
    const ilya = PEOPLE.find(p => p.id === 'ilya');
    cards.push(callCard(list.length, 'Вступить в команду', 'Хочешь делать «Вместе» с нами? Напиши Илье: кто ты и чем хочешь заниматься.', (ilya && ilya.contact) || SITE.telegram, 'Место в команде', 'Напиши Илье Амирову', 'green'));
  }
  el.innerHTML = `<div class="reel reel--4" id="${target}-grid">${cards.join('')}</div>`;
}

// Команда на главной: 16 квадратов встык без подписей, фото всех участников; клик — страница человека
function renderTeamMosaic(target, { count = 16 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  // только настоящие фото (без ассоциативных кадров): Илья первым, Платон вторым, дальше пустые квадраты
  const team = PEOPLE.filter(p => p.role === 'team');
  const first = ['ilya', 'platon'].map(id => team.find(p => p.id === id)).filter(Boolean);
  const list = [...first, ...team.filter(p => !first.includes(p))].slice(0, count);
  el.innerHTML = `<div class="mosaic">${list.map(p => `<a class="mosaic__item${p.photo ? '' : ' mosaic__item--empty'}" href="person.html?id=${encodeURIComponent(p.id)}" aria-label="${esc(p.name)}" title="${esc(p.name)}">${p.photo ? `<img src="${p.photo}" alt="" loading="lazy"${p.photoPos ? ` style="object-position:${p.photoPos}"` : ''}>` : ''}</a>`).join('')}</div>`;
}

// Эксперты и гости встреч — одной сеткой, эксперты первыми; в конце приглашение стать экспертом
function renderPeople(target, { roles = ['expert', 'guest'], invite = true, limit = 0, compact = false } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PEOPLE.filter(p => roles.includes(p.role)).sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role)).slice(0, limit || undefined);
  const cards = list.map(personCard);
  if (invite) cards.push(callCard(list.length, 'Стать экспертом', compact ? 'Напиши нам' : 'Поделись опытом на встрече: профессия, своё дело, путь. Формат подберём вместе.', SITE.telegram, 'Место для тебя', 'Напиши нам в Телеграм'));
  el.innerHTML = `<div class="reel${compact ? ' reel--6' : ''}">${cards.join('')}</div>`;
}

function renderPartners(target, { invite = true, limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PARTNERS.filter(p => p.status === 'partner').slice(0, limit || undefined);
  const cards = list.map((p, i) => {
    const frame = p.logo ? `<div class="card__plate card__plate--logo"><img src="${p.logo}" alt="${esc(p.name)}" loading="lazy"></div>`
      : `<div class="card__plate card__plate--poster"><b>${esc(p.name)}</b></div>`;
    const tag = p.url ? 'a' : 'div';
    return `<${tag} class="card"${p.url ? ` href="${p.url}" target="_blank" rel="noopener"` : ''}>
      <div class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(p.name)}</span><br><span class="card__role">${esc(p.note || 'Партнёр')}</span></span></div>
      ${frame}
    </${tag}>`;
  });
  if (invite) cards.push(callCard(list.length, 'Стать партнёром', 'Помочь со стартом, провести встречу для ребят или дать задачу компании для практики.', SITE.telegram, 'Ваша компания', 'Напишите нам в Телеграм', 'blue'));
  el.innerHTML = `<div class="reel">${cards.join('')}</div>`;
}

function postDate(post){
  const ev = post.event && eventById(post.event);
  return post.date ? fmtDay(post.date) : ev ? fmtRange(ev) : '';
}

function renderPosts(target, { limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = POSTS.slice(0, limit || undefined);
  el.innerHTML = `<div class="reel">${list.map((p, i) => {
    const src = photo(p.image);
    const frame = src ? `<div class="card__img grain"><img src="${src}" alt="" loading="lazy"></div>` : `<div class="card__plate">${esc(p.lead)}</div>`;
    return `<a class="card" href="post.html?id=${encodeURIComponent(p.id)}">
      <div class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(p.title)}</span><br><span class="card__role">${esc(postDate(p))}</span></span></div>
      ${frame}${src ? `<p class="card__text">${esc(p.lead)}</p>` : ''}
    </a>`;
  }).join('')}</div>`;
}

/* ---------- страница человека: кадр-слайдер, каталог кадров, короткий текст ---------- */
// Кадры на странице человека: три штуки. Портрет из карточки добавляется первым, только если своих кадров меньше трёх.
const PERSON_SHOTS = 3;
function personShots(p){
  const shots = [...(p.photos || [])];
  if (p.photo && shots.length < PERSON_SHOTS && !shots.some(x => x.src === p.photo)) shots.unshift({ src: p.photo, pos: p.photoPos, note: 'Портрет' });
  return shots.slice(0, PERSON_SHOTS);
}

function renderPerson(target){
  const el = document.getElementById(target);
  if (!el) return;
  const p = PEOPLE.find(x => x.id === new URLSearchParams(location.search).get('id'));
  const back = p && p.role === 'team' ? ['team.html', 'Команда'] : ['people.html', 'Эксперты'];
  if (!p) {
    el.innerHTML = `<section class="page-head"><div class="container"><p class="crumbs"><a href="people.html">Эксперты</a></p><h1>Страница не найдена</h1><p class="lead">Возможно, ссылка устарела.</p><div class="actions"><a class="btn" href="team.html">Команда</a><a class="btn btn--line" href="people.html">Эксперты</a></div></div></section>`;
    return;
  }
  document.title = `${p.name} — Вместе`;
  const role = p.position || ROLE_NAME[p.role];
  const shots = personShots(p);
  // фон шапки — ассоциативный кадр (bg), не фото человека: он размыт и работает как настроение
  const bg = p.bg || (p.assoc && assocReady(p.assoc) ? p.assoc : '');
  // 1. Кадр: размытое фото на фоне (ассоциация с человеком, не забирает фокус), имя крупно, текст расставлен по кадру
  const hero = `<section class="phero"><div class="container"><div class="phero__frame${bg ? '' : ' phero__frame--flat'} grain">
      ${bg ? `<img class="phero__bg" src="${bg}" alt="">` : ''}
      <div class="phero__in">
        <p class="phero__top"><a href="${back[0]}">${back[1]}</a><span>${esc(role)}</span></p>
        <h1 class="phero__name">${esc(p.name)}</h1>
        <div class="phero__cols">
          <p class="phero__about">${esc((p.about && p.about[0]) || 'Рассказ появится после открытия.')}</p>
          ${p.talk ? `<p class="phero__talk"><b>О чём поговорить</b>${esc(p.talk)}</p>` : '<span></span>'}
        </div>
        <p class="phero__foot"><span>Вместе</span><span>${esc(ROLE_NAME[p.role])}</span>${p.contact ? `<a class="btn btn--paper btn--sm" href="${p.contact}" target="_blank" rel="noopener">Написать</a>` : ''}</p>
      </div>
    </div></div></section>`;
  // 2. Мозаика кадров: смотреть и открывать на весь экран
  // 2. Мозаика 3×3 слитно: есть кадры — заполняем, остальные клетки пустые (под будущие фото)
  const cells = shots.map((x, i) => `<button type="button" class="grid9__item grain" data-lb="${i}" aria-label="Открыть кадр ${i + 1}"><img src="${x.src}" alt="${esc(x.note || p.name)}" loading="lazy"${x.pos ? ` style="object-position:${x.pos}"` : ''}></button>`);
  while (cells.length < PERSON_SHOTS) cells.push(`<div class="grid9__item grid9__item--empty" aria-hidden="true"></div>`);
  // нет ни одного кадра — ряд не показываем
  const grid = shots.length ? `<section class="section"><div class="container"><div class="grid9">${cells.join('')}</div></div></section>` : '';
  // 3. Остальной текст, если есть
  const more = (p.about && p.about.length > 1) || (p.work && p.work.length) ? `<section class="section section--alt"><div class="container person-grid--text">
      ${p.about && p.about.length > 1 ? `<div class="copy">${p.about.slice(1).map(t => `<p>${esc(t)}</p>`).join('')}</div>` : ''}
      ${p.work && p.work.length ? `<h2 style="margin-top:32px;font-size:32px">Чем занимается во «Вместе»</h2><ul class="list" style="margin-top:12px">${p.work.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    </div></section>` : '';
  // 4. Встречи с участием
  const evs = EVENTS.filter(e => (e.people || []).includes(p.id)).sort((x, y) => parseDay(x.dates[0]) - parseDay(y.dates[0]));
  const meets = evs.length ? `<section class="section${more ? '' : ' section--alt'}"><div class="container"><div class="sec-head"><div><h2>Встречи</h2></div></div><div class="reel">${evs.map(e => eventCard(e, {})).join('')}</div></div></section>` : '';
  el.innerHTML = hero + grid + more + meets;
  initLightbox(el, shots.map(x => ({ src: x.src, note: x.note || '' })));
}

/* ---------- просмотр кадров на весь экран ---------- */
function initLightbox(root, items){
  if (!items.length) return;
  let lb = document.getElementById('lb');
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'lb'; lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Кадр');
    lb.innerHTML = `<button type="button" class="lb__close" aria-label="Закрыть">×</button><button type="button" class="lb__prev" aria-label="Предыдущий">←</button><img class="lb__img" alt=""><button type="button" class="lb__next" aria-label="Следующий">→</button><p class="lb__cap"></p>`;
    document.body.appendChild(lb);
  }
  let cur = 0;
  const show = n => { cur = (n + items.length) % items.length; lb.querySelector('.lb__img').src = items[cur].src; lb.querySelector('.lb__cap').textContent = `${pad2(cur + 1)}/${pad2(items.length)}  ${items[cur].note}`; };
  const open = n => { show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lb__close').focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  root.querySelectorAll('[data-lb]').forEach(b => b.addEventListener('click', () => open(Number(b.dataset.lb))));
  lb.querySelector('.lb__close').onclick = close;
  lb.querySelector('.lb__prev').onclick = () => show(cur - 1);
  lb.querySelector('.lb__next').onclick = () => show(cur + 1);
  lb.onclick = e => { if (e.target === lb) close(); };
  document.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
}

/* ---------- как нас найти: адрес + карта слева, видео справа ---------- */
function renderWhere(target){
  const el = document.getElementById(target);
  if (!el) return;
  const v = SITE.howToFindVideo || '';
  const video = !v ? `<div class="where__video where__video--empty"><span></span><span>Видео от остановки до двери появится после открытия.</span></div>`
    : /\.mp4(\?|$)/i.test(v) ? `<video class="where__video" controls preload="metadata" playsinline src="${v}"></video>`
    : /^https?:/i.test(v) ? `<iframe class="where__video" src="${v}" title="Как нас найти" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    : `<div class="where__video">${v}</div>`;
  // подпись-указатель прямо на видео: рукописный текст и стрелка вниз, в кадр
  const note = `<span class="where__note" aria-hidden="true"><span>как нас найти</span>
    <svg viewBox="0 0 64 120" width="40" height="75" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4c-4 26 2 54 18 74 7 8 13 14 20 18"/><path d="M40 86l12 10-14 2"/></svg></span>`;
  el.innerHTML = `<div class="where">
    <div class="where__map">
      <div class="where__addr"><b>${esc(SITE.address)}</b><span>${esc(SITE.entrance || '')}</span></div>
      <iframe src="${SITE.mapUrl}" title="Карта: ${esc(SITE.address)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    <div class="where__right">${note}${video}</div>
  </div>`;
}

/* ---------- статичные блоки из данных ---------- */
function renderStory(storyId, principlesId, { short = false } = {}){
  const s = document.getElementById(storyId), p = document.getElementById(principlesId);
  if (s) s.innerHTML = (short ? STORY.slice(0, 1) : STORY).map(t => `<p>${esc(t)}</p>`).join('');
  if (p) p.innerHTML = PRINCIPLES.map(x => `<li><b>${esc(x.title)}</b><span>${esc(x.text)}</span></li>`).join('');
}

// Ссылки из SITE: <a data-link="channel">
function bindLinks(){
  document.querySelectorAll('[data-link]').forEach(a => { a.href = SITE[a.dataset.link] || '#'; });
}

renderTicker();
renderHead();
renderFoot();
bindLinks();
