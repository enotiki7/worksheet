export type Variant = "wizard" | "library" | "plan";
export type Scenario = "first-use" | "test-task" | "kit-ready";

export type ScreenId =
  | "intent"
  | "library"
  | "planHome"
  | "lessonPick"
  | "basics"
  | "context"
  | "goals"
  | "generatingPlan"
  | "plan"
  | "stageEdit"
  | "kitSelect"
  | "generatingKit"
  | "kit"
  | "material"
  | "readiness"
  | "saveContext"
  | "comingSoon";

export type Audience = "teacher" | "students";
export type MaterialStatus = "queued" | "generating" | "ready" | "excluded";

export type LessonTaskType = "review" | "new" | "practice" | "check";

export type ContextSourceKind =
  | "topic"
  | "grade"
  | "duration"
  | "language"
  | "textbook"
  | "ownGoal"
  | "classNotes"
  | "ownMaterials"
  | "previousLesson"
  | "recommendation";

export type ContextSource = {
  id: string;
  kind: ContextSourceKind;
  label: string;
  detail: string;
  removable: boolean;
};

export type PlannedResult = {
  id: string;
  text: string;
};

export type StageFormat = "frontal" | "pair" | "group" | "individual";

export type Stage = {
  id: string;
  title: string;
  minutes: number;
  teacher: string;
  students: string;
  format: StageFormat;
  activity: string;
  goalIds: string[];
  hasAssignment: boolean;
};

export type KitItem = {
  id: string;
  title: string;
  recommended: boolean;
  audience: Audience;
  stageId: string;
  stageTitle: string;
  format: string;
  purpose: string;
  preview: string[];
};

export type LessonMaterial = KitItem & {
  status: MaterialStatus;
  selected: boolean;
};

export type WorksheetTask = {
  id: string;
  prompt: string;
  support?: string;
  challenge?: boolean;
};

export type WorksheetDraft = {
  title: string;
  studentInstruction: string;
  tasks: WorksheetTask[];
  expectedMinutes: number;
  criteria: string[];
  resultId: string;
  stageId: string;
};

export type ComingSoonKind = "checkWork" | "analyze" | "conduct" | "schedule" | "share";

export type LessonState = {
  subject: string;
  grade: string;
  topic: string;
  duration: number;
  language: string;
  textbook: string;
  classNotes: string;
  ownGoal: string;
  taskTypes: LessonTaskType[];
  ownMaterialNote: string;
  previousLessonNote: string;
  includeOwnMaterials: boolean;
  includePreviousLesson: boolean;
  includeClassNotes: boolean;
  excludedSourceIds: string[];
  lessonGoal: string;
  plannedResults: PlannedResult[];
  keyContent: string[];
  priorKnowledge: string[];
  difficulties: string[];
  assessment: string;
  recommendation: string;
  recommendationAccepted: boolean;
  stages: Stage[];
  planApproved: boolean;
  editingStageId: string | null;
  materials: LessonMaterial[];
  worksheet: WorksheetDraft;
  worksheetDirty: boolean;
  resultChanged: boolean;
  kitSaved: boolean;
  contextSaved: boolean;
};

export type ThematicLesson = {
  id: string;
  number: number;
  topic: string;
  hours: number;
  status: "done" | "next" | "planned";
};

export type ThematicPlan = {
  id: string;
  subject: string;
  grade: string;
  title: string;
  hours: number;
  lessons: ThematicLesson[];
};

export type LibraryCard = {
  id: string;
  title: string;
  type: string;
  subject: string;
  grade: string;
  updated: string;
};
