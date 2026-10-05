import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PrototypeControls } from "./components/PrototypeControls";
import { DEFAULT_PAIR, libraryForPair, umkForSubject, isOtherSubject, planForPick, type ThematicPlan } from "./mock";
import { clonePlan } from "./planMutations";
import {
  attachPointForScenario,
  getScenario,
  isMaterialsScenario,
  isNextLessonScenario,
  profileForScenario,
} from "./scenarios";
import { HomeScreen } from "./screens/HomeScreen";
import { buildLessonContent } from "./lessonContent";
import { LessonContextScreen, LessonPickScreen } from "./screens/LessonFlowScreens";
import { LessonEditScreen } from "./screens/LessonEditScreen";
import { LessonGeneratingScreen } from "./screens/LessonGeneratingScreen";
import { LessonWorkspaceScreen } from "./screens/LessonWorkspaceScreen";
import { OnboardingRoleStep, OnboardingSubjectStep } from "./screens/OnboardingScreens";
import { PhoneScreen } from "./screens/PhoneScreen";
import type { LessonContent, LessonDraft, RoleId, ScreenId, TeachingPair, UserProfile } from "./types";

const SCREEN_IDS: ScreenId[] = [
  "phone",
  "onboarding-1",
  "onboarding-2",
  "onboarding-3",
  "onboarding-4",
  "home",
  "lesson-collect",
  "lesson-context",
  "lesson-pick",
  "lesson-edit",
  "lesson-generating",
  "lesson-workspace",
];

function normalizeScreen(value: ScreenId): ScreenId {
  if (value === "onboarding-3" || value === "onboarding-4") return "home";
  if (value === "lesson-collect") return "lesson-pick";
  return value;
}

function screenFromParams(value: string | null): ScreenId | null {
  if (value && SCREEN_IDS.includes(value as ScreenId)) return normalizeScreen(value as ScreenId);
  return null;
}

function defaultScreenForScenario(scenario: ReturnType<typeof getScenario>): ScreenId {
  if (scenario === "skipped" || scenario === "multi-subject" || isMaterialsScenario(scenario) || isNextLessonScenario(scenario)) {
    return "home";
  }
  return "phone";
}

function initialScreen(
  scenario: ReturnType<typeof getScenario>,
  screenParam: string | null,
  figmaCapture: boolean,
): ScreenId {
  if ((isMaterialsScenario(scenario) || isNextLessonScenario(scenario)) && !figmaCapture) return "home";
  return screenFromParams(screenParam) ?? defaultScreenForScenario(scenario);
}

function emptyLesson(): LessonDraft {
  return {
    pairId: "",
    topicId: "",
    topic: "",
    themeId: "",
    insertAfterLessonId: null,
    isCreating: false,
    withoutPlan: false,
    attachedLibraryIds: [],
    lessonType: "newTopic",
  };
}

function nextPairId(pairs: TeachingPair[]) {
  return `pair-${pairs.length + 1}`;
}

export function Prototype() {
  const [params, setParams] = useSearchParams();
  const scenario = getScenario(params.get("scenario"));
  const figmaCapture = params.get("figma") === "1";

  const [screen, setScreen] = useState<ScreenId>(() => initialScreen(scenario, params.get("screen"), figmaCapture));
  const [profile, setProfile] = useState<UserProfile>(() => profileForScenario(scenario));
  const [pairDraft, setPairDraft] = useState<TeachingPair>({ ...DEFAULT_PAIR, id: "draft" });
  const [lesson, setLesson] = useState<LessonDraft>(emptyLesson);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [chatDraft, setChatDraft] = useState("");
  const [pickDraft, setPickDraft] = useState<TeachingPair>({ id: "pick", subject: "", grade: "", umk: "" });
  const [planCache, setPlanCache] = useState<Record<string, ThematicPlan>>({});

  useEffect(() => {
    const next = profileForScenario(scenario);
    setProfile(next);
    setLesson(emptyLesson());
    setLessonContent(null);
    setPlanCache({});
    setScreen(initialScreen(scenario, params.get("screen"), figmaCapture));
  }, [scenario, figmaCapture]);

  const planKey =
    pickDraft.subject && pickDraft.grade && !isOtherSubject(pickDraft.subject)
      ? `${scenario}:${pickDraft.subject}:${pickDraft.grade}`
      : null;

  const activePlan = planKey ? planCache[planKey] : undefined;

  useEffect(() => {
    if (!planKey) return;
    setPlanCache((prev) => {
      if (prev[planKey]) return prev;
      const base = planForPick(scenario, pickDraft);
      if (!base) return prev;
      return { ...prev, [planKey]: clonePlan(base) };
    });
  }, [planKey, scenario, pickDraft.subject, pickDraft.grade]);

  useEffect(() => {
    if (!figmaCapture) return;

    const needsSeed = ["home", "lesson-pick", "lesson-edit", "lesson-generating", "lesson-workspace"].includes(screen);
    if (!needsSeed || profile.pairs.length > 0) return;

    if (scenario === "full-onboarding") {
      setProfile({
        phone: "+7 903 555-12-34",
        roles: ["subject"],
        pairs: [{ ...DEFAULT_PAIR, id: "pair-1" }],
        scheduleFile: null,
        planFile: null,
        skippedOnboarding: false,
        completedSteps: 2,
      });
      setPickDraft({ id: "pick", subject: DEFAULT_PAIR.subject, grade: DEFAULT_PAIR.grade, umk: DEFAULT_PAIR.umk });
      setLesson((prev) => ({
        ...prev,
        pairId: "pair-1",
        topicId: "l2",
        topic: "Иррациональные числа. Множество действительных чисел",
        themeId: "t1",
        isCreating: false,
        withoutPlan: false,
        attachedLibraryIds: [],
      }));
      return;
    }

    if (!isMaterialsScenario(scenario)) return;

    const point = attachPointForScenario(scenario);
    setProfile((prev) => ({
      ...prev,
      pairs: [{ ...DEFAULT_PAIR, id: "pair-1" }],
    }));
    setPickDraft({ id: "pick", subject: DEFAULT_PAIR.subject, grade: DEFAULT_PAIR.grade, umk: DEFAULT_PAIR.umk });
    setLesson((prev) => ({
      ...prev,
      pairId: "pair-1",
      topicId: "l2",
      topic: "Иррациональные числа. Множество действительных чисел",
      attachedLibraryIds:
        point === "pick"
          ? ["lib-pres-1", "lib-sheet-1"]
          : point === "edit"
            ? ["lib-task-1", "lib-sheet-1"]
            : prev.attachedLibraryIds,
    }));
  }, [figmaCapture, scenario, screen, profile.pairs.length]);

  useEffect(() => {
    if (!isNextLessonScenario(scenario) || screen !== "lesson-pick") return;
    setPickDraft({ id: "pick", subject: DEFAULT_PAIR.subject, grade: DEFAULT_PAIR.grade, umk: DEFAULT_PAIR.umk });
    setLesson((prev) => {
      if (prev.topicId) return prev;
      return {
        ...prev,
        pairId: "pair-1",
        topicId: "l2",
        topic: "Иррациональные числа. Множество действительных чисел",
        themeId: "t1",
        isCreating: false,
        withoutPlan: false,
      };
    });
  }, [scenario, screen]);

  useEffect(() => {
    if (!figmaCapture || !isMaterialsScenario(scenario) || screen !== "lesson-pick") return;
    setPickDraft({ id: "pick", subject: DEFAULT_PAIR.subject, grade: DEFAULT_PAIR.grade, umk: DEFAULT_PAIR.umk });
  }, [figmaCapture, scenario, screen]);

  useEffect(() => {
    if (!["lesson-pick", "lesson-edit", "lesson-generating", "lesson-workspace", "lesson-context"].includes(screen)) {
      return;
    }
    const pairId = profile.pairs[0]?.id ?? "";
    setLesson((prev) => {
      const next = { ...prev, pairId: prev.pairId || pairId };
      if (screen !== "lesson-pick") {
        next.topicId = prev.topicId || "l2";
        next.topic = prev.topic || "Иррациональные числа. Множество действительных чисел";
        next.withoutPlan = false;
      }
      return next;
    });
  }, [screen, profile.pairs]);

  useEffect(() => {
    if (!["lesson-edit", "lesson-generating", "lesson-workspace"].includes(screen) || lessonContent) return;
    const topic = lesson.topic || "Иррациональные числа. Множество действительных чисел";
    const topicId = lesson.topicId || "l2";
    setLessonContent(buildLessonContent(topicId, topic));
    if (!lesson.topic) {
      setLesson((prev) => ({ ...prev, topicId, topic }));
    }
  }, [screen, lessonContent, lesson.topic, lesson.topicId]);

  const attachPoint = attachPointForScenario(scenario);

  const libraryMaterials = useMemo(() => {
    if (!pickDraft.subject || !pickDraft.grade || isOtherSubject(pickDraft.subject)) return [];
    return libraryForPair(pickDraft.subject, pickDraft.grade);
  }, [pickDraft.subject, pickDraft.grade]);

  const setActivePlan = (plan: ThematicPlan) => {
    if (!planKey) return;
    setPlanCache((prev) => ({ ...prev, [planKey]: plan }));
  };

  const toggleLibraryMaterial = (id: string) => {
    setLesson((prev) => ({
      ...prev,
      attachedLibraryIds: prev.attachedLibraryIds.includes(id)
        ? prev.attachedLibraryIds.filter((item) => item !== id)
        : [...prev.attachedLibraryIds, id],
    }));
  };

  const patchProfile = (patch: Partial<UserProfile>) => setProfile((prev) => ({ ...prev, ...patch }));

  const skipOnboarding = () => {
    patchProfile({ skippedOnboarding: true });
    setScreen("home");
  };

  const finishOnboarding = () => {
    patchProfile({ completedSteps: 2 });
    setScreen("home");
  };

  const openLessonPick = (initial?: TeachingPair) => {
    const pair = initial ?? profile.pairs[0];
    setPickDraft(
      pair
        ? { id: "pick", subject: pair.subject, grade: pair.grade, umk: pair.umk }
        : { id: "pick", subject: "", grade: "", umk: "" },
    );
    if (pair) setLesson((prev) => ({ ...prev, pairId: pair.id }));
    setScreen("lesson-pick");
  };

  const startPrepareLesson = () => {
    if (profile.pairs.length > 1) {
      setLesson((prev) => ({ ...prev, pairId: profile.pairs[0].id }));
      setScreen("lesson-context");
      return;
    }
    openLessonPick(profile.pairs[0]);
  };

  const handlePickDraft = (patch: Partial<TeachingPair>) => {
    setPickDraft((prev) => ({ ...prev, ...patch }));
    if (patch.subject !== undefined || patch.grade !== undefined) {
      setLesson((prev) => ({
        ...emptyLesson(),
        pairId: prev.pairId,
        lessonType: prev.lessonType,
      }));
    }
  };

  const continueFromPick = () => {
    if (pickDraft.subject && pickDraft.grade) {
      const exists = profile.pairs.some((item) => item.subject === pickDraft.subject && item.grade === pickDraft.grade);
      if (!exists) {
        const pair = {
          ...pickDraft,
          umk: umkForSubject(pickDraft.subject),
          id: nextPairId(profile.pairs),
        };
        patchProfile({ pairs: [...profile.pairs, pair] });
        setLesson((prev) => ({ ...prev, pairId: pair.id }));
      }
    }
    openLessonEdit();
  };

  const openLessonEdit = () => {
    setLessonContent(buildLessonContent(lesson.topicId || "custom", lesson.topic));
    setScreen("lesson-edit");
  };

  const prepareAnotherLesson = () => {
    const pairId = lesson.pairId || profile.pairs[0]?.id || "";
    setLesson({ ...emptyLesson(), pairId });
    setLessonContent(null);
    setScreen("lesson-pick");
  };

  const fillGap = (gap: string) => {
    if (gap.includes("роль")) setScreen("onboarding-1");
    else setScreen("onboarding-2");
  };

  const setScenario = (value: typeof scenario) => {
    const next = new URLSearchParams(params);
    next.set("scenario", value);
    next.set("screen", defaultScreenForScenario(value));
    setParams(next);
  };

  const setScreenParam = (value: ScreenId) => {
    setScreen(value);
    const next = new URLSearchParams(params);
    next.set("screen", value);
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
        onNext={finishOnboarding}
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

  if (screen === "lesson-context") {
    content = (
      <LessonContextScreen
        pairs={profile.pairs}
        selectedId={lesson.pairId}
        onSelect={(id) => setLesson((prev) => ({ ...prev, pairId: id }))}
        onContinue={() => {
          const pair = profile.pairs.find((item) => item.id === lesson.pairId) ?? profile.pairs[0];
          openLessonPick(pair);
        }}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "lesson-pick") {
    content = (
      <LessonPickScreen
        profile={profile}
        draft={pickDraft}
        onDraft={handlePickDraft}
        plan={activePlan}
        onPlanChange={setActivePlan}
        lesson={lesson}
        onLesson={(patch) => setLesson((prev) => ({ ...prev, ...patch }))}
        onUploadPlan={() => patchProfile({ planFile: "tematicheskiy_plan.docx" })}
        onContinue={continueFromPick}
        onBack={() => (profile.pairs.length > 1 ? setScreen("lesson-context") : setScreen("home"))}
        libraryMaterials={libraryMaterials}
        showLibraryAttach={attachPoint === "pick"}
        onToggleLibrary={toggleLibraryMaterial}
      />
    );
  }

  if (screen === "lesson-edit" && lessonContent) {
    content = (
      <LessonEditScreen
        topic={lesson.topic}
        content={lessonContent}
        lessonType={lesson.lessonType}
        onLessonType={(lessonType) => setLesson((prev) => ({ ...prev, lessonType }))}
        onChange={setLessonContent}
        onBack={() => setScreen("lesson-pick")}
        onGeneratePlan={() => undefined}
        onGenerateMaterials={() => setScreen("lesson-generating")}
        libraryMaterials={libraryMaterials}
        attachedLibraryIds={lesson.attachedLibraryIds}
        showLibraryAttach={attachPoint === "edit"}
        onToggleLibrary={toggleLibraryMaterial}
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
        onPrepareAnother={prepareAnotherLesson}
        onScheduleLesson={() => setScreen("home")}
        libraryMaterials={libraryMaterials}
        attachedLibraryIds={lesson.attachedLibraryIds}
      />
    );
  }

  return (
    <div className="wf-app ta-app">
      {figmaCapture ? null : (
        <PrototypeControls scenario={scenario} screen={screen} onScenario={setScenario} onScreen={setScreenParam} />
      )}
      {content}
    </div>
  );
}
