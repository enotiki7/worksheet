import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PrototypeControls } from "./components/PrototypeControls";
import { DEFAULT_PAIR, umkForSubject } from "./mock";
import { getScenario, profileForScenario } from "./scenarios";
import { HomeScreen } from "./screens/HomeScreen";
import { buildLessonContent } from "./lessonContent";
import {
  LessonCollectScreen,
  LessonContextScreen,
  LessonPickScreen,
} from "./screens/LessonFlowScreens";
import { LessonEditScreen } from "./screens/LessonEditScreen";
import { LessonGeneratingScreen } from "./screens/LessonGeneratingScreen";
import { LessonWorkspaceScreen } from "./screens/LessonWorkspaceScreen";
import {
  OnboardingPlanStep,
  OnboardingRoleStep,
  OnboardingScheduleStep,
  OnboardingSubjectStep,
} from "./screens/OnboardingScreens";
import { PhoneScreen } from "./screens/PhoneScreen";
import type { LessonContent, LessonDraft, RoleId, ScreenId, TeachingPair, UserProfile } from "./types";

function emptyLesson(): LessonDraft {
  return {
    pairId: "",
    topicId: "",
    topic: "",
    themeId: "",
    insertAfterLessonId: null,
    isCreating: false,
    withoutPlan: false,
  };
}

function nextPairId(pairs: TeachingPair[]) {
  return `pair-${pairs.length + 1}`;
}

export function Prototype() {
  const [params, setParams] = useSearchParams();
  const scenario = getScenario(params.get("scenario"));

  const [screen, setScreen] = useState<ScreenId>("phone");
  const [profile, setProfile] = useState<UserProfile>(() => profileForScenario(scenario));
  const [pairDraft, setPairDraft] = useState<TeachingPair>({ ...DEFAULT_PAIR, id: "draft" });
  const [lesson, setLesson] = useState<LessonDraft>(emptyLesson);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [chatDraft, setChatDraft] = useState("");
  const [collectDraft, setCollectDraft] = useState<TeachingPair>({ ...DEFAULT_PAIR, id: "collect" });

  useEffect(() => {
    const next = profileForScenario(scenario);
    setProfile(next);
    setScreen(scenario === "skipped" ? "home" : scenario === "multi-subject" ? "home" : "phone");
    setLesson(emptyLesson());
    setLessonContent(null);
  }, [scenario]);

  useEffect(() => {
    if (!["lesson-edit", "lesson-generating", "lesson-workspace"].includes(screen) || lessonContent) return;
    const topic = lesson.topic || "Модуль числа";
    const topicId = lesson.topicId || "l2";
    setLessonContent(buildLessonContent(topicId, topic));
    if (!lesson.topic) {
      setLesson((prev) => ({ ...prev, topicId, topic }));
    }
  }, [screen, lessonContent, lesson.topic, lesson.topicId]);

  const activePair = useMemo(
    () => profile.pairs.find((item) => item.id === lesson.pairId) ?? profile.pairs[0],
    [profile.pairs, lesson.pairId],
  );

  const patchProfile = (patch: Partial<UserProfile>) => setProfile((prev) => ({ ...prev, ...patch }));

  const skipOnboarding = () => {
    patchProfile({ skippedOnboarding: true });
    setScreen("home");
  };

  const finishOnboarding = () => {
    patchProfile({ completedSteps: 4 });
    setScreen("home");
  };

  const startPrepareLesson = () => {
    if (profile.pairs.length === 0) {
      setCollectDraft({ ...DEFAULT_PAIR, id: "collect" });
      setScreen("lesson-collect");
      return;
    }
    if (profile.pairs.length > 1) {
      setLesson((prev) => ({ ...prev, pairId: profile.pairs[0].id }));
      setScreen("lesson-context");
      return;
    }
    setLesson((prev) => ({ ...prev, pairId: profile.pairs[0].id }));
    setScreen("lesson-pick");
  };

  const saveCollect = () => {
    const pair = { ...collectDraft, umk: umkForSubject(collectDraft.subject), id: nextPairId(profile.pairs) };
    patchProfile({ pairs: [...profile.pairs, pair] });
    setLesson((prev) => ({ ...prev, pairId: pair.id }));
    setScreen("lesson-pick");
  };

  const openLessonEdit = () => {
    setLessonContent(buildLessonContent(lesson.topicId || "custom", lesson.topic));
    setScreen("lesson-edit");
  };

  const fillGap = (gap: string) => {
    if (gap.includes("роль")) setScreen("onboarding-1");
    else if (gap.includes("предмет")) setScreen("onboarding-2");
    else if (gap.includes("расписание")) setScreen("onboarding-3");
    else setScreen("onboarding-4");
  };

  const setScenario = (value: typeof scenario) => {
    const next = new URLSearchParams(params);
    next.set("scenario", value);
    setParams(next);
  };

  let content = null;

  if (screen === "phone") {
    content = (
      <PhoneScreen
        phone={profile.phone}
        onPhone={(phone) => patchProfile({ phone })}
        onContinue={() => setScreen("onboarding-1")}
      />
    );
  }

  if (screen === "onboarding-1") {
    content = (
      <OnboardingRoleStep
        roles={profile.roles}
        onToggle={(id: RoleId) =>
          patchProfile({
            roles: profile.roles.includes(id) ? profile.roles.filter((item) => item !== id) : [...profile.roles, id],
            completedSteps: Math.max(profile.completedSteps, 1),
          })
        }
        onSkip={skipOnboarding}
        onNext={() => setScreen("onboarding-2")}
      />
    );
  }

  if (screen === "onboarding-2") {
    content = (
      <OnboardingSubjectStep
        draft={pairDraft}
        pairs={profile.pairs}
        onDraft={(patch) => setPairDraft((prev) => ({ ...prev, ...patch }))}
        onAddPair={() => {
          if (!pairDraft.subject || !pairDraft.grade) return;
          patchProfile({
            pairs: [...profile.pairs, { ...pairDraft, umk: umkForSubject(pairDraft.subject), id: nextPairId(profile.pairs) }],
            completedSteps: Math.max(profile.completedSteps, 2),
          });
          setPairDraft({ ...DEFAULT_PAIR, id: "draft" });
        }}
        onRemovePair={(id) => patchProfile({ pairs: profile.pairs.filter((item) => item.id !== id) })}
        onSkip={skipOnboarding}
        onBack={() => setScreen("onboarding-1")}
        onNext={() => setScreen("onboarding-3")}
      />
    );
  }

  if (screen === "onboarding-3") {
    content = (
      <OnboardingScheduleStep
        fileName={profile.scheduleFile}
        onPick={() => patchProfile({ scheduleFile: "raspisanie_9A.xlsx", completedSteps: Math.max(profile.completedSteps, 3) })}
        onSkip={skipOnboarding}
        onBack={() => setScreen("onboarding-2")}
        onNext={() => setScreen("onboarding-4")}
      />
    );
  }

  if (screen === "onboarding-4") {
    content = (
      <OnboardingPlanStep
        fileName={profile.planFile}
        onPick={() => patchProfile({ planFile: "ktp_algebra_9.docx", completedSteps: 4 })}
        onSkip={skipOnboarding}
        onBack={() => setScreen("onboarding-3")}
        onFinish={finishOnboarding}
      />
    );
  }

  if (screen === "home") {
    content = (
      <HomeScreen
        profile={profile}
        chatDraft={chatDraft}
        onChatDraft={setChatDraft}
        onPrepareLesson={startPrepareLesson}
        onFillGap={fillGap}
      />
    );
  }

  if (screen === "lesson-collect") {
    content = (
      <LessonCollectScreen draft={collectDraft} onDraft={(patch) => setCollectDraft((prev) => ({ ...prev, ...patch }))} onSave={saveCollect} onBack={() => setScreen("home")} />
    );
  }

  if (screen === "lesson-context") {
    content = (
      <LessonContextScreen
        pairs={profile.pairs}
        selectedId={lesson.pairId}
        onSelect={(id) => setLesson((prev) => ({ ...prev, pairId: id }))}
        onContinue={() => setScreen("lesson-pick")}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "lesson-pick" && activePair) {
    content = (
      <LessonPickScreen
        profile={profile}
        pair={activePair}
        lesson={lesson}
        onLesson={(patch) => setLesson((prev) => ({ ...prev, ...patch }))}
        onUploadPlan={() => patchProfile({ planFile: "ktp_upload.docx" })}
        onContinue={openLessonEdit}
        onBack={() => setScreen(profile.pairs.length > 1 ? "lesson-context" : "home")}
      />
    );
  }

  if (screen === "lesson-edit" && lessonContent) {
    content = (
      <LessonEditScreen
        topic={lesson.topic}
        content={lessonContent}
        onChange={setLessonContent}
        onBack={() => setScreen("lesson-pick")}
        onGenerate={() => setScreen("lesson-generating")}
      />
    );
  }

  if (screen === "lesson-generating" && lessonContent) {
    content = <LessonGeneratingScreen content={lessonContent} onDone={() => setScreen("lesson-workspace")} />;
  }

  if (screen === "lesson-workspace" && lessonContent) {
    content = (
      <LessonWorkspaceScreen
        topic={lesson.topic}
        content={lessonContent}
        onChange={setLessonContent}
        onBack={() => setScreen("lesson-edit")}
      />
    );
  }

  return (
    <div className="wf-app ta-app">
      <PrototypeControls scenario={scenario} screen={screen} onScenario={setScenario} onScreen={setScreen} />
      {content}
    </div>
  );
}
