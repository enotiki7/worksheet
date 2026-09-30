import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { AiPanel } from "./components/AiPanel";
import { LinkedUpdateDialog } from "./components/LinkedUpdateDialog";
import { PrototypeControls } from "./components/PrototypeControls";
import {
  DEFAULT_STAGES,
  NEXT_LESSON_TOPIC,
  TEST_LESSON,
  emptyLesson,
  kitReadyLesson,
  prefilledBasics,
} from "./mock";
import { ContextStep } from "./screens/ContextStep";
import { GoalsStep } from "./screens/GoalsStep";
import { GeneratorPicker, IntentHome } from "./screens/IntentHome";
import { GeneratingKit, KitSelect, LessonKit } from "./screens/KitScreens";
import { LessonBasics } from "./screens/LessonBasics";
import { LessonPick } from "./screens/LessonPick";
import { LibraryHome } from "./screens/LibraryHome";
import { MaterialEditor } from "./screens/MaterialEditor";
import { PlanHome } from "./screens/PlanHome";
import { GeneratingPlan, PlanDraft } from "./screens/PlanDraft";
import { ComingSoon, Readiness, SaveContext } from "./screens/Readiness";
import { StageEditor } from "./screens/StageEditor";
import { getScenario, getVariant } from "./scenarios";
import type { LessonState, Scenario, ScreenId, Stage, Variant } from "./types";

const PANEL_SCREENS: ScreenId[] = [
  "context",
  "goals",
  "generatingPlan",
  "plan",
  "stageEdit",
  "kitSelect",
  "generatingKit",
  "kit",
  "material",
  "readiness",
];

function homeScreen(variant: Variant): ScreenId {
  if (variant === "library") return "library";
  if (variant === "plan") return "planHome";
  return "intent";
}

function lessonForScenario(scenario: Scenario): LessonState {
  if (scenario === "kit-ready") return kitReadyLesson();
  if (scenario === "test-task") return prefilledBasics();
  return emptyLesson();
}

export function Prototype() {
  const [params, setParams] = useSearchParams();
  const variant = getVariant(params.get("variant"));
  const scenario = getScenario(params.get("scenario"));

  const [screen, setScreen] = useState<ScreenId>(() => (scenario === "kit-ready" ? "kit" : homeScreen(variant)));
  const [lesson, setLesson] = useState<LessonState>(() => lessonForScenario(scenario));
  const [toast, setToast] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [comingSoonTitle, setComingSoonTitle] = useState("Следующий этап");
  const [linkedOpen, setLinkedOpen] = useState(false);
  const [activeMaterialId, setActiveMaterialId] = useState("m-worksheet");
  const [createdCount, setCreatedCount] = useState(0);
  const [pickGenerator, setPickGenerator] = useState(false);
  const [returnScreen, setReturnScreen] = useState<ScreenId>("intent");

  const patch = (next: Partial<LessonState>) => setLesson((prev) => ({ ...prev, ...next }));

  useEffect(() => {
    setLesson(lessonForScenario(scenario));
    setPickGenerator(false);
    setCreatedCount(scenario === "kit-ready" ? 3 : 0);
    setActiveMaterialId("m-worksheet");
    setScreen(scenario === "kit-ready" ? "kit" : homeScreen(variant));
  }, [variant, scenario]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showPanel = PANEL_SCREENS.includes(screen);
  const editingStage = useMemo(
    () => lesson.stages.find((item) => item.id === lesson.editingStageId) ?? lesson.stages[0],
    [lesson.editingStageId, lesson.stages],
  );

  const setVariant = (value: Variant) => {
    const next = new URLSearchParams(params);
    next.set("variant", value);
    setParams(next);
  };

  const setScenario = (value: Scenario) => {
    const next = new URLSearchParams(params);
    next.set("scenario", value);
    setParams(next);
  };

  const excludeSource = (id: string) => {
    patch({
      excludedSourceIds: lesson.excludedSourceIds.includes(id)
        ? lesson.excludedSourceIds
        : [...lesson.excludedSourceIds, id],
    });
  };

  const startPlanGeneration = () => {
    setScreen("generatingPlan");
    window.setTimeout(() => setScreen("plan"), 650);
  };

  const startKitGeneration = () => {
    const selectedIds = lesson.materials.filter((item) => item.selected).map((item) => item.id);
    setLesson((prev) => ({
      ...prev,
      materials: prev.materials.map((item) => (item.selected ? { ...item, status: "queued" } : item)),
    }));
    setScreen("generatingKit");
    selectedIds.forEach((id, index) => {
      window.setTimeout(() => {
        setLesson((prev) => ({
          ...prev,
          materials: prev.materials.map((item) => {
            if (item.id === id) return { ...item, status: "generating" };
            if (index > 0 && item.id === selectedIds[index - 1]) return { ...item, status: "ready" };
            return item;
          }),
        }));
      }, 280 * index + 180);
    });
    window.setTimeout(() => {
      setLesson((prev) => ({
        ...prev,
        materials: prev.materials.map((item) => (item.selected ? { ...item, status: "ready" } : item)),
      }));
      setScreen("kit");
    }, 280 * selectedIds.length + 520);
  };

  const moveStage = (id: string, dir: -1 | 1) => {
    setLesson((prev) => {
      const index = prev.stages.findIndex((item) => item.id === id);
      const nextIndex = index + dir;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.stages.length) return prev;
      const stages = [...prev.stages];
      const [removed] = stages.splice(index, 1);
      stages.splice(nextIndex, 0, removed);
      return { ...prev, stages };
    });
  };

  const updateStage = (stage: Stage) => {
    setLesson((prev) => ({
      ...prev,
      stages: prev.stages.map((item) => (item.id === stage.id ? stage : item)),
    }));
  };

  const applyStageAi = (actionId: string) => {
    const stage = editingStage;
    if (!stage) return;
    if (actionId === "practical") {
      updateStage({
        ...stage,
        activity: "Практическое решение уравнений на карточках",
        teacher: "Организует решение у доски и проверку корня.",
        students: "Решают уравнения и проверяют ответ подстановкой.",
      });
    } else if (actionId === "shorten7") {
      updateStage({ ...stage, minutes: 7 });
    } else if (actionId === "group") {
      updateStage({
        ...stage,
        format: "group",
        activity: "Групповая работа",
        students: "В группах составляют уравнение и проверяют корень.",
        minutes: stage.minutes + 2,
      });
    } else if (actionId === "weak") {
      updateStage({
        ...stage,
        teacher: `${stage.teacher} Дает карточки-опоры и упрощенные формулировки.`,
        students: `${stage.students} Пользуются опорным конспектом.`,
      });
    } else if (actionId === "noDevices") {
      updateStage({
        ...stage,
        activity: "Вариант без устройств: печатная схема и доска",
      });
    } else if (actionId === "challenge") {
      updateStage({
        ...stage,
        hasAssignment: true,
        activity: `${stage.activity}. Задание повышенной сложности для справившихся.`,
      });
    }
    setToast("Этап доработан AI. Остальной план не пересобирался.");
  };

  const fixOverflow = () => {
    setLesson((prev) => ({
      ...prev,
      stages: prev.stages.map((item) => {
        if (item.id === "s4") return { ...item, minutes: Math.max(1, item.minutes - 2) };
        if (item.id === "s5") return { ...item, minutes: Math.max(1, item.minutes - 2) };
        return item;
      }),
    }));
  };

  const openComingSoon = (title: string, back: ScreenId) => {
    setComingSoonTitle(title);
    setReturnScreen(back);
    setScreen("comingSoon");
  };

  const handleGenerator = (id: string, from: ScreenId) => {
    setPickGenerator(false);
    if (id === "plan") {
      setScreen(from === "library" ? "basics" : "lessonPick");
      return;
    }
    setCreatedCount((value) => value + 1);
    if (id === "worksheet") {
      setActiveMaterialId("m-worksheet");
      setLesson((prev) => ({
        ...prev,
        materials: prev.materials.map((item) =>
          item.id === "m-worksheet" ? { ...item, selected: true, status: "ready" } : item,
        ),
      }));
      setReturnScreen(from);
      setScreen("material");
      return;
    }
    setToast(`Черновик «${id === "presentation" ? "Презентация" : "Материал"}» создан отдельно от плана.`);
  };

  const collectIntoLesson = () => {
    const ready = kitReadyLesson();
    setLesson({ ...ready, planApproved: false });
    setScreen("kit");
    setToast("Материалы собраны в карточку урока без утверждения плана.");
  };

  const prepareFromPlan = () => {
    setLesson({
      ...prefilledBasics(),
      includePreviousLesson: true,
      includeClassNotes: true,
      previousLessonNote: TEST_LESSON.previousLessonNote,
      classNotes: TEST_LESSON.classNotes,
    });
    setScreen("basics");
  };

  const saveWorksheet = () => {
    const afterSave = variant === "library" && returnScreen === "library" ? "library" : "kit";
    if (lesson.resultChanged) {
      setLinkedOpen(true);
      return;
    }
    setToast("Рабочий лист обновлен. Изменение не влияет на остальные материалы.");
    setScreen(afterSave);
  };

  let body: ReactNode = null;
  if (pickGenerator) {
    body = (
      <GeneratorPicker
        onPick={(id) => handleGenerator(id, screen === "library" ? "library" : "intent")}
        onBack={() => setPickGenerator(false)}
      />
    );
  } else if (screen === "intent") {
    body = (
      <IntentHome
        onPrepare={() => setScreen("lessonPick")}
        onOpenGenerators={() => setPickGenerator(true)}
        onLater={(kind) => openComingSoon(kind === "checkWork" ? "Проверка работ" : "Анализ урока", "intent")}
      />
    );
  } else if (screen === "library") {
    body = (
      <LibraryHome
        createdCount={createdCount}
        onCreate={(id) => handleGenerator(id, "library")}
        onCollectLesson={collectIntoLesson}
      />
    );
  } else if (screen === "planHome") {
    body = <PlanHome onPrepareLesson={prepareFromPlan} />;
  } else if (screen === "lessonPick") {
    body = (
      <LessonPick
        lesson={lesson}
        onSelect={patch}
        onContinue={() => setScreen("basics")}
        onBack={() => setScreen(homeScreen(variant))}
      />
    );
  } else if (screen === "basics") {
    body = (
      <LessonBasics
        lesson={lesson}
        onChange={patch}
        onContinue={() => {
          patch({
            includeClassNotes: Boolean(lesson.classNotes),
            includeOwnMaterials: Boolean(lesson.ownMaterialNote),
          });
          setScreen("context");
        }}
        onBack={() => setScreen(variant === "plan" ? "planHome" : "lessonPick")}
      />
    );
  } else if (screen === "context") {
    body = (
      <ContextStep
        lesson={lesson}
        onChange={patch}
        onExclude={excludeSource}
        onContinue={() => setScreen("goals")}
        onSkip={() => {
          patch({ includeOwnMaterials: false, includePreviousLesson: false, includeClassNotes: false });
          setScreen("goals");
        }}
        onBack={() => setScreen("basics")}
      />
    );
  } else if (screen === "goals") {
    body = (
      <GoalsStep lesson={lesson} onChange={patch} onGenerate={startPlanGeneration} onBack={() => setScreen("context")} />
    );
  } else if (screen === "generatingPlan") {
    body = <GeneratingPlan lesson={lesson} />;
  } else if (screen === "plan") {
    body = (
      <PlanDraft
        lesson={lesson}
        onEditStage={(id) => {
          patch({ editingStageId: id });
          setScreen("stageEdit");
        }}
        onApprove={() => {
          patch({ planApproved: true });
          setScreen("kitSelect");
        }}
        onBack={() => setScreen("goals")}
        onMove={moveStage}
        onDelete={(id) => patch({ stages: lesson.stages.filter((item) => item.id !== id) })}
        onFixOverflow={fixOverflow}
        onAddStage={() => {
          const extra: Stage = {
            id: `s-${lesson.stages.length + 1}`,
            title: "Свой этап",
            minutes: 5,
            teacher: "Организует этап.",
            students: "Выполняют задание учителя.",
            format: "frontal",
            activity: "Авторский этап",
            goalIds: [],
            hasAssignment: false,
          };
          patch({ stages: [...lesson.stages, extra], editingStageId: extra.id });
          setScreen("stageEdit");
        }}
      />
    );
  } else if (screen === "stageEdit" && editingStage) {
    body = (
      <StageEditor
        lesson={lesson}
        stage={editingStage}
        onChange={updateStage}
        onAiAction={applyStageAi}
        onClose={() => setScreen("plan")}
      />
    );
  } else if (screen === "kitSelect") {
    body = (
      <KitSelect
        lesson={lesson}
        onToggle={(id) =>
          patch({
            materials: lesson.materials.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
          })
        }
        onCreate={startKitGeneration}
        onBack={() => setScreen("plan")}
      />
    );
  } else if (screen === "generatingKit") {
    body = <GeneratingKit lesson={lesson} />;
  } else if (screen === "kit") {
    body = (
      <LessonKit
        lesson={lesson}
        onOpen={(id) => {
          setActiveMaterialId(id);
          setReturnScreen("kit");
          setScreen("material");
        }}
        onExclude={(id) =>
          patch({
            materials: lesson.materials.map((item) =>
              item.id === id ? { ...item, selected: false, status: "excluded" } : item,
            ),
          })
        }
        onReadiness={() => setScreen("readiness")}
        onToast={setToast}
      />
    );
  } else if (screen === "material") {
    body = (
      <MaterialEditor
        lesson={lesson}
        materialId={activeMaterialId}
        onWorksheetChange={(next) => {
          const { resultChanged, ...worksheetPatch } = next;
          setLesson((prev) => ({
            ...prev,
            worksheet: { ...prev.worksheet, ...worksheetPatch },
            worksheetDirty: true,
            resultChanged: resultChanged ?? prev.resultChanged,
          }));
        }}
        onSave={saveWorksheet}
        onBack={() => setScreen(returnScreen === "library" && variant === "library" ? "library" : "kit")}
        backLabel={returnScreen === "library" && variant === "library" ? "К библиотеке" : "К комплекту"}
      />
    );
  } else if (screen === "readiness") {
    body = (
      <Readiness
        lesson={lesson}
        onDownload={() => setToast("Комплект подготовлен к скачиванию (макет).")}
        onConduct={() => openComingSoon("Режим проведения", "readiness")}
        onShare={() => openComingSoon("Поделиться уроком", "readiness")}
        onFinish={() => {
          patch({ kitSaved: true });
          setScreen("saveContext");
        }}
        onBack={() => setScreen("kit")}
      />
    );
  } else if (screen === "saveContext") {
    body = (
      <SaveContext
        lesson={lesson}
        onSave={() => {
          patch({ contextSaved: true });
          setToast(`${lesson.subject}, ${lesson.grade} и учебник сохранены для следующих уроков.`);
          setScreen(homeScreen(variant));
        }}
        onNextLesson={() => {
          patch({
            topic: NEXT_LESSON_TOPIC,
            planApproved: false,
            stages: DEFAULT_STAGES.map((item) => ({ ...item })),
          });
          setScreen("basics");
        }}
        onSchedule={() => openComingSoon("Добавление расписания", "saveContext")}
        onSkip={() => setScreen(homeScreen(variant))}
      />
    );
  } else if (screen === "comingSoon") {
    body = <ComingSoon title={comingSoonTitle} onBack={() => setScreen(returnScreen)} />;
  }

  const headerMeta = [lesson.subject, lesson.grade, lesson.topic].filter(Boolean).join(" · ") || "Новый урок";

  return (
    <div className="wf-app">
      <PrototypeControls
        variant={variant}
        scenario={scenario}
        screen={screen}
        onVariant={setVariant}
        onScenario={setScenario}
        onScreen={(value) => {
          if (value === "stageEdit" && !lesson.editingStageId) {
            patch({ editingStageId: lesson.stages[0]?.id ?? null });
          }
          setScreen(value);
        }}
      />
      <header className="wf-top">
        <div>
          <div className="wf-brand">Библиотека материалов преподавателя</div>
          <div className="wf-top-meta">{headerMeta}</div>
        </div>
        <span className="wf-badge">Вайрфрейм · {variant}</span>
      </header>
      <div className={["wf-shell", showPanel ? "" : "is-solo"].join(" ")}>
        <main className="wf-main">{body}</main>
        {showPanel ? (
          <AiPanel
            lesson={lesson}
            onExclude={excludeSource}
            prompt={aiPrompt}
            onPrompt={setAiPrompt}
            onSend={() => {
              if (!aiPrompt.trim()) return;
              setToast(`AI дорабатывает: ${aiPrompt}`);
              setAiPrompt("");
            }}
          />
        ) : null}
      </div>
      {toast ? <div className="wf-toast">{toast}</div> : null}
      <LinkedUpdateDialog
        open={linkedOpen}
        onKeepLocal={() => {
          setLinkedOpen(false);
          patch({ resultChanged: false });
          setToast("Рабочий лист обновлен. Изменение не влияет на остальные материалы.");
          setScreen("kit");
        }}
        onUpdateLinked={() => {
          setLinkedOpen(false);
          patch({ resultChanged: false });
          setToast("План и критерии обновлены по изменению в рабочем листе.");
          setScreen("kit");
        }}
      />
    </div>
  );
}
