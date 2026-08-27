export const TEXT_ANSWER_TYPES = [
  "Линии",
  "Клетка",
  "Блок ответа",
  "Оси",
  "Координатные прямые",
  "Луч",
] as const;

export const CHOICE_ANSWER_TYPES = ["Текст", "Картинка", "Текст + картинка"] as const;

export const COLUMN_TYPES = ["Текст", "Картинка"] as const;

export const ORDER_ANSWER_TYPES = ["Текстовые"] as const;

export type TextAnswerType = (typeof TEXT_ANSWER_TYPES)[number];
export type ChoiceAnswerType = (typeof CHOICE_ANSWER_TYPES)[number];
export type ColumnType = (typeof COLUMN_TYPES)[number];
export type OrderAnswerType = (typeof ORDER_ANSWER_TYPES)[number];

export type ChoiceOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

export type OrderItem = {
  id: string;
  text: string;
};

type TaskBase = {
  id: string;
  pageId: string;
  prompt: string;
  difficulty: 0 | 1 | 2 | 3;
};

export type TextTask = TaskBase & {
  kind: "text";
  answer: string;
  answerType: TextAnswerType;
  blockHeight: number;
};

export type ChoiceTask = TaskBase & {
  kind: "single" | "multi";
  answerType: ChoiceAnswerType;
  options: ChoiceOption[];
};

export type MatchTask = TaskBase & {
  kind: "match";
  leftColumn: ColumnType;
  rightColumn: ColumnType;
  shuffleRight: boolean;
  pairs: MatchPair[];
};

export type OrderTask = TaskBase & {
  kind: "order";
  answerType: OrderAnswerType;
  shuffle: boolean;
  items: OrderItem[];
};

export type Task = TextTask | ChoiceTask | MatchTask | OrderTask;

export type Worksheet = {
  title: string;
  subject: string;
  grade: string;
  showAnswers: boolean;
  showDifficulty: boolean;
  pages: string[];
  tasks: Task[];
};
