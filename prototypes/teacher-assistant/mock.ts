import type { LibraryMaterial, RoleId, TeachingPair } from "./types";

export const ROLES: { id: RoleId; title: string; detail: string; benefit: string }[] = [
  {
    id: "subject",
    title: "Учитель-предметник",
    detail: "Веду один или несколько предметов в классах",
    benefit:
      "Система подберёт КТП по ФРП и ФГОС, предложит уроки в логике программы и сгенерирует материалы под ваш предмет.",
  },
  {
    id: "classTeacher",
    title: "Классный руководитель",
    detail: "Курирую класс и координирую работу с коллегами",
    benefit:
      "Расписание поможет видеть нагрузку класса, а материалы — быстро готовить классные часы и проектные занятия.",
  },
  {
    id: "tutor",
    title: "Репетитор",
    detail: "Работаю индивидуально или с малыми группами",
    benefit:
      "Можно вести несколько программ параллельно и собирать уроки без привязки к школьному КТП, если это удобнее.",
  },
];

export const SUBJECTS = ["Алгебра", "Геометрия", "Русский язык", "Физика", "История", "Биология"];

export const GRADES = ["5", "6", "7", "8", "9", "10", "11"];

export const UMK_BY_SUBJECT: Record<string, string> = {
  Алгебра: "Виленкин 7–9",
  Геометрия: "Атанасян 7–9",
  "Русский язык": "Баранов 5–9",
  Физика: "Пёрышкин 7–9",
  История: "Арсентьев 5–9",
  Биология: "Пасечник 5–9",
};

export function umkForSubject(subject: string) {
  return UMK_BY_SUBJECT[subject] ?? "УМК по ФРП";
}

export const DEFAULT_PAIR: TeachingPair = {
  id: "pair-1",
  subject: "Алгебра",
  grade: "9",
  umk: "Виленкин 7–9",
};

export const CHAT_SUGGESTS = [
  "Составь план урока по теме «Квадратные уравнения»",
  "Какие задания дать слабому классу на контрольной?",
  "Предложи идеи для рефлексии в конце урока",
];

export const HOME_MATERIALS = [
  { id: "slides", title: "Создать презентацию", later: true },
  { id: "quiz", title: "Создать викторину", later: true },
  { id: "task", title: "Создать задание", later: true },
  { id: "analyze", title: "Проанализировать урок", later: true },
];

export const LIBRARY_MATERIALS: LibraryMaterial[] = [
  {
    id: "lib-pres-1",
    type: "presentation",
    title: "Модуль числа · объяснение",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "12 сен 2026",
  },
  {
    id: "lib-sheet-1",
    type: "worksheet",
    title: "Рабочий лист: свойства модуля",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "8 сен 2026",
  },
  {
    id: "lib-task-1",
    type: "task",
    title: "Задание: сравнение выражений с модулем",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "5 сен 2026",
  },
  {
    id: "lib-task-2",
    type: "task",
    title: "Домашняя работа · базовый уровень",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "1 сен 2026",
  },
  {
    id: "lib-info-1",
    type: "infographic",
    title: "Инфографика: модуль на координатной прямой",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "28 авг 2026",
  },
  {
    id: "lib-pres-2",
    type: "presentation",
    title: "Квадратные уравнения · введение",
    subject: "Алгебра",
    grade: "9",
    updatedAt: "20 авг 2026",
  },
];

export const LIBRARY_TYPE_LABELS: Record<LibraryMaterial["type"], string> = {
  presentation: "Презентация",
  worksheet: "Рабочий лист",
  task: "Задание",
  infographic: "Инфографика",
};

export function libraryForPair(subject: string, grade: string) {
  return LIBRARY_MATERIALS.filter((item) => item.subject === subject && item.grade === grade);
}

export const LESSON_OUTCOME = [
  "Сценарий урока с этапами и таймингом",
  "Презентация к объяснению",
  "Рабочий лист для класса",
  "Задания для домашней работы",
  "Критерии оценивания и рефлексия",
];

export type KtpLesson = {
  id: string;
  number: number;
  topic: string;
  hours: number;
  status: "done" | "next" | "planned";
  prevTopic?: string;
  nextTopic?: string;
};

export type KtpTheme = {
  id: string;
  title: string;
  hours: number;
  independentWorks: number;
  controlWorks: number;
  lessons: KtpLesson[];
};

export type ThematicPlan = {
  id: string;
  subject: string;
  grade: string;
  umk: string;
  title: string;
  hours: number;
  frp: string;
  themes: KtpTheme[];
};

export const THEMATIC_PLANS: ThematicPlan[] = [
  {
    id: "alg-9-vilenkin",
    subject: "Алгебра",
    grade: "9",
    umk: "Виленкин 7–9",
    title: "Алгебра 9 класс · Виленкин",
    hours: 140,
    frp: "ФРП СОО · ФГОС СОО · базовый уровень",
    themes: [
      {
        id: "t1",
        title: "Действительные числа: сравнение и модуль",
        hours: 6,
        independentWorks: 1,
        controlWorks: 0,
        lessons: [
          {
            id: "l1",
            number: 3,
            topic: "Сравнение действительных чисел",
            hours: 2,
            status: "done",
            nextTopic: "Модуль числа",
          },
          {
            id: "l2",
            number: 4,
            topic: "Модуль числа",
            hours: 2,
            status: "next",
            prevTopic: "Сравнение действительных чисел",
            nextTopic: "Приближённые вычисления",
          },
        ],
      },
      {
        id: "t2",
        title: "Приближённые вычисления и корни",
        hours: 5,
        independentWorks: 2,
        controlWorks: 1,
        lessons: [
          {
            id: "l3",
            number: 5,
            topic: "Приближённые вычисления",
            hours: 2,
            status: "planned",
            prevTopic: "Модуль числа",
            nextTopic: "Квадратные корни",
          },
          {
            id: "l4",
            number: 6,
            topic: "Квадратные корни",
            hours: 3,
            status: "planned",
            prevTopic: "Приближённые вычисления",
          },
        ],
      },
    ],
  },
  {
    id: "rus-8-baranov",
    subject: "Русский язык",
    grade: "8",
    umk: "Баранов 5–9",
    title: "Русский язык 8 класс · Баранов",
    hours: 102,
    frp: "ФРП СОО · ФГОС СОО",
    themes: [
      {
        id: "rt1",
        title: "Обособленные члены предложения",
        hours: 8,
        independentWorks: 1,
        controlWorks: 0,
        lessons: [
          {
            id: "r1",
            number: 12,
            topic: "Обособленные определения и приложения",
            hours: 2,
            status: "next",
            prevTopic: "Причастный оборот",
            nextTopic: "Сложное предложение",
          },
        ],
      },
    ],
  },
];

export function lessonInPlan(plan: ThematicPlan, lessonId: string) {
  for (const theme of plan.themes) {
    const lesson = theme.lessons.find((item) => item.id === lessonId);
    if (lesson) return { theme, lesson };
  }
  return null;
}

export function planForPair(pair: TeachingPair) {
  return THEMATIC_PLANS.find(
    (item) => item.subject === pair.subject && item.grade === pair.grade && item.umk === pair.umk,
  );
}

export function profileMissingForLesson(profile: { pairs: TeachingPair[] }) {
  return profile.pairs.length === 0;
}

export function profileGaps(profile: {
  roles: RoleId[];
  pairs: TeachingPair[];
  scheduleFile: string | null;
  planFile: string | null;
  skippedOnboarding: boolean;
}) {
  const gaps: string[] = [];
  if (profile.roles.length === 0) gaps.push("роль");
  if (profile.pairs.length === 0) gaps.push("предмет и класс");
  if (!profile.scheduleFile) gaps.push("расписание");
  if (!profile.planFile && profile.pairs.every((pair) => !planForPair(pair))) gaps.push("тематический план");
  return gaps;
}

export function isHomeComplete(profile: {
  roles: RoleId[];
  pairs: TeachingPair[];
  scheduleFile: string | null;
  planFile: string | null;
}) {
  return profile.roles.length > 0 && profile.pairs.length > 0 && Boolean(profile.scheduleFile) && Boolean(profile.planFile);
}
