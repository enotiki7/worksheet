import type { LibraryMaterial, MaterialId, RoleId, Scenario, TeachingPair } from "./types";
import { ALGEBRA_9_THEMATIC_PLAN } from "./data/algebra-9-thematic-plan";

export const ROLES: { id: RoleId; title: string; detail: string; benefit: string }[] = [
  {
    id: "subject",
    title: "Учитель-предметник",
    detail: "Веду один или несколько предметов в классах",
    benefit:
      "Система подберёт типовой КТП, предложит уроки в логике программы и сгенерирует материалы под ваш предмет.",
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

export const OTHER_SUBJECT = "Другой";

export const SUBJECTS = ["Алгебра", "Геометрия", "Русский язык", "Физика", "История", "Биология", OTHER_SUBJECT];

export function isOtherSubject(subject: string) {
  return subject === OTHER_SUBJECT;
}

export const GRADES = ["5", "6", "7", "8", "9", "10", "11"];

export const UMK_BY_SUBJECT: Record<string, string> = {
  Алгебра: "Алгебра 7–9",
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
  umk: "Алгебра 7–9",
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
    title: "Действительные числа · объяснение",
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
  lessonKind?: string;
  status: "done" | "next" | "planned";
  prevTopic?: string;
  nextTopic?: string;
  createdMaterials?: MaterialId[];
};

export const DONE_LESSON_MATERIALS: MaterialId[] = ["presentation", "motivation", "classWork", "homework", "worksheet"];

export function lessonStatusLabel(status: KtpLesson["status"]) {
  if (status === "done") return "проведён";
  if (status === "next") return "следующий";
  return "в плане";
}

export function planForPick(scenario: Scenario, pair: TeachingPair): ThematicPlan | undefined {
  if (!pair.subject || !pair.grade || isOtherSubject(pair.subject)) return undefined;
  const base = planForPair(pair) ?? THEMATIC_PLANS.find((item) => item.subject === pair.subject && item.grade === pair.grade);
  if (!base) return undefined;

  if (scenario === "next-lesson") {
    return {
      ...base,
      themes: base.themes.map((theme) => ({
        ...theme,
        lessons: theme.lessons.map((lesson) => {
          if (lesson.id === "l1") {
            return { ...lesson, status: "done" as const, createdMaterials: DONE_LESSON_MATERIALS };
          }
          if (lesson.id === "l2") {
            return { ...lesson, status: "next" as const, createdMaterials: undefined };
          }
          return { ...lesson, status: "planned" as const, createdMaterials: undefined };
        }),
      })),
    };
  }

  return {
    ...base,
    themes: base.themes.map((theme) => ({
      ...theme,
      lessons: theme.lessons.map((lesson) => ({
        ...lesson,
        status: "planned" as const,
        createdMaterials: undefined,
      })),
    })),
  };
}

export type KtpTheme = {
  id: string;
  title: string;
  hours: number;
  independentWorks: number;
  controlWorks: number;
  controlForms?: string;
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

function cloneThematicPlan(plan: typeof ALGEBRA_9_THEMATIC_PLAN): ThematicPlan {
  return {
    ...plan,
    themes: plan.themes.map((theme) => ({
      ...theme,
      lessons: theme.lessons.map((lesson) => ({ ...lesson })),
    })),
  };
}

export const THEMATIC_PLANS: ThematicPlan[] = [
  cloneThematicPlan(ALGEBRA_9_THEMATIC_PLAN),
  {
    id: "rus-8-baranov",
    subject: "Русский язык",
    grade: "8",
    umk: "Баранов 5–9",
    title: "Русский язык 8 класс · Баранов",
    hours: 102,
    frp: "ФРП СОО",
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
            status: "planned",
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

export function profileGaps(profile: { roles: RoleId[]; pairs: TeachingPair[] }) {
  const gaps: string[] = [];
  if (profile.roles.length === 0) gaps.push("роль");
  if (profile.pairs.length === 0) gaps.push("предмет и класс");
  return gaps;
}

export function isHomeComplete(profile: { roles: RoleId[]; pairs: TeachingPair[] }) {
  return profile.roles.length > 0 && profile.pairs.length > 0;
}
