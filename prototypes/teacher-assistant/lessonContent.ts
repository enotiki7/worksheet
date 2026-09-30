import type { LessonContent, MaterialId } from "./types";

export type LessonPreview = {
  goals: string[];
  tasks: string[];
  results: { label: string; items: string[] }[];
};

export const LESSON_PREVIEWS: Record<string, LessonPreview> = {
  l1: {
    goals: [
      "Научиться сравнивать действительные числа разных видов и обосновывать знак сравнения.",
      "Сформировать умение выбирать рациональный способ сравнения.",
    ],
    tasks: [
      "Актуализировать свойства действительных чисел и типичные ошибки при сравнении.",
      "Отработать алгоритм сравнения на заданиях формата ОГЭ.",
    ],
    results: [
      {
        label: "Предметные",
        items: [
          "Знать свойства отношений «больше», «меньше», «равно».",
          "Уметь сравнивать дроби, корни и степени.",
        ],
      },
      {
        label: "Метапредметные",
        items: ["Выделять существенные данные и выбирать способ сравнения."],
      },
    ],
  },
  l2: {
    goals: [
      "Понять понятие модуля числа и уметь находить |a| для действительных a.",
      "Научиться сравнивать выражения с модулем и решать простые уравнения |x| = a.",
    ],
    tasks: [
      "Ввести определение модуля через расстояние на координатной прямой.",
      "Закрепить свойства модуля на примерах и заданиях ОГЭ.",
    ],
    results: [
      {
        label: "Предметные",
        items: [
          "Знать определение модуля числа и его геометрический смысл.",
          "Уметь вычислять модуль и сравнивать числа с учётом знака.",
        ],
      },
      {
        label: "Личностные",
        items: ["Осознавать связь модуля с расстоянием и повседневными задачами."],
      },
    ],
  },
};

const DEFAULT_PREVIEW: LessonPreview = {
  goals: ["Сформировать понимание темы урока и умение применять изученные способы решения."],
  tasks: ["Объяснить ключевые понятия и закрепить их на практических заданиях."],
  results: [
    {
      label: "Предметные",
      items: ["Знать основные определения и уметь применять алгоритм решения."],
    },
  ],
};

export function previewForLesson(lessonId: string): LessonPreview {
  return LESSON_PREVIEWS[lessonId] ?? DEFAULT_PREVIEW;
}

export function defaultMaterials(): Record<MaterialId, boolean> {
  return {
    presentation: true,
    infographic: false,
    motivation: false,
    classWork: true,
    homework: true,
    worksheet: true,
  };
}

export function buildLessonContent(lessonId: string, topic: string): LessonContent {
  const preview = previewForLesson(lessonId);

  return {
    goals: [...preview.goals],
    tasks: [...preview.tasks],
    results: preview.results.map((block) => ({ ...block, items: [...block.items] })),
    steps: [
      {
        id: "s1",
        title: "Организационный момент и мотивация",
        minutes: 3,
        goal: "Включить учащихся в работу, показать практическую значимость темы.",
      },
      {
        id: "s2",
        title: "Актуализация знаний",
        minutes: 7,
        goal: "Восстановить опорные понятия, необходимые для новой темы.",
      },
      {
        id: "s3",
        title: "Открытие нового знания",
        minutes: 12,
        goal: `Сформулировать и применить ключевые идеи темы «${topic}».`,
      },
      {
        id: "s4",
        title: "Первичное закрепление",
        minutes: 10,
        goal: "Отработать базовый алгоритм в парах и на доске.",
      },
      {
        id: "s5",
        title: "Самостоятельная работа",
        minutes: 10,
        goal: "Диагностировать освоение материала в формате, близком к ОГЭ.",
      },
      {
        id: "s6",
        title: "Рефлексия и домашнее задание",
        minutes: 3,
        goal: "Обобщить результаты урока и определить дальнейшую практику.",
      },
    ],
    reflection: [
      "Что нового вы узнали на уроке?",
      "Какой способ решения показался самым надёжным?",
      "Где вы испытывали затруднения?",
    ],
    homework: [
      {
        level: "Базовый",
        text: "Выполнить 4 задания из рабочего листа: два на вычисление, два на сравнение.",
      },
      {
        level: "Повышенный",
        text: "Решить 3 задачи повышенной сложности с обоснованием каждого шага.",
      },
      {
        level: "Высокий",
        text: "Составить 2 собственных задания формата ОГЭ и решить их.",
      },
    ],
    materials: defaultMaterials(),
  };
}

export const MATERIAL_LABELS: { id: MaterialId; label: string }[] = [
  { id: "presentation", label: "Презентация к уроку" },
  { id: "infographic", label: "Инфографика" },
  { id: "motivation", label: "Мотивирующее задание" },
  { id: "classWork", label: "Задание для классной работы" },
  { id: "homework", label: "Задание для домашней работы" },
  { id: "worksheet", label: "Рабочий лист" },
];

export const EDIT_SUGGESTS = [
  "Сократить цель урока",
  "Добавить групповую работу",
  "Упростить формулировки",
  "Добавить задание повышенной сложности",
];

export const WORKSPACE_SUGGESTS: Record<string, string[]> = {
  plan: ["Сократить цель урока", "Добавить этап закрепления", "Упростить формулировки"],
  presentation: ["Добавить слайд с примером", "Упростить текст на слайдах", "Добавить итоговый слайд"],
  tasks: ["Добавить задание для слабого класса", "Сделать дистракторы сложнее", "Сократить формулировку условия"],
};
