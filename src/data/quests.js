export const quests = [
  {
    id: 1,
    title: 'Первый Фини',
    description: 'Познакомься со своими первыми деньгами и узнай, где живут квесты.',
    reward: 10,

    planetId: 1,
    status: 'complited',
    x: '7%',
    y: '10%',
    type: 'learn',

    steps: [
      {
        type: 'info',
        text: 'Фини — это внутренняя валюта приложения.',
      },
      {
        type: 'highlight',
        target: 'balance',
        text: 'Здесь отображается твой баланс.',
      },
      {
        type: 'complete',
        text: 'Отлично! Ты готов(а) зарабатывать Фини.',
      },
    ],
  },
  {
    id: 2,
    title: 'Четыре конверта Фини',
    description: 'Деньги любят порядок. Узнай, зачем их распределять и как это помогает.',
    reward: 15,
    planetId: 1,
    status: 'complited',
    x: '11%',
    y: '25%',
    type: 'learn',
    steps: [
      {
        type: 'info',
        text: 'Чтобы управлять деньгами, их нужно распределять.',
      },
      {
        type: 'info',
        text: 'У тебя есть 4 конверта: Накопления, Покупки, Развлечения и Запас.',
      },
      {
        type: 'highlight',
        target: 'covers',
        text: 'Вот твои конверты.',
      },
      {
        type: 'complete',
        text: 'Теперь ты знаешь, где живут твои Фини.',
      },
    ],
  },
  {
    id: 3,
    title: 'Деньги пришли — куда они пойдут?',
    description: 'Разложи деньги по конвертам и посмотри, хватает ли их на всё задуманное.',
    reward: 25,
    planetId: 1,
    status: 'available',
    x: '19%',
    y: '29%',
    type: 'play',
    steps: [
      {
        type: 'info',
        text: 'Ты получил 100 Фини. Распредели их по конвертам.',
      },
      {
        type: 'action',
        action: 'distributeMoney',
        requiredTotal: 100,
        text: 'Разложи деньги так, чтобы сумма была 100.',
      },
      {
        type: 'complete',
        text: 'Отлично! Деньги любят порядок.',
      },
    ],
  },
  {
    id: 4,
    title: 'Маленькая цель',
    description: 'Выбери цель и начни копить на то, что действительно важно.',
    reward: 40,

    planetId: 1,
    status: 'locked',
    x: '24%',
    y: '45%',
    type: 'plan',
    steps: [
      {
        type: 'info',
        text: 'Цель помогает не тратить всё сразу.',
      },
      {
        type: 'highlight',
        target: 'target',
        text: 'Здесь отображается твоя цель.',
      },
      {
        type: 'action',
        action: 'createGoal',
        text: 'Создай цель и укажи сумму.',
      },
      {
        type: 'complete',
        text: 'Ты сделал первый шаг к мечте.',
      },
    ],
  },
  {
    id: 5,
    title: 'Умный покупатель',
    description: 'Выбери покупку и узнай, как решение влияет на твои деньги.',
    reward: 25,

    planetId: 2,
    status: 'locked',
    x: '31%',
    y: '60%',
    type: 'play',
    steps: [
      {
        type: 'info',
        text: 'Ты хочешь купить наушники за 80 Фини.',
      },
      {
        type: 'choice',
        question: 'Что ты сделаешь?',
        options: [
          { text: 'Куплю сразу', effect: 'minusSavings' },
          { text: 'Проверю, хватает ли в конверте Покупки', correct: true },
          { text: 'Возьму из Запаса', effect: 'risk' },
        ],
      },
      {
        type: 'info',
        text: 'Всегда проверяй, из какого конверта ты тратишь.',
      },
      {
        type: 'complete',
        text: 'Ты становишься осознанным покупателем.',
      },
    ],
  },
  {
    id: 6,
    title: 'Проверь сдачу',
    description: 'Посчитай сдачу и проверь, правильно ли тебе вернули деньги.',
    reward: 30,
    planetId: 2,
    status: 'locked',
    x: '40%',
    y: '70%',
    type: 'think',
    steps: [
      {
        type: 'info',
        text: 'Ты дал 100 Фини за покупку стоимостью 73 Фини.',
      },
      {
        type: 'calculation',
        question: 'Сколько сдачи ты должен получить?',
        correctAnswer: 27,
      },
      {
        type: 'complete',
        text: 'Ты внимателен к своим деньгам!',
      },
    ],
  },
  {
    id: 7,
    title: 'Скидка — это правда?',
    description: 'Скидка — это выгодно или ловушка? Разберись в процентах.',
    reward: 30,
    planetId: 2,
    status: 'locked',
    x: '47%',
    y: '55%',
    type: 'play',
    steps: [
      {
        type: 'info',
        text: 'Товар стоит 200 Фини. Скидка 25%.',
      },
      {
        type: 'calculation',
        question: 'Сколько ты заплатишь?',
        correctAnswer: 150,
      },
      {
        type: 'info',
        text: 'Скидка выгодна только если покупка тебе действительно нужна.',
      },
      {
        type: 'complete',
        text: 'Ты разобрался в процентах!',
      },
    ],
  },
  {
    id: 8,
    title: 'Фини в долг',
    description: 'Взять деньги легко, но возвращать приходится больше. Проверь сам.',
    reward: 30,

    planetId: 3,
    status: 'locked',
    x: '54%',
    y: '37%',
    type: 'think',
    steps: [
      {
        type: 'info',
        text: 'Ты занял 100 Фини под 20% комиссии.',
      },
      {
        type: 'calculation',
        question: 'Сколько придётся вернуть?',
        correctAnswer: 120,
      },
      {
        type: 'info',
        text: 'Долг всегда возвращается больше, чем берёшь.',
      },
      {
        type: 'complete',
        text: 'Теперь ты понимаешь цену займа.',
      },
    ],
  },
  {
    id: 9,
    title: 'Куда вложить Фини?',
    description: 'Распредели деньги и узнай, как риск влияет на доход.',
    reward: 35,

    planetId: 3,
    status: 'locked',
    x: '61%',
    y: '20%',
    type: 'think',
    steps: [
      {
        type: 'info',
        text: 'У тебя есть 200 Фини для вложений.',
      },
      {
        type: 'choice',
        question: 'Куда вложить?',
        options: [
          { text: 'Низкий риск — 5% доход', effect: 'safe' },
          { text: 'Средний риск — 15%', effect: 'medium' },
          { text: 'Высокий риск — 40%', effect: 'high' },
        ],
      },
      {
        type: 'timer',
        duration: 3,
        text: 'Смотрим, что произойдёт...',
      },
      {
        type: 'complete',
        text: 'Доход зависит от риска.',
      },
    ],
  },
  {
    id: 10,
    title: 'Фини-ферма',
    description: 'Вложи деньги и подожди. Иногда время работает на тебя.',
    reward: 35,
    planetId: 3,
    status: 'locked',
    x: '68%',
    y: '35%',
    type: 'think',
    steps: [
      {
        type: 'info',
        text: 'Ты вложил 100 Фини.',
      },
      {
        type: 'timer',
        duration: 5,
        text: 'Иногда нужно просто подождать.',
      },
      {
        type: 'info',
        text: 'Через время деньги могут вырасти.',
      },
      {
        type: 'complete',
        text: 'Терпение — часть финансовой стратегии.',
      },
    ],
  },
  {
    id: 11,
    title: 'Финансовая подушка',
    description: 'Создай запас денег, который защитит тебя в трудный момент.',
    reward: 50,
    planetId: 4,
    status: 'locked',
    x: '75%',
    y: '50%',
    type: 'plan',
    steps: [
      {
        type: 'info',
        text: 'Финансовая подушка — это запас на 3 месяца.',
      },
      {
        type: 'calculation',
        question: 'Если тебе нужно 200 Фини в месяц, сколько нужно накопить на 3 месяца?',
        correctAnswer: 600,
      },
      {
        type: 'complete',
        text: 'Теперь ты защищён от неожиданностей.',
      },
    ],
  },
  {
    id: 12,
    title: 'План Фини на месяц',
    description: 'Распланируй доход на месяц и докажи, что ты финансовый мастер.',
    reward: 60,
    planetId: 4,
    status: 'locked',
    x: '83%',
    y: '60%',
    type: 'plan',
    steps: [
      {
        type: 'info',
        text: 'Твой доход — 500 Фини.',
      },
      {
        type: 'action',
        action: 'monthlyPlanning',
        requiredTotal: 500,
        text: 'Распредели доход по конвертам.',
      },
      {
        type: 'choice',
        question: 'Ты оставил деньги на накопления?',
        options: [
          { text: 'Да', correct: true },
          { text: 'Нет', correct: false },
        ],
      },
      {
        type: 'complete',
        text: 'Ты стал финансовым мастером.',
      },
    ],
  },
];
