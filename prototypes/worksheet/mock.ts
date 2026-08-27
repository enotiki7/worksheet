import type { Scenario } from "./scenarios";
import type { Task, TextTask, Worksheet } from "./types";

export const SUBJECTS = ["Русский язык", "Математика", "История", "Биология"];
export const GRADES = ["5 класс", "6 класс", "7 класс", "8 класс", "9 класс"];

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const generatedText = {
  prompt: "Вставьте пропущенные буквы: пр..красное утро, зам..чательный день.",
  answer: "прекрасное, замечательный",
};

export function createEmptyWorksheet(): Worksheet {
  return {
    title: "Закрепление материала",
    subject: "",
    grade: "",
    showAnswers: false,
    showDifficulty: true,
    pages: ["page-1"],
    tasks: [],
  };
}

export function createGeneratedWorksheet(): Worksheet {
  const task = createTextTask("page-1");
  task.prompt = generatedText.prompt;
  task.answer = generatedText.answer;
  task.difficulty = 1;
  return {
    ...createEmptyWorksheet(),
    subject: "Русский язык",
    grade: "6 класс",
    tasks: [task],
  };
}

export function worksheetForScenario(scenario: Scenario): Worksheet {
  if (scenario === "empty") {
    return {
      ...createEmptyWorksheet(),
      title: "Новый рабочий лист",
    };
  }
  if (scenario === "success") {
    return createGeneratedWorksheet();
  }
  return createEmptyWorksheet();
}

export function createTextTask(pageId: string): TextTask {
  return {
    id: uid(),
    kind: "text",
    pageId,
    prompt: "",
    answer: "",
    difficulty: 0,
    answerType: "Линии",
    blockHeight: 1,
  };
}

export function createChoiceTask(pageId: string, kind: "single" | "multi"): Task {
  return {
    id: uid(),
    kind,
    pageId,
    prompt: "",
    difficulty: 0,
    answerType: "Текст",
    options: Array.from({ length: 4 }, (_, index) => ({
      id: uid(),
      text: "",
      correct: kind === "single" ? index === 0 : index < 2,
    })),
  };
}

export function createMatchTask(pageId: string): Task {
  return {
    id: uid(),
    kind: "match",
    pageId,
    prompt: "",
    difficulty: 0,
    leftColumn: "Текст",
    rightColumn: "Текст",
    shuffleRight: true,
    pairs: Array.from({ length: 3 }, () => ({
      id: uid(),
      left: "",
      right: "",
    })),
  };
}

export function createOrderTask(pageId: string): Task {
  return {
    id: uid(),
    kind: "order",
    pageId,
    prompt: "",
    difficulty: 0,
    answerType: "Текстовые",
    shuffle: false,
    items: Array.from({ length: 5 }, () => ({
      id: uid(),
      text: "",
    })),
  };
}
