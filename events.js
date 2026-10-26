/* Афиша «Вместе» — единственное место, где заводятся мероприятия.
   Новое событие = новый объект в EVENTS. Ссылка на запись: event.html?id=<id>
   Метка источника для рассылок: event.html?id=<id>&from=vk (попадёт в таблицу).

   Блок между EVENTS-START и EVENTS-END читает и сервер (Apps Script) — поэтому
   это строгий JSON: ключи и строки в двойных кавычках, без комментариев внутри.
   Поля:
     dates      — дни, "ГГГГ-ММ-ДД"; несколько = в форме выбор дня
     capacity   — мест на один день (null = без ограничения)
     regOpens   — когда открывается запись, "ГГГГ-ММ-ДДTЧЧ:ММ" по Перми (null = уже открыта)
     action     — текст кнопки: "Записаться" или "Помочь"
     type       — формат одной-двумя словами («Встреча», «Открытие»)
     color      — цвет обводки кадра на главной: wine (по умолчанию), blue, green, ink
     textSide   — 'right', если человек на фото слева и текст нужно увести вправо
     people     — id гостей из content.js (PEOPLE), страница встречи ссылается на них, а их страница — на встречи
     Афиша ноября заведена 26.10 по списку владельца; даты расставлены на глаз и ещё сдвинутся; «уточняется» = ждём факт.
     image      — картинка для афиши и шапки, imageNote — подпись к ней */

// URL веб-приложения Google Apps Script (см. 03_Запись_на_мероприятия.md). Пусто = запись через Телеграм.
const REG_ENDPOINT = '';
// Имя бота без @, через него человек подтверждает запись
const BOT_USERNAME = '';

const CONTACT_TG = 'https://t.me/Paltus10';
const WORK_CHAT = 'https://t.me/+Bs7x5h7SbtI4NWQy';
const DEFAULT_PLACE = 'Пермь, ул. Ленина, 44';

const EVENTS = /*EVENTS-START*/[
  {
    "id": "obustroystvo",
    "title": "Обустраиваем зал",
    "dates": [
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18"
    ],
    "time": "Время уточняется",
    "text": "Красим, реставрируем мебель, раскладываем ковёр и собираем пространство своими руками.",
    "about": [
      "Можно прийти на пару часов в любой день. Инструменты и материалы есть, опыт не нужен.",
      "Выбери день в форме, чтобы мы знали, сколько будет рук, и подготовили задачи."
    ],
    "action": "Помочь",
    "capacity": 12,
    "regOpens": null,
    "type": "Своими руками"
  },
  {
    "id": "znakomstvo",
    "title": "Знакомство с командой",
    "dates": [
      "2026-10-24"
    ],
    "time": "19:00",
    "text": "Неофициальная встреча перед открытием.",
    "about": [
      "Рассказываем, как будет устроена неделя, знакомимся и решаем, кто за что возьмётся.",
      "Можно прийти одному. Если никого не знаешь, познакомим на месте."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Встреча"
  },
  {
    "id": "otkrytie",
    "title": "Открытие «Вместе»",
    "dates": [
      "2026-11-01"
    ],
    "time": "Время уточняется",
    "text": "Первый официальный вечер движения.",
    "about": [
      "Открываем пространство и показываем, как будет устроена неделя."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": "2026-10-20T12:00",
    "type": "Открытие",
    "color": "wine",
    "image": "assets/img/events/otkrytie.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "kino-1",
    "title": "Кино на стене",
    "dates": [
      "2026-11-05"
    ],
    "time": "19:00",
    "text": "Смотрим фильм с проектора на кирпичной стене зала. Какой фильм — выбираем голосованием в канале.",
    "about": [
      "Приходи один или с кем-то, места на ковре и на стульях. После фильма — чай и разговор о том, что зацепило.",
      "Фильм и возрастное ограничение объявим в канале за несколько дней."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Вечер для своих",
    "color": "wine",
    "image": "assets/img/events/kino-1.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "tattoo",
    "title": "Мастер-класс по татуировкам",
    "dates": [
      "2026-11-15"
    ],
    "time": "19:00",
    "text": "Тату-мастер показывает, как устроена профессия: от эскиза до первой работы. Кто ведёт — уточняется.",
    "about": [
      "Формат «Профориентация»: разбираем профессию изнутри и пробуем сделать эскиз своими руками.",
      "Никого не бьём, только рассказ, эскизы и вопросы."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Профориентация",
    "color": "blue",
    "image": "assets/img/events/tattoo.jpg",
    "imagePos": "50% 40%"
  },
  {
    "id": "psiholog-1",
    "title": "Тренинг с психологом Николаем Барановым",
    "dates": [
      "2026-11-22"
    ],
    "time": "19:00",
    "text": "Клинический психолог и системный терапевт: практика в кругу про отношения и то, как не терять себя рядом с другими. Тема уточняется.",
    "about": [
      "Формат «Общение»: практика в кругу, без оценок и спешки. Мест немного, чтобы каждый успел поучаствовать."
    ],
    "action": "Записаться",
    "capacity": 20,
    "regOpens": null,
    "type": "Общение",
    "color": "wine",
    "image": "assets/img/events/psiholog-1.jpg",
    "imagePos": "50% 50%",
    "people": [
      "baranov"
    ]
  },
  {
    "id": "oshchepkov",
    "title": "Встреча с Олегом Ощепковым",
    "dates": [
      "2026-11-11"
    ],
    "time": "19:00",
    "text": "Ресторатор, бывший вице-губернатор Пермского края, профессор ВШЭ в Перми. О том, как делать проекты в городе и не перегореть.",
    "about": [
      "Олег Ощепков — предприниматель и ресторатор (кафе «Улитка», «Маркс», «Вехотка»), в 2000-х — заместитель губернатора и министр культуры Пермского края. Сейчас профессор НИУ ВШЭ в Перми, руководит программой «Менеджмент в креативных индустриях».",
      "Формат «Бизнес»: история гостя, потом вопросы из зала. Приходи с вопросом."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Бизнес",
    "color": "green",
    "people": [
      "oshchepkov"
    ],
    "image": "assets/img/events/oshchepkov.jpg",
    "imagePos": "35% 30%",
    "textSide": "right"
  },
  {
    "id": "m-perm",
    "title": "Встреча с «М Пермь»",
    "dates": [
      "2026-12-02"
    ],
    "time": "19:00",
    "text": "Знакомство с командой «М Пермь»: что делают, как к ним присоединиться. Детали уточняются.",
    "about": [
      "Формат «Проекты»: разбираем, как устроено сообщество, и ищем, что можно сделать вместе."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Проекты",
    "color": "ink",
    "image": "assets/img/events/m-perm.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "haircut",
    "title": "Мастер-класс по стрижкам",
    "dates": [
      "2026-11-27"
    ],
    "time": "19:00",
    "text": "Парикмахер показывает ремесло: инструменты, первые навыки, как зарабатывают. Кто ведёт — уточняется.",
    "about": [
      "Формат «Профориентация»: профессия изнутри, вопросы и пробы."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Профориентация",
    "color": "blue",
    "image": "assets/img/events/haircut.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "art-terapiya",
    "title": "Арт-терапия",
    "dates": [
      "2026-11-20"
    ],
    "time": "19:00",
    "text": "Рисуем, лепим и говорим: практика с ведущим, где не нужно уметь рисовать. Ведущий уточняется.",
    "about": [
      "Формат «Общение»: материалы даём, опыт не нужен. Уходишь со своей работой и чуть легче."
    ],
    "action": "Записаться",
    "capacity": 20,
    "regOpens": null,
    "type": "Общение",
    "color": "wine",
    "image": "assets/img/events/art-terapiya.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "besfamilnaya",
    "title": "Встреча с Яной Бесфамильной",
    "dates": [
      "2026-11-18"
    ],
    "time": "19:00",
    "text": "Дизайнер одежды, основательница бренда YANA BESFAMILNAYA, участница Московской недели моды. О своём деле в моде из Перми.",
    "about": [
      "Яна Бесфамильная — пермский дизайнер, бренд YANA BESFAMILNAYA показывается на Московской неделе моды; эксперт программы «Модный приговор». В основе бренда — идея трансформации и отказ от натурального меха и кожи.",
      "Формат «Бизнес»: как запустить бренд из Перми, что было самым трудным, вопросы из зала."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Бизнес",
    "color": "green",
    "people": [
      "besfamilnaya"
    ],
    "image": "assets/img/events/besfamilnaya.jpg",
    "imagePos": "28% 25%",
    "textSide": "right"
  },
  {
    "id": "ameli-band",
    "title": "Концерт группы «Амели бенд»",
    "dates": [
      "2026-11-13"
    ],
    "time": "19:30",
    "text": "Живой концерт в зале: акустика, свои и каверы. Детали уточняются.",
    "about": [
      "Формат «Вечер для своих»: музыка, чай, знакомства. Вход бесплатный, места на ковре."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Вечер для своих",
    "color": "wine",
    "image": "assets/img/events/ameli-band.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "vshe-lekciya",
    "title": "Выездная лекция с ВШЭ Пермь",
    "dates": [
      "2026-12-05"
    ],
    "time": "15:00",
    "text": "Лекция в коллаборации с Высшей школой экономики в Перми и первым курсом МКИ. Тема, лектор и площадка уточняются.",
    "about": [
      "Формат «Профориентация»: выездной вечер на площадке партнёра. Место и как добраться объявим в канале."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Профориентация",
    "color": "blue",
    "place": "Площадка уточняется",
    "image": "assets/img/events/vshe-lekciya.jpg",
    "imagePos": "50% 50%"
  },
  {
    "id": "psiholog-2",
    "title": "Тренинг с Александром Сотниковым",
    "dates": [
      "2026-11-29"
    ],
    "time": "19:00",
    "text": "Бизнес-психолог, гештальт-подход: как принимать решения без паники и не выгорать в своём деле. Тема уточняется.",
    "about": [
      "Формат «Общение»: практика в кругу. Можно прийти, даже если не был на первом."
    ],
    "action": "Записаться",
    "capacity": 20,
    "regOpens": null,
    "type": "Общение",
    "color": "wine",
    "image": "assets/img/events/psiholog-2.jpg",
    "imagePos": "50% 50%",
    "people": [
      "sotnikov"
    ]
  },
  {
    "id": "didebashvili",
    "title": "Встреча с Зазой Дидебашвили",
    "dates": [
      "2026-11-25"
    ],
    "time": "19:00",
    "text": "Предприниматель: Парк Горького, курорт «Губаха», кулачная лига «Конфликт». О своём пути в бизнесе.",
    "about": [
      "Заза Дидебашвили — предприниматель, за ним Парк Горького, всесезонный курорт «Губаха» и кулачная лига «Конфликт».",
      "Формат «Бизнес»: история гостя и вопросы из зала."
    ],
    "action": "Записаться",
    "capacity": 30,
    "regOpens": null,
    "type": "Бизнес",
    "color": "green",
    "people": [
      "didebashvili"
    ],
    "image": "assets/img/people/didebashvili.jpg",
    "imagePos": "50% 30%"
  },
  {
    "id": "yoga",
    "title": "Мастер-класс по йоге",
    "dates": [
      "2026-11-08"
    ],
    "time": "12:00",
    "text": "Занятие для тех, кто никогда не пробовал: дыхание, растяжка, спокойная голова. Ведущий уточняется.",
    "about": [
      "Формат «Вечер для своих»: коврики есть, приходи в удобной одежде."
    ],
    "action": "Записаться",
    "capacity": 16,
    "regOpens": null,
    "type": "Вечер для своих",
    "color": "wine",
    "image": "assets/img/events/yoga.jpg",
    "imagePos": "50% 50%"
  }
]/*EVENTS-END*/;

/* ---------- общие помощники ---------- */
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

function eventById(id){ return EVENTS.find(e => e.id === id) || null; }

function parseDay(iso){ const [y,m,d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }

function todayStart(){ const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }

// Время открытия записи как момент (Пермь = UTC+5)
function regOpensAt(ev){ return ev.regOpens ? new Date(ev.regOpens + ':00+05:00') : null; }

function regNotOpenYet(ev){ const t = regOpensAt(ev); return !!t && t > new Date(); }

function fmtOpens(ev){
  const t = regOpensAt(ev);
  // показываем по Перми, независимо от часового пояса телефона
  const p = new Date(t.getTime() + 5 * 3600e3);
  return `${p.getUTCDate()} ${MONTHS_GEN[p.getUTCMonth()]} в ${String(p.getUTCHours()).padStart(2,'0')}:${String(p.getUTCMinutes()).padStart(2,'0')}`;
}

// Дни события, на которые ещё можно записаться
function openDates(ev){ const t = todayStart(); return ev.dates.filter(d => parseDay(d) >= t); }

function fmtDay(iso){ const d = parseDay(iso); return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`; }

function fmtRange(ev){
  const first = ev.dates[0], last = ev.dates[ev.dates.length - 1];
  if (first === last) return fmtDay(first);
  const a = parseDay(first), b = parseDay(last);
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()}–${b.getDate()} ${MONTHS_GEN[b.getMonth()]}`
    : `${fmtDay(first)} – ${fmtDay(last)}`;
}

function eventUrl(ev){ return `event.html?id=${encodeURIComponent(ev.id)}`; }

function plural(n, one, few, many){
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many;
}

/* Занятые места с сервера: { "id|день": { taken, waitlist } }. Без сервера — пусто. */
async function loadSeats(){
  if (!REG_ENDPOINT) return {};
  try {
    const r = await fetch(`${REG_ENDPOINT}?action=seats`);
    const j = await r.json();
    return j.seats || {};
  } catch (_) { return {}; }
}

// Строка статуса записи для афиши и страницы встречи
function seatLine(ev, day, seats){
  if (regNotOpenYet(ev)) return `Регистрация откроется ${fmtOpens(ev)}${ev.capacity ? ` · ${ev.capacity} ${plural(ev.capacity,'место','места','мест')}` : ''}`;
  if (!ev.capacity) return '';
  const s = seats[`${ev.id}|${day}`];
  if (!s) return `${ev.capacity} ${plural(ev.capacity,'место','места','мест')}`;
  const left = Math.max(ev.capacity - s.taken, 0);
  if (!left) return `Мест нет · можно в лист ожидания`;
  return `Записались ${s.taken} · ${plural(left,'осталось','осталось','осталось')} ${left} из ${ev.capacity}`;
}

/* ---------- для главной и афиши ---------- */
const MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const WEEKDAYS = ['вс','пн','вт','ср','чт','пт','сб'];

// Ближайший день события, который ещё не прошёл (или null)
function nextDate(ev){ return openDates(ev)[0] || null; }

// Предстоящие события по ближайшей дате
function upcomingEvents(){
  return EVENTS.filter(nextDate).sort((a, b) => parseDay(nextDate(a)) - parseDay(nextDate(b)));
}

// Прошедшие события, свежие первыми
function pastEvents(){
  return EVENTS.filter(e => !nextDate(e)).sort((a, b) => parseDay(b.dates[b.dates.length - 1]) - parseDay(a.dates[a.dates.length - 1]));
}

function weekday(iso){ return WEEKDAYS[parseDay(iso).getDay()]; }
