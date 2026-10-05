import type { LessonContent, LessonType, MaterialId } from "./types";

export const LESSON_TYPES: { id: LessonType; label: string }[] = [
  { id: "newTopic", label: "Новая тема" },
  { id: "motivation", label: "Мотивация" },
  { id: "practice", label: "Практика" },
  { id: "independent", label: "Самостоятельная работа" },
  { id: "control", label: "Контрольная работа" },
];

export type LessonPreview = {
  goals: string[];
  tasks: string[];
  results: { label: string; items: string[] }[];
};

export const LESSON_PREVIEWS: Record<string, LessonPreview> = {
  l1: {
    goals: [
      "Понять различие между конечными и бесконечными десятичными дробями.",
      "Научиться записывать рациональные числа в виде обыкновенных и десятичных дробей.",
    ],
    tasks: [
      "Актуализировать понятие рационального числа.",
      "Отработать перевод дробей в десятичный вид и обратно.",
    ],
    results: [
      {
        label: "Предметные",
        items: [
          "Знать определение рационального числа.",
          "Уметь различать конечные и бесконечные периодические десятичные дроби.",
        ],
      },
    ],
  },
  l2: {
    goals: [
      "Познакомиться с понятием иррационального числа.",
      "Сформировать представление о множестве действительных чисел.",
    ],
    tasks: [
      "Привести примеры иррациональных чисел.",
      "Показать действительные числа на координатной прямой.",
    ],
    results: [
      {
        label: "Предметные",
        items: [
          "Знать определение иррационального числа.",
          "Понимать, что множество действительных чисел объединяет рациональные и иррациональные числа.",
        ],
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
    trainer: false,
    quiz: false,
  };
}

export function regenerateLessonPlan(content: LessonContent, topic: string): LessonContent {
  const timings = [5, 8, 15, 12, 8, 2];
  return {
    ...content,
    steps: content.steps.map((step, index) => ({
      ...step,
      minutes: timings[index] ?? step.minutes,
      goal: `${step.goal.replace(/ \(обновлено\)$/u, "")} (обновлено)`,
      title: index === 2 ? `Открытие нового знания · ${topic}` : step.title,
    })),
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

export type MaterialOption = {
  id: MaterialId;
  label: string;
  metaLabel?: string;
};

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "presentation", label: "Презентация к уроку", metaLabel: "12 слайдов" },
  { id: "infographic", label: "Инфографика" },
  { id: "motivation", label: "Мотивирующее задание" },
  { id: "classWork", label: "Задание для классной работы", metaLabel: "5 заданий" },
  { id: "homework", label: "Задание для домашней работы", metaLabel: "3 задания" },
  { id: "worksheet", label: "Рабочий лист", metaLabel: "6 заданий" },
  { id: "trainer", label: "Тренажёр", metaLabel: "10 заданий" },
  { id: "quiz", label: "Викторина", metaLabel: "8 заданий" },
];

export const MATERIAL_LABELS = MATERIAL_OPTIONS.map(({ id, label }) => ({ id, label }));

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
