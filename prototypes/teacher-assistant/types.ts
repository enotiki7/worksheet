export type ScreenId =
  | "phone"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "onboarding-4"
  | "home"
  | "lesson-collect"
  | "lesson-context"
  | "lesson-pick"
  | "lesson-edit"
  | "lesson-generating"
  | "lesson-workspace";

export type RoleId = "subject" | "classTeacher" | "tutor";

export type TeachingPair = {
  id: string;
  subject: string;
  grade: string;
  umk: string;
};

export type UserProfile = {
  phone: string;
  roles: RoleId[];
  pairs: TeachingPair[];
  scheduleFile: string | null;
  planFile: string | null;
  skippedOnboarding: boolean;
  completedSteps: number;
};

export type LessonType = "newTopic" | "practice" | "independent" | "control";

export type LessonDraft = {
  pairId: string;
  topicId: string;
  topic: string;
  themeId: string;
  insertAfterLessonId: string | null;
  isCreating: boolean;
  withoutPlan: boolean;
  attachedLibraryIds: string[];
  lessonType: LessonType;
};

export type LibraryMaterialType = "presentation" | "worksheet" | "task" | "infographic";

export type LibraryMaterial = {
  id: string;
  type: LibraryMaterialType;
  title: string;
  subject: string;
  grade: string;
  updatedAt: string;
};

export type Scenario =
  | "full-onboarding"
  | "skipped"
  | "multi-subject"
  | "materials-at-pick"
  | "materials-at-edit"
  | "next-lesson";

export type MaterialAttachPoint = "pick" | "edit";

export type MaterialId =
  | "presentation"
  | "infographic"
  | "motivation"
  | "classWork"
  | "homework"
  | "worksheet";

export type LessonStep = {
  id: string;
  title: string;
  minutes: number;
  goal: string;
};

export type LessonContent = {
  goals: string[];
  tasks: string[];
  results: { label: string; items: string[] }[];
  steps: LessonStep[];
  reflection: string[];
  homework: { level: string; text: string }[];
  materials: Record<MaterialId, boolean>;
};

export type WorkspaceTab = "plan" | "presentation" | "tasks";
