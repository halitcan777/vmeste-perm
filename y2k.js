/* «Вместе» — общие шапка, бегущая строка и подвал для всех страниц. */
const Y_SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.8 6.4 4.6 10.9 12 12-7.4 1.1-11.2 5.6-12 12-.8-6.4-4.6-10.9-12-12C7.4 10.9 11.2 6.4 12 0Z" fill="currentColor"/></svg>';
const Y_NAV = [['about.html', 'О нас'], ['afisha.html', 'Афиша'], ['directions.html', 'Направления'], ['experts.html', 'Эксперты'], ['news.html', 'Новости']];
const Y_TICKER = ['открываемся 1 ноября', 'ленина, 44', 'приходи одному, уйдёшь с друзьями', 'пн профориентация', 'вт общение', 'ср бизнес', 'чт проекты', 'пт для своих'];

(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = Y_NAV.map(([href, name]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${name}</a>`).join('');
  const run = Y_TICKER.map(t => `<span>${t}</span><i>✦</i>`).join('');
  document.body.insertAdjacentHTML('afterbegin',
    `<div class="y-ticker" aria-hidden="true"><div>${run}${run}</div></div>
<header class="y-head"><div class="y-wrap"><a class="y-logo" href="index.html">${Y_SPARK}вместе</a><nav class="y-nav">${nav}</nav><a class="y-btn sm" href="index.html#join">Вступить</a></div></header>`);
  document.body.insertAdjacentHTML('beforeend',
    `<footer class="y-foot"><div class="y-wrap"><div class="y-grid">
<div><div class="y-logo">${Y_SPARK}вместе</div><p style="margin-top:14px;max-width:360px">Молодёжное движение в Перми</p></div>
<div class="col"><b>разделы</b>${Y_NAV.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}</div>
<div class="col"><b>где мы</b><p>Пермь, ул. Ленина, 44</p><a href="https://t.me/Paltus10">Телеграм</a><a href="https://t.me/+Bs7x5h7SbtI4NWQy">Рабочий чат</a><a href="privacy.html">Политика данных</a></div>
</div><div class="copy"><span>© 2026 вместе</span><span>сделано в перми своими руками</span></div></div></footer>`);
})();
