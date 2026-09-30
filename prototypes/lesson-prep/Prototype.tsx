import { useMemo, useState } from "react";
import { Button } from "@company/ui";
import bannerBg from "./assets/banner-bg.png";
import bannerIllustration from "./assets/banner-illustration.png";
import { Stepper } from "./components/Stepper";
import { DEFAULT_SUGGESTS, LESSON_GOAL_ITEMS, STEP_SUGGESTS, THEMES } from "./content";
import { PickScreen } from "./screens/PickScreen";
import { PlanScreen } from "./screens/PlanScreen";
import { SlidesScreen } from "./screens/SlidesScreen";

type Screen = "pick" | "plan" | "slides";

export function Prototype() {
  const [screen, setScreen] = useState<Screen>("pick");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("45");
  const [planId, setPlanId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [openTheme, setOpenTheme] = useState("reals");
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [materials, setMaterials] = useState<string[]>(["outline", "tasks"]);
  const [materialTab, setMaterialTab] = useState("slides");
  const [goalItems, setGoalItems] = useState(LESSON_GOAL_ITEMS);
  const [messages, setMessages] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const ready = subject === "algebra" && grade === "9" && planId !== "" && Number(duration) > 0;
  const lesson = useMemo(() => THEMES.flatMap((theme) => theme.lessons).find((item) => item.id === lessonId), [lessonId]);
  const suggests = activeStep === "s3" ? STEP_SUGGESTS : DEFAULT_SUGGESTS;

  const reset = () => {
    setSubject("");
    setGrade("");
    setDuration("45");
    setPlanId("");
    setLessonId("");
    setScreen("pick");
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, value, "Учту это в черновике урока «Сравнение действительных чисел»."]);
    setDraft("");
  };

  const applySuggest = (label: string) => {
    if (label === "Сократить цель урока") {
      setGoalItems([
        "Научиться сравнивать действительные числа и обосновывать знак сравнения.",
        "Сформировать умение выбирать рациональный способ сравнения.",
      ]);
    }
    if (label === "Сделать этап более практическим" && activeStep === "s3") {
      setMessages((prev) => [...prev, "Этап 3 стал практическим: ученики сами формулируют алгоритм сравнения."]);
      return;
    }
    setMessages((prev) => [...prev, label]);
  };

  const mainSteps =
    screen === "pick"
      ? [
          { id: "pick", label: "Выбор урока", state: "current" as const, onClick: () => setScreen("pick") },
          { id: "plan", label: "План урока", state: "disabled" as const, hint: "Заполните обязательные поля", onClick: () => lesson && setScreen("plan") },
          { id: "materials", label: "Материалы для урока", state: "disabled" as const, hint: "Заполните обязательные поля" },
        ]
      : [
          { id: "pick", label: "Выбор урока", state: "done" as const, onClick: () => setScreen("pick") },
          { id: "plan", label: "План урока", state: "current" as const, onClick: () => setScreen("plan") },
          { id: "materials", label: "Материалы для урока", state: "disabled" as const, hint: "Заполните обязательные поля", onClick: () => materials.length > 0 && setScreen("slides") },
        ];

  return (
    <div className="lp-app">
      {screen === "pick" ? (
        <header className="lp-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
          <div className="lp-banner__text">
            <h1>Подготовка к уроку</h1>
            <p>Укажите предмет, параллель и тематический план, выберите урок</p>
          </div>
          <img className="lp-banner__illustration" src={bannerIllustration} alt="" />
        </header>
      ) : null}

      {screen === "slides" ? (
        <SlidesScreen
          tab={materialTab}
          onTab={setMaterialTab}
          onBack={() => setScreen("plan")}
          onPick={() => setScreen("pick")}
          messages={messages}
          draft={draft}
          onDraft={setDraft}
          onSend={() => send(draft)}
          onSuggest={applySuggest}
        />
      ) : (
        <>
          <Stepper steps={mainSteps} />
          {screen === "pick" ? (
            <PickScreen
              subject={subject}
              grade={grade}
              duration={duration}
              planId={planId}
              lessonId={lessonId}
              openTheme={openTheme}
              ready={ready}
              onSubject={(value) => {
                setSubject(value);
                setLessonId("");
              }}
              onGrade={(value) => {
                setGrade(value);
                setLessonId("");
              }}
              onDuration={setDuration}
              onPlan={(value) => {
                setPlanId(value);
                setLessonId("");
                setOpenTheme("reals");
              }}
              onToggleTheme={(id) => setOpenTheme((current) => (current === id ? "" : id))}
              onLesson={setLessonId}
            />
          ) : (
            <PlanScreen
              title={lesson?.title ?? "Сравнение действительных чисел"}
              goalItems={goalItems}
              activeStep={activeStep}
              onStep={setActiveStep}
              materials={materials}
              onToggleMaterial={(id) =>
                setMaterials((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
              }
              suggests={suggests}
              messages={messages}
              draft={draft}
              onDraft={setDraft}
              onSend={() => send(draft)}
              onSuggest={applySuggest}
              onNext={() => setScreen("slides")}
            />
          )}
          {screen === "pick" ? (
            <footer className="lp-footer">
              <Button variant="secondary" size="medium" onClick={reset}>
                Отменить
              </Button>
              <Button variant="brand" size="medium" disabled={!lesson} onClick={() => setScreen("plan")}>
                Далее
              </Button>
            </footer>
          ) : null}
        </>
      )}
    </div>
  );
}
