export type Variant = "full" | "steps" | "tabs" | "stack" | "rail";
export type ScreenId = "intent" | "entry" | "prep" | "generating" | "result";
export type EntryTab = "params" | "extra" | "lesson";
export type MaterialKind = "presentation" | "tasks" | "outline" | "worksheet";
export type SuggestId = "group" | "weak" | "challenge";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type OwnFile = {
  id: string;
  name: string;
};

export type LessonStage = {
  id: string;
  title: string;
  minutes: number;
  text: string;
};

export type PlannedResults = {
  subject: string;
  personal: string;
  meta: string;
};

export type LessonContent = {
  goal: string;
  tasks: string;
  results: PlannedResults;
  keywords: string;
  challenge: string;
  stages: LessonStage[];
};

export type ThematicLesson = {
  id: string;
  number: number;
  topic: string;
  content: LessonContent;
};

export type ThematicPlan = {
  id: string;
  title: string;
  lessons: ThematicLesson[];
};

export type EntryState = {
  subject: string;
  grade: string;
  duration: number;
  planId: string;
  textbook: string;
  classNotes: string;
  ownFiles: OwnFile[];
  lessonId: string;
};

export type Draft = {
  lessonId: string;
  goal: string | null;
  tasks: string | null;
  results: PlannedResults | null;
  keywords: string | null;
  stages: LessonStage[] | null;
  groupApplied: boolean;
  weakApplied: boolean;
  challengeApplied: boolean;
  selectedMaterials: MaterialKind[];
};

export type GeneratedMaterial = {
  kind: MaterialKind;
  title: string;
  lines: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
