/* Содержимое сайта «Вместе», кроме афиши (она в events.js).
   Добавить человека, партнёра или статью = добавить объект в нужный список. Вёрстку не трогать.
   Факты пишем только подтверждённые: нет данных — нет строки. */

// Лента над шапкой: короткие фразы из принципов (слова владельца 26.10). Порядок = порядок в ленте.
const TICKER = [
  'Быть самим собой',
  'С нами хоть куда',
  'Помогать, любить, дружить',
  'Создавать и творить',
  'Придумывать и бредогенерить',
  'Приносить что-то своё',
  'Делать, а не казаться',
  'Начинать вместе',
  'Приходить одному, уходить с друзьями',
];

// Визуализации зала (события, блог): false — убраны 26.10, пути в данных остаются. Настоящие фото людей показываются всегда.
const SHOW_PHOTOS = true;
// Готовые ассоциативные кадры в assets/img/people/assoc (обновляется скриптом при генерации)
const ASSOC_FILES = ['design.webp', 'edit.webp', 'video.webp', 'social.webp', 'events.webp', 'texts.webp', 'partners.webp', 'ops.webp', 'marketing.webp', 'creative.webp', 'biz.webp', 'outside.webp', 'host.webp', 'vmeste.webp', 'fashion.webp', 'mountain.webp', 'city.webp', 'psy.webp', 'founder.webp'];   // ИИ-визуализации зала из данных убраны 26.10; теперь фото только настоящие

// Форматы встреч. Какой формат в какой день — объявляем в афише, к дням недели не привязываем.
const FORMATS = [
  { name: 'Профориентация', text: 'Встречи с людьми из разных профессий и пробы, чтобы понять, чем хочется заниматься.', color: 'blue' },
  { name: 'Общение', text: 'Разговор в кругу с ведущим: о том, что волнует, без оценок и спешки.', color: 'wine' },
  { name: 'Бизнес', text: 'Предприниматели Перми рассказывают, как начинали, и отвечают на вопросы.', color: 'green' },
  { name: 'Проекты', text: 'Собираем команды вокруг идей и доводим их до первой версии.', color: 'ink' },
  { name: 'Вечер для своих', text: 'Настолки, гитара, кино. Просто время вместе после недели.', color: 'wine' },
];

// Люди. role: 'team' — команда, 'expert' — эксперт, 'guest' — гость встречи.
// Команда — список владельца от 26.10; роли из «Структура команды, вер. 3 от 20.10» (главная функция). Нет в документе = пусто.
// assoc — ассоциативный кадр по роли (сгенерирован, без людей): идёт в мозаику и фон страницы, пока нет своего фото.
// Страница человека берёт: about (абзацы), work (список дел во «Вместе»), talk (о чём поговорить), contact, since,
// photos: [{src, note, pos}] — кадры человека (pos — точка фото, которую держим при обрезке); photo/photoPos — портрет для карточки.
const PEOPLE = [
  {
    id: 'platon', role: 'team', name: 'Платон Трутнев', position: 'Основатель, партнёрства и сообщество', bg: 'assets/img/people/assoc/founder.webp',
    photo: 'assets/img/people/platon/p03.webp', photoPos: '50% 45%',   // pos — какую точку фото держать в кадре при обрезке
    photos: [   // кадры человека без деления; первый — портрет из карточки добавляется сам
      { src: 'assets/img/people/platon/p01.webp', note: 'Офис', pos: '50% 60%' },
      { src: 'assets/img/people/platon/p02.webp', note: 'Лес', pos: '65% 55%' },
      { src: 'assets/img/people/platon/p04.webp', note: 'Мост', pos: '50% 25%' },
      { src: 'assets/img/people/platon/p05.webp', note: 'Зима', pos: '55% 45%' },
      { src: 'assets/img/people/platon/p06.webp', note: 'Сноуборд', pos: '60% 50%' },
    ],
    about: ['Отвечает за запуск движения, партнёрства и пространство на Ленина, 44. Собирает вокруг «Вместе» людей, партнёров и первые форматы.'],
    talk: 'Запуск сообщества, поиск партнёров, первые шаги проекта и работа с неопределённостью.',
    contact: 'https://t.me/Paltus10'
  },
  { id: 'roman', role: 'team', assoc: 'assets/img/people/assoc/outside.webp', position: 'Внешние мероприятия', name: 'Роман Гильмутдинов' },
  {
    id: 'ilya', role: 'team', name: 'Илья Амиров', position: 'Основатель, операционное управление', bg: 'assets/img/people/assoc/ops.webp',
    photo: 'assets/img/w/ilya.webp', photoPos: '50% 12%',
    about: ['Ведёт студию DAPI и помогает превращать идеи «Вместе» в продукты, кейсы и задачи для команды.'],
    talk: 'Продуктовое мышление, сбор команды, постановка задач и переход от идеи к первому результату.',
    contact: 'https://t.me/amirov_il'   // через Илью вступают в команду
  },
  { id: 'tatyana', role: 'team', assoc: 'assets/img/people/assoc/design.webp', position: 'Дизайн', name: 'Татьяна' },
  { id: 'polina', role: 'team', assoc: 'assets/img/people/assoc/social.webp', position: 'Соцсети', name: 'Полина' },
  { id: 'agata', role: 'team', assoc: 'assets/img/people/assoc/social.webp', position: 'Соцсети', name: 'Агата' },
  { id: 'dmitry-predein', role: 'team', assoc: 'assets/img/people/assoc/vmeste.webp', name: 'Дмитрий Предеин', position: '' },
  { id: 'irina', role: 'team', assoc: 'assets/img/people/assoc/edit.webp', position: 'Видеомонтаж и дизайн', name: 'Ирина' },
  { id: 'arina', role: 'team', assoc: 'assets/img/people/assoc/events.webp', position: 'Мероприятия, маркетинг и медиа', name: 'Арина Максимова' },
  { id: 'ekaterina', role: 'team', assoc: 'assets/img/people/assoc/video.webp', position: 'Видеопроизводство', name: 'Екатерина' },
  { id: 'eva', role: 'team', assoc: 'assets/img/people/assoc/creative.webp', position: 'Мероприятия и креатив', name: 'Ева Коскова' },
  { id: 'vika', role: 'team', assoc: 'assets/img/people/assoc/partners.webp', position: 'Партнёрства и привлечение', name: 'Вика' },
  { id: 'ksyusha', role: 'team', assoc: 'assets/img/people/assoc/texts.webp', position: 'Тексты и соцсети', name: 'Ксюша' },
  { id: 'adelina', role: 'team', name: 'Аделина Гросс', position: 'Операционное управление, арт-терапия', bg: 'assets/img/people/assoc/creative.webp',
    photo: 'assets/img/people/adelina.webp', photoPos: '50% 18%',   // портрет из её резюме (19.10)
    about: ['Ведёт арт-терапию во «Вместе». Художественное образование, студентка ВШЭ по направлению «Менеджмент в креативных индустриях», параллельно учится психотерапии.'],
    talk: 'Арт-терапия, творчество как способ разобраться в себе, учёба и своё дело параллельно.' },
  { id: 'alexey', role: 'team', assoc: 'assets/img/people/assoc/marketing.webp', position: 'Маркетинг и медиа', name: 'Алексей' },
  { id: 'vlada', role: 'team', assoc: 'assets/img/people/assoc/host.webp', position: 'Лицо основного аккаунта', name: 'Влада' },
  { id: 'angelina', role: 'team', assoc: 'assets/img/people/assoc/biz.webp', position: 'Бизнес-проекты', name: 'Ангелина' },
  { id: 'kirill', role: 'team', assoc: 'assets/img/people/assoc/edit.webp', position: 'Видеомонтаж', name: 'Кирилл Богданов' },
  { id: 'dmitry-bazuev', role: 'team', assoc: 'assets/img/people/assoc/vmeste.webp', name: 'Дмитрий Базуев', position: '' },
  { id: 'anya', role: 'team', assoc: 'assets/img/people/assoc/marketing.webp', position: 'Маркетинг и медиа', name: 'Аня' },
  // Эксперты и гости встреч — по открытым источникам (26.10): проверить с ними перед публикацией, фото запросить.
  { id: 'oshchepkov', role: 'expert', name: 'Олег Ощепков', position: 'Предприниматель, ресторатор, профессор ВШЭ в Перми', bg: 'assets/img/people/assoc/city.webp',
    photo: 'assets/img/people/oshchepkov.webp', photoPos: '50% 25%',   // фото НИУ ВШЭ в Перми (новость 22.04.2025)
    photos: [{ src: 'assets/img/people/oshchepkov-2.webp', note: 'Фото: Максим Кимерлинг, «Коммерсантъ»', pos: '50% 30%' }],
    about: ['Предприниматель с 1997 года: больше 25 лет был основателем и генеральным директором маркетингового агентства «ОЗОН Групп», с 2015 года — ресторатор (кафе «Улитка», «Маркс», «Вехотка»). В 2005–2008 годах — министр культуры Пермского края.',
            'С 2024 года в НИУ ВШЭ в Перми: профессор департамента менеджмента, научный руководитель программы «Менеджмент в креативных индустриях». Окончил Пермский политехнический университет.'],
    talk: 'Как делать проекты в городе, креативные индустрии, рестораны, маркетинг и почему стоит начинать в Перми.' },
  { id: 'baranov', role: 'expert', name: 'Николай Баранов', position: 'Клинический психолог, системный терапевт', bg: 'assets/img/people/assoc/psy.webp',
    photo: 'assets/img/people/baranov.webp',
    about: ['Работает с зависимостями, отношениями и семейной системой; много лет консультирует пары. Ученик Юрия Вагина. Ведёт канал @psy_baranov: о расставаниях, доверии, ссорах и о том, что исцеляет не техника, а другой человек рядом.'],
    talk: 'Отношения, семья, зависимости, как не терять себя рядом с другими.', contact: 'https://t.me/psy_baranov' },
  { id: 'sotnikov', role: 'expert', name: 'Александр Сотников', position: 'Бизнес-психолог', bg: 'assets/img/people/assoc/psy.webp',
    photo: 'assets/img/people/sotnikov.webp',
    about: ['Работает в гештальт-подходе с собственниками и первыми лицами компаний: конфиденциально, без оценок, через глубокий диалог. Ведёт канал @founder_zen о решениях, контроле, выгорании и «карме предпринимателя».'],
    talk: 'Решения под давлением, контроль и страхи, выгорание, терапия как остановка.', contact: 'https://t.me/founder_zen' },
  { id: 'besfamilnaya', role: 'guest', name: 'Яна Бесфамильная', position: 'Дизайнер одежды, бренд YANA BESFAMILNAYA', bg: 'assets/img/people/assoc/fashion.webp',
    photo: 'assets/img/people/besfamilnaya.webp', photoPos: '28% 25%',
    // 27.10: только кадры с самой Яной (показы с моделями убраны в _originals). Пресс-фото, заменить на присланные ею.
    photos: [
      { src: 'assets/img/people/besfamilnaya/01.webp', note: 'Съёмка для «Сноба», фото Алисы Калипсо', pos: '50% 18%' },
      { src: 'assets/img/people/besfamilnaya/02.webp', note: 'Съёмка для «Сноба», фото Алисы Калипсо', pos: '50% 12%' },
      { src: 'assets/img/people/besfamilnaya/03.webp', note: 'Фото: sobaka.ru', pos: '50% 30%' },
    ],
    about: ['Пермский дизайнер, основательница бренда YANA BESFAMILNAYA. Коллекции показываются на Московской неделе моды, эксперт программы «Модный приговор». В основе бренда — идея трансформации и отказ от натурального меха и кожи.'],
    talk: 'Как запустить свой бренд из Перми, мода как бизнес, путь дизайнера.' },
  { id: 'guryanov', role: 'guest', name: 'Данил Гурьянов', position: 'Креативный продюсер, сооснователь ДК, фронтмен The Hard Lux', bg: 'assets/img/people/assoc/host.webp',
    photo: 'assets/img/people/guryanov.webp', photoPos: '62% 40%',   // кадр от владельца 28.10 (ч/б, в машине)
    about: ['Креативный продюсер, сооснователь ДК, фронтмен группы The Hard Lux. Подробнее расскажет на встрече.'],
    talk: 'Как делать площадки, контент и музыку в Перми.', contact: 'https://www.instagram.com/danil_guryanov' },
  { id: 'didebashvili', role: 'guest', name: 'Заза Дидебашвили', position: 'Парк Горького, курорт «Губаха», лига «Конфликт»', bg: 'assets/img/people/assoc/mountain.webp',
    photo: 'assets/img/people/didebashvili.webp', photoPos: '50% 35%',
    photos: [{ src: 'assets/img/people/didebashvili-ring.webp', note: 'На ринге лиги «Конфликт», в центре', pos: '50% 30%' }],
    about: ['Предприниматель: Парк Горького, всесезонный курорт «Губаха», кулачная лига «Конфликт». Подробнее расскажет на встрече.'],
    talk: 'Свой путь в бизнесе, первые шаги и ошибки.' },
];

// Партнёры. status: 'partner' — подтверждённое сотрудничество, только такие выводятся на сайт (28.10, решение владельца); 'talks' — в переговорах, хранятся здесь, не показываются.
const PARTNERS = [
  // 26.10: список владельца «навскидку», с кем есть договорённости. Логотипы (logo) подставить, когда появятся; без логотипа — плашка с названием.
  { name: 'Деловая Россия, Пермское отделение', logo: 'assets/logos/deloros_original.png', url: 'https://deloros.ru', status: 'partner', note: 'Встречи с предпринимателями' },
  { name: 'Частная филармония «Триумф»', logo: '', url: 'https://triumphmusic.ru', status: 'talks', note: 'Соседи по Ленина, 44' },
  { name: 'Monkey Grinder', logo: 'assets/logos/monkey-grinder.png', url: 'https://monkey-grinder.ru', status: 'talks', note: 'Кофейни' },
  { name: 'Red Cup', logo: '', url: '', status: 'talks', note: 'Кофейня' },
  { name: 'Дринкит', logo: 'assets/logos/drinkit.svg', url: 'https://drinkit.ru', status: 'talks', note: 'Кофейни' },
  { name: 'Курорт «Губаха»', logo: '', url: '', status: 'talks', note: 'Горнолыжный курорт' },
  { name: 'Йога-клуб', logo: '', url: '', status: 'talks', note: 'Название уточняется' },
  { name: 'Студия звука «Ленком»', logo: '', url: '', status: 'talks', note: 'Звук и запись' },
  { name: 'Даниил Снег', logo: '', url: '', status: 'talks', note: 'Личный бренд' },
];

// Блог: отчёты о прошедших встречах и заметки.
// event — id из events.js, если статья про встречу (тогда дата и фото подтянутся оттуда).
const POSTS = [
  // 28.10: пусто до первого фотоотчёта; пока POSTS пуст, «Блог» не показывается в меню
];

const SITE = {
  slogan: 'Зачем быть одному, если можно быть вместе?',
  about: 'Молодёжное движение в Перми. Свой зал в центре города, встречи по афише, вход для участников бесплатный.',
  address: 'Пермь, ул. Ленина, 44',
  entrance: 'Вход со Старокирпичного переулка',
  // Яндекс-карта (виджет по адресу). Видео «как нас найти»: ссылка на .mp4 или код вставки (YouTube/VK/Rutube), пусто = плашка.
  mapUrl: 'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent('Пермь, улица Ленина, 44') + '&z=17',
  howToFindVideo: '',
  telegram: 'https://t.me/Paltus10',          // личка Платона
  channel: 'https://t.me/v_meste_perm',       // канал: анонсы
  instagram: 'https://www.instagram.com/vmeste.prm',
};

// Принципы и история — переписаны 28.10 (владелец: «перепиши»); проверить с Платоном.
const PRINCIPLES = [
  { title: 'Приноси своё', text: 'Вещь, книгу, идею, умение или час времени. Зал собран из того, что принесли люди.' },
  { title: 'Ничьё, значит общее', text: '«Вместе» не работает на одного человека или одну организацию.' },
  { title: 'Дело вместо статуса', text: 'Здесь не спрашивают, кто ты по должности. Спрашивают, что ты сделал и что готов сделать.' },
  { title: 'Первый шаг вместе', text: 'Начать одному страшно. Поэтому первый шаг делаем вместе, а дальше каждый растёт через общее дело.' },
];

// Как начиналось (блок на «О нас»)
const STORY = [
  'Нас было двое: Платон и Илья. Разговоры о том, почему в Перми трудно найти своих, кончились простым решением. Нужно место, куда можно прийти без приглашения.',
  'Нашли зал на Ленина, 44, второй этаж. Осенью красили стены, чинили мебель и стелили ковёр сами, вместе с теми, кто пришёл помочь.',
  'Потом собралась команда: двадцать человек, у каждого своё дело, от дизайна до партнёрств. Первые гости согласились прийти ещё до открытия. Первые встречи — в ноябре.',
];
