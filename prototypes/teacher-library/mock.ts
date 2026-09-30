import type {
  ContextSource,
  KitItem,
  LessonState,
  LibraryCard,
  PlannedResult,
  Stage,
  ThematicPlan,
  WorksheetDraft,
} from "./types";

export const SUBJECTS = ["Математика", "Биология", "География", "История", "Русский язык"];
export const GRADES = ["5А", "5Б", "6А", "7А", "7Б", "8А", "9А"];
export const LANGUAGES = ["Русский", "Английский"];
export const TEXTBOOKS = [
  "Виленкин Н.Я. Математика. 5 класс",
  "Мерзляк А.Г. Математика. 5 класс",
  "Не использовать учебник",
];
export const DURATIONS = [40, 45, 90];

export const TASK_TYPE_OPTIONS = [
  { id: "review", label: "Повторение" },
  { id: "new", label: "Новый материал" },
  { id: "practice", label: "Практика" },
  { id: "check", label: "Проверка понимания" },
] as const;

export const TEST_LESSON = {
  subject: "Математика",
  grade: "5А",
  topic: "Уравнения",
  duration: 45,
  language: "Русский",
  textbook: "Виленкин Н.Я. Математика. 5 класс",
  classNotes: "5А, 26 учеников. Темп средний, нужна опора на схемы и пошаговые примеры.",
  previousLesson: "Числовые выражения",
  previousLessonNote:
    "На предыдущем уроке восемь учеников путали компоненты действий и не находили неизвестное слагаемое.",
};

export const NEXT_LESSON_TOPIC = "Решение уравнений";

export const INTENT_ACTIONS = [
  {
    id: "prepare",
    title: "Подготовить урок",
    detail: "План, презентация и материалы к конкретному занятию. Полная настройка класса не нужна.",
  },
  {
    id: "material",
    title: "Создать отдельный материал",
    detail: "Презентация, рабочий лист, схема, задание, план-конспект.",
  },
  {
    id: "check",
    title: "Проверить работы",
    detail: "Следующий этап. В этом прототипе не входит в основной маршрут.",
    later: true,
  },
  {
    id: "analyze",
    title: "Проанализировать проведенный урок",
    detail: "Следующий этап. В этом прототипе не входит в основной маршрут.",
    later: true,
  },
] as const;

export const GENERATORS = [
  { id: "presentation", title: "Презентация" },
  { id: "worksheet", title: "Рабочий лист" },
  { id: "scheme", title: "Схема" },
  { id: "task", title: "Задание" },
  { id: "plan", title: "План-конспект урока" },
] as const;

export const THEMATIC_PLANS: ThematicPlan[] = [
  {
    id: "math-5a",
    subject: "Математика",
    grade: "5А",
    title: "Числовые выражения и уравнения",
    hours: 8,
    lessons: [
      { id: "l1", number: 1, topic: "Числовые выражения", hours: 1, status: "done" },
      { id: "l2", number: 2, topic: "Уравнения", hours: 1, status: "next" },
      { id: "l3", number: 3, topic: "Решение уравнений", hours: 1, status: "planned" },
      { id: "l4", number: 4, topic: "Уравнения и текстовые задачи", hours: 1, status: "planned" },
      { id: "l5", number: 5, topic: "Уравнения с неизвестным уменьшаемым", hours: 1, status: "planned" },
      { id: "l6", number: 6, topic: "Проверка корня уравнения", hours: 1, status: "planned" },
      { id: "l7", number: 7, topic: "Обобщение по теме «Уравнения»", hours: 2, status: "planned" },
    ],
  },
  {
    id: "geo-6a",
    subject: "География",
    grade: "6А",
    title: "Гидросфера",
    hours: 6,
    lessons: [
      { id: "g1", number: 1, topic: "Мировой океан", hours: 1, status: "next" },
      { id: "g2", number: 2, topic: "Воды суши", hours: 2, status: "planned" },
    ],
  },
];

export const LIBRARY_CARDS: LibraryCard[] = [
  {
    id: "c1",
    title: "Числовые выражения",
    type: "Рабочий лист",
    subject: "Математика",
    grade: "5А",
    updated: "вчера",
  },
  {
    id: "c2",
    title: "Компоненты действий",
    type: "Презентация",
    subject: "Математика",
    grade: "5Б",
    updated: "3 дня назад",
  },
  {
    id: "c3",
    title: "Карта материков",
    type: "Схема",
    subject: "География",
    grade: "6А",
    updated: "неделю назад",
  },
];

export const DEFAULT_GOAL =
  "Сформировать представление об уравнении и научить решать простейшие уравнения вида x + a = b и a − x = b.";

export const ALT_GOAL =
  "Научить записывать равенство с неизвестным, находить корень и проверять его подстановкой.";

export const DEFAULT_RESULTS: PlannedResult[] = [
  { id: "r1", text: "Формулирует, что такое уравнение и корень уравнения." },
  { id: "r2", text: "Решает уравнения вида x + a = b и a − x = b." },
  { id: "r3", text: "Проверяет найденный корень подстановкой." },
  { id: "r4", text: "Находит неизвестный компонент действия в числовом выражении." },
];

export const KEY_CONTENT = [
  "Уравнение — равенство, содержащее неизвестное.",
  "Корень уравнения — значение неизвестного, которое обращает уравнение в верное равенство.",
  "Неизвестное слагаемое равно разности суммы и известного слагаемого.",
  "Проверка: подставить найденное число вместо x.",
];

export const PRIOR_KNOWLEDGE = [
  "Компоненты действий: слагаемые, сумма, уменьшаемое, вычитаемое.",
  "Порядок действий в числовом выражении.",
];

export const DIFFICULTIES = [
  "Путают правило для неизвестного слагаемого и неизвестного уменьшаемого.",
  "Находят число, но забывают проверить корень.",
];

export const ASSESSMENT =
  "Выходной билет: решить уравнение x + 8 = 23 и проверить корень подстановкой.";

export const RECOMMENDATION =
  "По результатам предыдущего урока восьми ученикам требуется повторение компонентов действий. Добавить 5–7 минут актуализации на нахождении неизвестного слагаемого.";

export const DEFAULT_STAGES: Stage[] = [
  {
    id: "s1",
    title: "Организационный момент",
    minutes: 2,
    teacher: "Проверяет готовность, сообщает тему.",
    students: "Готовят тетради и учебники.",
    format: "frontal",
    activity: "Приветствие и проверка готовности",
    goalIds: [],
    hasAssignment: false,
  },
  {
    id: "s2",
    title: "Актуализация",
    minutes: 7,
    teacher: "Предлагает вспомнить компоненты действий и найти неизвестное слагаемое.",
    students: "Называют слагаемые и сумму, находят неизвестный компонент.",
    format: "frontal",
    activity: "Повторение компонентов действий",
    goalIds: ["r4"],
    hasAssignment: true,
  },
  {
    id: "s3",
    title: "Целеполагание",
    minutes: 3,
    teacher: "Фиксирует проблемный вопрос: чем уравнение отличается от числового равенства.",
    students: "Формулируют, что узнают и чему научатся.",
    format: "frontal",
    activity: "Постановка учебной задачи",
    goalIds: ["r1"],
    hasAssignment: false,
  },
  {
    id: "s4",
    title: "Изучение материала",
    minutes: 12,
    teacher: "Объясняет, что такое уравнение и как найти корень, по презентации и схеме.",
    students: "Заполняют схему «Части уравнения», задают уточняющие вопросы.",
    format: "frontal",
    activity: "Объяснение с опорой на схему",
    goalIds: ["r1", "r2", "r3"],
    hasAssignment: false,
  },
  {
    id: "s5",
    title: "Практическая работа",
    minutes: 12,
    teacher: "Организует работу с рабочим листом: решить и проверить уравнения.",
    students: "Решают уравнения, выполняют проверку, сдают лист.",
    format: "individual",
    activity: "Решение уравнений по рабочему листу",
    goalIds: ["r1", "r2", "r4"],
    hasAssignment: true,
  },
  {
    id: "s6",
    title: "Рефлексия",
    minutes: 6,
    teacher: "Проводит выходной билет, комментирует типичные ошибки.",
    students: "Решают одно уравнение, проверяют корень, сдают билет.",
    format: "individual",
    activity: "Выходной билет",
    goalIds: ["r1", "r2", "r3"],
    hasAssignment: true,
  },
  {
    id: "s7",
    title: "Домашнее задание",
    minutes: 3,
    teacher: "Комментирует задание в учебнике и опцию повышенной сложности.",
    students: "Записывают домашнее задание.",
    format: "frontal",
    activity: "Инструктаж по ДЗ",
    goalIds: ["r3"],
    hasAssignment: true,
  },
];

export const FORMAT_LABEL: Record<Stage["format"], string> = {
  frontal: "Фронтально",
  pair: "В парах",
  group: "В группах",
  individual: "Индивидуально",
};

export const STAGE_AI_ACTIONS = [
  { id: "practical", label: "Сделать этап более практическим" },
  { id: "shorten7", label: "Сократить до 7 минут" },
  { id: "group", label: "Добавить групповую работу" },
  { id: "weak", label: "Адаптировать для слабого класса" },
  { id: "noDevices", label: "Предложить вариант без устройств" },
  { id: "challenge", label: "Добавить задание повышенной сложности" },
] as const;

export const KIT_CATALOG: KitItem[] = [
  {
    id: "m-presentation",
    title: "Презентация",
    recommended: true,
    audience: "teacher",
    stageId: "s4",
    stageTitle: "Изучение материала",
    format: "Показать на экране",
    purpose: "Последовательно показать, что такое уравнение, корень и проверка.",
    preview: ["Тема и цель", "Что такое уравнение", "Как найти корень", "Проверка подстановкой"],
  },
  {
    id: "m-scheme",
    title: "Схема «Части уравнения»",
    recommended: true,
    audience: "students",
    stageId: "s4",
    stageTitle: "Изучение материала",
    format: "Раздать или отправить",
    purpose: "Опора при объяснении: левая часть, правая часть, неизвестное.",
    preview: ["Левая часть", "Знак =", "Правая часть", "Неизвестное x"],
  },
  {
    id: "m-worksheet",
    title: "Рабочий лист",
    recommended: true,
    audience: "students",
    stageId: "s5",
    stageTitle: "Практическая работа",
    format: "Заполнить и сдать",
    purpose: "Закрепить решение простейших уравнений и проверку корня.",
    preview: ["Инструкция", "Задание 1", "Задание 2", "Критерии"],
  },
  {
    id: "m-activation",
    title: "Задание на актуализацию",
    recommended: false,
    audience: "students",
    stageId: "s2",
    stageTitle: "Актуализация",
    format: "Устно или на карточке",
    purpose: "Повторить компоненты действий перед новой темой.",
    preview: ["□ + 12 = 30", "Что известно, что найти"],
  },
  {
    id: "m-homework",
    title: "Домашнее задание",
    recommended: false,
    audience: "students",
    stageId: "s7",
    stageTitle: "Домашнее задание",
    format: "Записать в дневник",
    purpose: "Закрепить решение уравнений по учебнику.",
    preview: ["№ 312, 314", "Проверить два корня"],
  },
  {
    id: "m-notes",
    title: "Опорный конспект",
    recommended: true,
    audience: "students",
    stageId: "s4",
    stageTitle: "Изучение материала",
    format: "Вклеить в тетрадь",
    purpose: "Короткая опора: определение и правила нахождения неизвестного.",
    preview: ["Определение уравнения", "Правило для слагаемого"],
  },
  {
    id: "m-challenge",
    title: "Карточки повышенной сложности",
    recommended: false,
    audience: "students",
    stageId: "s5",
    stageTitle: "Практическая работа",
    format: "Дополнительно сильным",
    purpose: "Составить уравнение по тексту и решить его.",
    preview: ["Текстовая задача", "Записать уравнение"],
  },
  {
    id: "m-exit",
    title: "Выходной билет",
    recommended: true,
    audience: "students",
    stageId: "s6",
    stageTitle: "Рефлексия",
    format: "Выполнить в конце урока",
    purpose: "Проверить достижение результатов за 6 минут.",
    preview: ["Реши x + 8 = 23", "Проверь корень"],
  },
];

export const DEFAULT_WORKSHEET: WorksheetDraft = {
  title: "Рабочий лист. Уравнения",
  studentInstruction:
    "Решите уравнения и выполните проверку. Работайте 12 минут, затем сдайте лист.",
  tasks: [
    {
      id: "t1",
      prompt: "Запишите уравнение по схеме: неизвестное плюс 7 равно 15. Найдите корень.",
    },
    {
      id: "t2",
      prompt: "Решите уравнения: x + 9 = 24 и 18 − x = 5. Проверьте каждый корень подстановкой.",
    },
    {
      id: "t3",
      prompt: "В записи □ + 12 = 30 найдите неизвестное слагаемое. Объясните правило.",
      support: "Для восьми учеников: сначала назовите, что известно, а что нужно найти.",
    },
  ],
  expectedMinutes: 12,
  criteria: [
    "Уравнение записано верно.",
    "Корень найден по правилу компонента действия.",
    "Проверка выполнена подстановкой.",
  ],
  resultId: "r1",
  stageId: "s5",
};

export const READINESS_ITEMS = [
  { id: "plan", label: "План утвержден", required: true },
  { id: "presentation", label: "Презентация готова", required: true },
  { id: "students", label: "Материалы для учеников готовы", required: true },
  { id: "tasks", label: "Задания готовы", required: true },
  { id: "criteria", label: "Критерии определены", required: true },
  { id: "time", label: "Общая продолжительность 45 минут", required: true },
  { id: "goals", label: "Все цели покрыты заданиями", required: true },
  { id: "equipment", label: "Оборудование не указано", required: false },
] as const;

export const READINESS_NOTE =
  "Для практической работы потребуется раздаточный материал. Проверьте, что он распечатан для 26 учеников.";

export function emptyLesson(): LessonState {
  return {
    subject: "",
    grade: "",
    topic: "",
    duration: 45,
    language: "Русский",
    textbook: "",
    classNotes: "",
    ownGoal: "",
    taskTypes: ["new", "practice"],
    ownMaterialNote: "",
    previousLessonNote: "",
    includeOwnMaterials: false,
    includePreviousLesson: false,
    includeClassNotes: false,
    excludedSourceIds: [],
    lessonGoal: DEFAULT_GOAL,
    plannedResults: DEFAULT_RESULTS.map((item) => ({ ...item })),
    keyContent: [...KEY_CONTENT],
    priorKnowledge: [...PRIOR_KNOWLEDGE],
    difficulties: [...DIFFICULTIES],
    assessment: ASSESSMENT,
    recommendation: RECOMMENDATION,
    recommendationAccepted: false,
    stages: DEFAULT_STAGES.map((item) => ({ ...item })),
    planApproved: false,
    editingStageId: null,
    materials: KIT_CATALOG.map((item) => ({
      ...item,
      status: "queued",
      selected: item.recommended,
    })),
    worksheet: {
      ...DEFAULT_WORKSHEET,
      tasks: DEFAULT_WORKSHEET.tasks.map((task) => ({ ...task })),
      criteria: [...DEFAULT_WORKSHEET.criteria],
    },
    worksheetDirty: false,
    resultChanged: false,
    kitSaved: false,
    contextSaved: false,
  };
}

export function prefilledBasics(): LessonState {
  const lesson = emptyLesson();
  return {
    ...lesson,
    subject: TEST_LESSON.subject,
    grade: TEST_LESSON.grade,
    topic: TEST_LESSON.topic,
    duration: TEST_LESSON.duration,
    language: TEST_LESSON.language,
    textbook: TEST_LESSON.textbook,
    classNotes: TEST_LESSON.classNotes,
    previousLessonNote: TEST_LESSON.previousLessonNote,
  };
}

export function kitReadyLesson(): LessonState {
  const lesson = prefilledBasics();
  return {
    ...lesson,
    includePreviousLesson: true,
    includeClassNotes: true,
    recommendationAccepted: true,
    planApproved: true,
    materials: lesson.materials.map((item) => ({
      ...item,
      selected: item.recommended || item.id === "m-activation",
      status: item.recommended || item.id === "m-activation" ? "ready" : "queued",
    })),
  };
}

export function buildSources(lesson: LessonState): ContextSource[] {
  const sources: ContextSource[] = [];
  if (lesson.topic) {
    sources.push({
      id: "src-topic",
      kind: "topic",
      label: "Тема урока",
      detail: lesson.topic,
      removable: false,
    });
  }
  if (lesson.grade) {
    sources.push({
      id: "src-grade",
      kind: "grade",
      label: "Класс",
      detail: lesson.grade,
      removable: false,
    });
  }
  sources.push({
    id: "src-duration",
    kind: "duration",
    label: "Продолжительность",
    detail: `${lesson.duration} мин`,
    removable: false,
  });
  if (lesson.language) {
    sources.push({
      id: "src-language",
      kind: "language",
      label: "Язык материалов",
      detail: lesson.language,
      removable: true,
    });
  }
  if (lesson.textbook && lesson.textbook !== "Не использовать учебник") {
    sources.push({
      id: "src-textbook",
      kind: "textbook",
      label: "Учебник",
      detail: lesson.textbook,
      removable: true,
    });
  }
  if (lesson.ownGoal.trim()) {
    sources.push({
      id: "src-goal",
      kind: "ownGoal",
      label: "Цель учителя",
      detail: lesson.ownGoal,
      removable: true,
    });
  }
  if (lesson.includeClassNotes && lesson.classNotes.trim()) {
    sources.push({
      id: "src-class",
      kind: "classNotes",
      label: `Особенности ${lesson.grade || "класса"}`,
      detail: lesson.classNotes,
      removable: true,
    });
  }
  if (lesson.includeOwnMaterials && lesson.ownMaterialNote.trim()) {
    sources.push({
      id: "src-own",
      kind: "ownMaterials",
      label: "Материалы учителя",
      detail: lesson.ownMaterialNote,
      removable: true,
    });
  }
  if (lesson.includePreviousLesson) {
    sources.push({
      id: "src-prev",
      kind: "previousLesson",
      label: "Предыдущий урок",
      detail: lesson.previousLessonNote || TEST_LESSON.previousLessonNote,
      removable: true,
    });
  }
  if (lesson.recommendationAccepted) {
    sources.push({
      id: "src-rec",
      kind: "recommendation",
      label: "Рекомендация AI",
      detail: "Повторение компонентов действий для восьми учеников",
      removable: true,
    });
  }
  return sources.filter((source) => !lesson.excludedSourceIds.includes(source.id));
}

export function stagesTotal(stages: Stage[]) {
  return stages.reduce((sum, stage) => sum + stage.minutes, 0);
}

export function audienceLabel(audience: KitItem["audience"]) {
  return audience === "teacher" ? "Учителю" : "Ученикам";
}
