/* «Вместе» — общие части сайта: лента событий, шапка, меню, подвал и рендер блоков.
   Подключать после events.js и content.js. Страница помечает себя <body data-page="...">.
   Правила владельца (26.10): без линий-разделителей и точек-разделителей; фото показываем только при SHOW_PHOTOS. */

const NAV = [
  ['afisha.html', 'Афиша', 'afisha'],
  ['team.html', 'Команда', 'team'],
  ['people.html', 'Гости и эксперты', 'people'],
  ['partners.html', 'Партнёры', 'partners'],
  ['blog.html', 'Блог', 'blog'],
  ['about.html', 'О нас', 'about'],
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const page = document.body.dataset.page || '';
const photo = src => (typeof SHOW_PHOTOS !== 'undefined' && SHOW_PHOTOS && src) ? src : '';
const ROLE_NAME = { team: 'Команда', expert: 'Эксперт', guest: 'Гость встречи' };

/* ---------- лента событий над шапкой ---------- */
function renderTicker(){
  const el = document.getElementById('tick');
  if (!el) return;
  let items = upcomingEvents().map(ev => `<a class="tick__item" href="${eventUrl(ev)}"><b>${fmtDay(nextDate(ev))}</b>${esc(ev.title)}</a>`);
  if (!items.length) items = [`<a class="tick__item" href="${SITE.channel}" target="_blank" rel="noopener"><b>Скоро</b>новые встречи, анонсы в канале</a>`];
  while (items.length < 6) items = items.concat(items); // мало событий — повторяем, чтобы лента не была пустой
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
        <li><a href="${SITE.chat}" target="_blank" rel="noopener">Чат участников</a></li>
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
  return src ? `<figure class="slide__bg"><img src="${src}" alt=""${i ? ' loading="lazy"' : ''}></figure>` : '';
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
  const flat = photo(list[0].image) ? '' : 'hero__frame--flat';
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
    frame.className = `hero__frame grain ${photo(list[cur].image) ? '' : 'hero__frame--flat'} ${list[cur].color || ''}`;
    el.querySelector('#hero-num').textContent = `${pad2(cur + 1)}/${pad2(list.length)}`;
    el.querySelector('#hero-name').textContent = list[cur].type || 'Встреча';
  };
  el.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => show(cur + Number(b.dataset.step))));
}

/* ---------- афиша: месяцы и карточки ---------- */
// Куда вести с прошедшей встречи: на запись в блоге, если она есть
function pastUrl(ev){ const post = POSTS.find(p => p.event === ev.id); return post ? `post.html?id=${encodeURIComponent(post.id)}` : eventUrl(ev); }

function eventRow(ev, seats){
  const d = nextDate(ev) || ev.dates[ev.dates.length - 1];
  const future = !!nextDate(ev);
  const url = future ? eventUrl(ev) : pastUrl(ev);
  const multi = ev.dates.length > 1;
  const line = future ? seatLine(ev, d, seats || {}) : '';
  return `<li class="ev">
    <p class="ev__date">${multi ? fmtRange(ev) : fmtDay(d)}<small>${multi ? 'любой день' : weekday(d)}, ${esc(ev.time.toLowerCase())}<br>${esc(ev.place || DEFAULT_PLACE)}</small></p>
    <div>
      <p class="ev__meta"><span>${esc(ev.type || 'Встреча')}</span><span>Вход бесплатный</span></p>
      <h3 class="ev__title"><a href="${url}">${esc(ev.title)}</a></h3>
      <p class="ev__text">${esc(ev.text)}</p>
      ${line ? `<p class="ev__seats">${esc(line)}</p>` : ''}
    </div>
    <a class="btn ${future ? '' : 'btn--line'}" href="${url}">${future ? (regNotOpenYet(ev) ? 'Подробнее' : esc(ev.action)) : 'Как прошло'}</a>
  </li>`;
}

async function renderAfisha(target, { limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = upcomingEvents();
  const tabs = document.getElementById(target + '-months');
  const seats = await loadSeats();
  const monthKey = ev => { const d = parseDay(nextDate(ev)); return `${d.getFullYear()}-${d.getMonth()}`; };
  const months = [...new Map(list.map(ev => [monthKey(ev), parseDay(nextDate(ev))])).entries()];
  const draw = key => {
    const rows = list.filter(ev => !key || monthKey(ev) === key).slice(0, limit || undefined);
    el.innerHTML = rows.length ? rows.map(ev => eventRow(ev, seats)).join('')
      : `<li class="events__empty">Новых встреч пока нет. Анонсы сначала выходят в <a class="link" href="${SITE.channel}" target="_blank" rel="noopener">канале</a>.</li>`;
  };
  if (tabs && months.length > 1) {
    tabs.innerHTML = `<button type="button" aria-pressed="true" data-m="">Все</button>` +
      months.map(([k, d]) => `<button type="button" aria-pressed="false" data-m="${k}">${MONTHS_NOM[d.getMonth()]}</button>`).join('');
    tabs.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw(b.dataset.m);
    });
  } else if (tabs) tabs.hidden = true;
  draw('');
}

// Прошедшие встречи
function renderPast(target){
  const el = document.getElementById(target);
  if (!el) return;
  const list = pastEvents();
  el.innerHTML = list.length ? list.map(ev => eventRow(ev, {})).join('') : `<li class="events__empty">Пока ничего не прошло: мы только открываемся.</li>`;
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
  const src = photo(p.photo);
  const frame = src
    ? `<div class="card__img card__img--portrait grain"><img src="${src}" alt="${esc(p.name)}" loading="lazy"></div>`
    : `<div class="card__plate">${esc((p.about && p.about[0]) || p.talk || 'Кадр и рассказ скоро')}</div>`;
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
function renderTeam(target, { limit = 0 } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const list = PEOPLE.filter(p => p.role === 'team').slice(0, limit || undefined);
  el.innerHTML = `<div class="reel reel--4">${list.map(personCard).join('')}</div>`;
}

// Гости и эксперты — группами, с приглашением стать экспертом
function renderPeople(target, { roles = ['expert', 'guest'], invite = true } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const groups = [['expert', 'Эксперты'], ['guest', 'Гости встреч']].filter(([r]) => roles.includes(r));
  el.innerHTML = groups.map(([role, title]) => {
    const list = PEOPLE.filter(p => p.role === role);
    const cards = list.map(personCard);
    if (role === 'expert' && invite) cards.push(callCard(list.length, 'Стать экспертом', 'Поделись опытом на встрече: профессия, своё дело, путь. Формат подберём вместе.', SITE.telegram, 'Место для тебя', 'Напиши нам в Телеграм'));
    if (!cards.length) return '';
    return `<section class="people-group">${groups.length > 1 ? `<h3>${title}</h3>` : ''}<div class="reel">${cards.join('')}</div></section>`;
  }).join('');
}

function renderPartners(target, { invite = true } = {}){
  const el = document.getElementById(target);
  if (!el) return;
  const cards = PARTNERS.map((p, i) => `<a class="card" href="${p.url}" target="_blank" rel="noopener">
    <div class="card__top"><span class="card__num">${pad2(i + 1)}</span><span><span class="card__name">${esc(p.name)}</span><br><span class="card__role">${esc(p.note || 'Партнёр')}</span></span></div>
    <div class="card__plate card__plate--logo"><img src="${p.logo}" alt="${esc(p.name)}" loading="lazy"></div>
  </a>`);
  if (invite) cards.push(callCard(PARTNERS.length, 'Стать партнёром', 'Помочь со стартом, провести встречу для ребят или дать задачу компании для практики.', SITE.telegram, 'Ваша компания', 'Напишите нам в Телеграм', 'blue'));
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

/* ---------- страница человека: имя, кадры «в работе», текст, кадры «в жизни» ---------- */
function gallery(list, title, note){
  const items = (SHOW_PHOTOS && list && list.length)
    ? list.map((g, i) => `<figure class="shot grain"><img src="${g.src}" alt="" loading="lazy"><figcaption><b>${pad2(i + 1)}</b>${esc(g.note || '')}</figcaption></figure>`)
    : [0, 1, 2].map(i => `<div class="shot shot--empty"><span>${pad2(i + 1)}</span><span>${esc(note)}</span></div>`);
  return `<div class="sec-head"><div><h2>${esc(title)}</h2></div></div><div class="shots">${items.join('')}</div>`;
}

function renderPerson(target){
  const el = document.getElementById(target);
  if (!el) return;
  const p = PEOPLE.find(x => x.id === new URLSearchParams(location.search).get('id'));
  const back = p && p.role === 'team' ? ['team.html', 'Команда'] : ['people.html', 'Гости и эксперты'];
  if (!p) {
    el.innerHTML = `<section class="page-head"><div class="container"><p class="crumbs"><a href="people.html">Гости и эксперты</a></p><h1>Страница не найдена</h1><p class="lead">Возможно, ссылка устарела.</p><div class="actions"><a class="btn" href="team.html">Команда</a><a class="btn btn--line" href="people.html">Гости и эксперты</a></div></div></section>`;
    return;
  }
  document.title = `${p.name} — Вместе`;
  const facts = [['Роль', p.position || ROLE_NAME[p.role]], ['Во «Вместе»', ROLE_NAME[p.role]]];
  if (p.since) facts.push(['С какого времени', p.since]);
  if (p.city) facts.push(['Город', p.city]);
  el.innerHTML = `
    <section class="page-head"><div class="container">
      <p class="crumbs"><a href="${back[0]}">${back[1]}</a><span>${esc(p.name)}</span></p>
      <h1>${esc(p.name)}</h1>
      <p class="lead">${esc(p.position || ROLE_NAME[p.role])}</p>
    </div></section>
    <section class="section"><div class="container">${gallery(p.gallery && p.gallery.work, 'В работе', 'Кадр с встречи или из работы')}</div></section>
    <section class="section section--alt"><div class="container person-body">
      <div class="facts facts--col">
        ${facts.map(([k, v]) => `<div class="fact"><strong>${esc(k)}</strong><p>${esc(v)}</p></div>`).join('')}
        ${p.contact ? `<a class="btn" href="${p.contact}" target="_blank" rel="noopener">Написать</a>` : ''}
      </div>
      <div class="person-text">
        <h2>О человеке</h2>
        <div class="copy">${(p.about && p.about.length ? p.about : ['Рассказ появится после открытия.']).map(t => `<p>${esc(t)}</p>`).join('')}</div>
        ${p.work && p.work.length ? `<h2>Чем занимается во «Вместе»</h2><ul class="list">${p.work.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${p.talk ? `<h2>О чём можно поговорить</h2><div class="copy"><p>${esc(p.talk)}</p></div>` : ''}
      </div>
    </div></section>
    <section class="section"><div class="container">${gallery(p.gallery && p.gallery.life, 'В жизни', 'Кадр из повседневной жизни')}</div></section>`;
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
