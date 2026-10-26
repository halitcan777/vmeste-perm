/* «Вместе» — общие части сайта: лента событий, шапка, меню, подвал и рендер блоков.
   Подключать после events.js и content.js. Страница помечает себя <body data-page="...">.
   Правила владельца (26.10): без линий-разделителей и точек-разделителей; фото показываем только при SHOW_PHOTOS. */

const NAV = [
  ['afisha.html', 'Афиша', 'afisha'],
  ['team.html', 'Команда', 'team'],
  ['people.html', 'Эксперты', 'people'],
  ['partners.html', 'Партнёры', 'partners'],
  ['blog.html', 'Блог', 'blog'],
  ['about.html', 'О нас', 'about'],
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const page = document.body.dataset.page || '';
const photo = src => (typeof SHOW_PHOTOS !== 'undefined' && SHOW_PHOTOS && src) ? src : '';
const ROLE_NAME = { team: 'Команда', expert: 'Эксперт', guest: 'Гость встречи' };

/* ---------- лента над шапкой: фразы из принципов ---------- */
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
  const links = NAV.map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  el.innerHTML = `<div class="container head__in">
    <a class="head__logo" href="index.html" aria-label="Вместе — на главную"><img src="assets/brand/wordmark-blue.svg" alt="Вместе" width="122" height="28"></a>
    <nav class="head__nav" aria-label="Разделы">${links}</nav>
    <a class="btn btn--sm head__cta" href="index.html#join">Вступить</a>
    <button class="head__burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><span></span></button>
  </div>
  <div class="menu on-dark" id="menu" hidden role="dialog" aria-modal="true" aria-label="Меню">
    <div class="menu__top"><img src="assets/brand/wordmark-paper.svg" alt="Вместе"><button class="menu__close" type="button" aria-label="Закрыть меню">×</button></div>
    <nav>${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
    <a class="btn btn--paper" href="index.html#join">Вступить</a>
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
      <div><h3>Разделы</h3><ul>${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div>
      <div><h3>Где мы</h3><ul><li>${esc(SITE.address)}</li><li>Вход со Старокирпичного переулка</li></ul></div>
      <div><h3>Связь</h3><ul>
        <li><a href="${SITE.channel}" target="_blank" rel="noopener">Канал в Телеграме</a></li>
        <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Инстаграм</a></li>
        <li><a href="${SITE.telegram}" target="_blank" rel="noopener">Написать Платону</a></li>
      </ul></div>
    </div>
    <div class="foot__bottom">
      <span>© ${new Date().getFullYear()} «Вместе», Пермь</span>
      <nav aria-label="Документы"><a href="privacy.html">Политика обработки персональных данных</a><a href="consent.html">Согласие на обработку данных</a><a href="offer.html">Оферта о пожертвовании</a></nav>
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
    return `<article class="slide"${i ? ' hidden' : ''} aria-roledescription="слайд" aria-label="${i + 1} из ${list.length}">
      ${slideBg(ev, i)}
      <div class="container slide__in">
        <p class="slide__when"><span>${fmtDay(d)}, ${weekday(d)}</span><span>${esc(ev.time)}</span><span>${esc(ev.place || DEFAULT_PLACE)}</span></p>
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
  el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => show(cur + Number(b.dataset.step))));
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
  return `<a class="ev-card${big ? ' ev-card--big' : ''}${future ? '' : ' ev-card--past'}" href="${url}">
    <div class="card__top"><span class="card__num">${pad2(dd.getDate())}.${pad2(dd.getMonth() + 1)}</span><span><span class="card__name">${multi ? 'любой день' : weekday(d)}, ${esc(ev.time.toLowerCase())}</span><br><span class="card__role">${esc(ev.type || 'Встреча')}${where}</span></span></div>
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
  if (!list.length) { el.innerHTML = `<p class="events__empty">Новых встреч пока нет. Анонсы сначала выходят в <a class="link" href="${SITE.channel}" target="_blank" rel="noopener">канале</a>.</p>`; return; }
  if (!months) { el.innerHTML = `<div class="reel">${list.map((ev, i) => eventCard(ev, seats, { big: big && i === 0 })).join('')}</div>`; return; }
  // по месяцам: заголовок месяца и сетка под ним; первая карточка первого месяца крупнее
  const groups = new Map();
  list.forEach(ev => { const dt = parseDay(nextDate(ev)); const k = `${dt.getFullYear()}-${dt.getMonth()}`; if (!groups.has(k)) groups.set(k, { m: dt.getMonth(), items: [] }); groups.get(k).items.push(ev); });
  el.innerHTML = [...groups.values()].map((g, gi) => `<section class="month"><h3>${MONTHS_NOM[g.m]}</h3><div class="reel">${g.items.map((ev, i) => eventCard(ev, seats, { big: big && gi === 0 && i === 0 })).join('')}</div></section>`).join('');
}

// Прошедшие встречи
function renderPast(target){
  const el = document.getElementById(target);
  if (!el) return;
  const list = pastEvents();
  el.innerHTML = list.length ? `<div class="reel">${list.map(ev => eventCard(ev, {})).join('')}</div>` : `<p class="events__empty">Пока ничего не прошло: мы только открываемся.</p>`;
}

/* ---------- форматы встреч ---------- */
function renderFormats(target){
  const el = document.getElementById(target);
  if (!el) return;
  el.innerHTML = FORMATS.map(f => `<article class="fmt fmt--${f.color}"><h3>${esc(f.name)}</h3><p>${esc(f.text)}</p></article>`).join('');
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

// Эксперты и гости встреч — одной сеткой, эксперты первыми; в конце приглашение стать экспертом
function renderPeople(target, { roles = ['expert', 'guest'], invite = true, limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PEOPLE.filter(p => roles.includes(p.role)).sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role)).slice(0, limit || undefined);
  const cards = list.map(personCard);
  if (invite) cards.push(callCard(list.length, 'Стать экспертом', 'Поделись опытом на встрече: профессия, своё дело, путь. Формат подберём вместе.', SITE.telegram, 'Место для тебя', 'Напиши нам в Телеграм'));
  el.innerHTML = `<div class="reel">${cards.join('')}</div>`;
}

function renderPartners(target, { invite = true, limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PARTNERS.slice(0, limit || undefined);
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
function personShots(p){
  const shots = [...(p.photos || [])];
  if (p.photo && !shots.some(x => x.src === p.photo)) shots.unshift({ src: p.photo, pos: p.photoPos, note: 'Портрет' });
  return shots;
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
  // 1. Кадры сеткой, как в каталоге: подпись над кадром
  const stills = shots.map((x, i) => `<figure class="still">
      <figcaption class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(x.note || '')}</span></span></figcaption>
      <div class="card__img grain"><img src="${x.src}" alt="${esc(x.note || p.name)}"${i ? ' loading="lazy"' : ''}${x.pos ? ` style="object-position:${x.pos}"` : ''}></div>
    </figure>`).join('');
  // 2. Текст колонкой рядом
  const side = `<div class="person-side">
      <dl class="person-facts">
        <div><dt>Роль</dt><dd>${esc(role)}</dd></div>
        <div><dt>Во «Вместе»</dt><dd>${esc(ROLE_NAME[p.role])}</dd></div>
        ${p.since ? `<div><dt>С какого времени</dt><dd>${esc(p.since)}</dd></div>` : ''}
      </dl>
      <h2>О человеке</h2>
      <div class="copy">${(p.about && p.about.length ? p.about : ['Рассказ появится после открытия.']).map(t => `<p>${esc(t)}</p>`).join('')}</div>
      ${p.work && p.work.length ? `<h2>Чем занимается во «Вместе»</h2><ul class="list">${p.work.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${p.talk ? `<h2>О чём можно поговорить</h2><div class="copy"><p>${esc(p.talk)}</p></div>` : ''}
      ${p.contact ? `<div class="actions"><a class="btn" href="${p.contact}" target="_blank" rel="noopener">Написать</a></div>` : ''}
    </div>`;
  // 3. Встречи с участием
  const evs = EVENTS.filter(e => (e.people || []).includes(p.id)).sort((x, y) => parseDay(x.dates[0]) - parseDay(y.dates[0]));
  const meets = evs.length ? `<section class="section section--alt"><div class="container"><div class="sec-head"><div><h2>Встречи</h2></div></div><div class="reel">${evs.map(e => eventCard(e, {})).join('')}</div></div></section>` : '';

  el.innerHTML = `<section class="page-head"><div class="container">
      <p class="crumbs"><a href="${back[0]}">${back[1]}</a><span>${esc(p.name)}</span></p>
      <h1>${esc(p.name)}</h1><p class="lead">${esc(role)}</p>
    </div></section>
    <section class="section"><div class="container ${shots.length ? 'person-grid' : 'person-grid person-grid--text'}">
      ${shots.length ? `<div class="reel reel--2 person-shots">${stills}</div>` : ''}
      ${side}
    </div></section>${meets}`;
}

/* ---------- как нас найти: адрес + карта слева, видео справа ---------- */
function renderWhere(target){
  const el = document.getElementById(target);
  if (!el) return;
  const v = SITE.howToFindVideo || '';
  const video = !v ? `<div class="where__video where__video--empty"><span>Видео</span><span>Как нас найти: от остановки до двери. Появится после открытия.</span></div>`
    : /\.mp4(\?|$)/i.test(v) ? `<video class="where__video" controls preload="metadata" playsinline src="${v}"></video>`
    : /^https?:/i.test(v) ? `<iframe class="where__video" src="${v}" title="Как нас найти" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    : `<div class="where__video">${v}</div>`;
  // подпись-указатель к видео: рукописный текст и нарисованная стрелка
  const note = `<div class="where__note" aria-hidden="true"><span>как нас найти</span>
    <svg viewBox="0 0 120 64" width="120" height="64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10c26 0 54 8 74 24 8 7 14 13 18 20"/><path d="M83 50l13 4-4-13"/></svg></div>`;
  el.innerHTML = `<div class="where">
    <div class="where__map">
      <div class="where__addr"><b>${esc(SITE.address)}</b><span>${esc(SITE.entrance || '')}</span></div>
      <iframe src="${SITE.mapUrl}" title="Карта: ${esc(SITE.address)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
    <div class="where__right">${note}${video}</div>
  </div>`;
}

/* ---------- статичные блоки из данных ---------- */
function renderStory(storyId, principlesId){
  const s = document.getElementById(storyId), p = document.getElementById(principlesId);
  if (s) s.innerHTML = STORY.map(t => `<p>${esc(t)}</p>`).join('');
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
