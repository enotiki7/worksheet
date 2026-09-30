import { READINESS_ITEMS, READINESS_NOTE, stagesTotal } from "../mock";
import type { LessonState } from "../types";
import { Stepper, WButton } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function Readiness({
  lesson,
  onDownload,
  onConduct,
  onShare,
  onFinish,
  onBack,
}: {
  lesson: LessonState;
  onDownload: () => void;
  onConduct: () => void;
  onShare: () => void;
  onFinish: () => void;
  onBack: () => void;
}) {
  const readyMaterials = lesson.materials.filter((item) => item.selected && item.status === "ready");
  const hasPresentation = readyMaterials.some((item) => item.id === "m-presentation");
  const hasStudent = readyMaterials.some((item) => item.audience === "students");
  const hasTasks = readyMaterials.some((item) => item.id === "m-worksheet" || item.id === "m-exit");
  const timeOk = stagesTotal(lesson.stages) <= lesson.duration;
  const checks = {
    plan: lesson.planApproved,
    presentation: hasPresentation,
    students: hasStudent,
    tasks: hasTasks,
    criteria: lesson.worksheet.criteria.length > 0,
    time: timeOk,
    goals: lesson.plannedResults.length > 0,
    equipment: false,
  };
  const doneAll = READINESS_ITEMS.filter((item) => checks[item.id as keyof typeof checks]).length;
  const percent = Math.round((doneAll / READINESS_ITEMS.length) * 100);

  return (
    <div>
      <Stepper steps={STEPS} current="Готовность" />
      <h1 className="wf-h1">Проверка готовности урока</h1>
      <p className="wf-lead">Урок готов на {percent}%. Это ориентир, не запрет провести занятие.</p>
      <div className="wf-stack">
        {READINESS_ITEMS.map((item) => (
          <div className="wf-source" key={item.id}>
            <span>
              {item.label}
              {item.required ? "" : " · необязательно"}
            </span>
            <strong>{checks[item.id as keyof typeof checks] ? "да" : "нет"}</strong>
          </div>
        ))}
      </div>
      <div className="wf-warn" style={{ marginTop: 16 }}>
        {READINESS_NOTE}
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onDownload}>Скачать комплект</WButton>
        <WButton variant="secondary" onClick={onConduct}>
          Режим проведения
        </WButton>
        <WButton variant="secondary" onClick={onFinish}>
          Сохранить урок
        </WButton>
        <WButton variant="ghost" onClick={onShare}>
          Поделиться
        </WButton>
        <WButton variant="ghost" onClick={onFinish}>
          Завершить подготовку
        </WButton>
        <WButton variant="ghost" onClick={onBack}>
          К комплекту
        </WButton>
      </div>
    </div>
  );
}

export function SaveContext({
  lesson,
  onSave,
  onNextLesson,
  onSchedule,
  onSkip,
}: {
  lesson: LessonState;
  onSave: () => void;
  onNextLesson: () => void;
  onSchedule: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <h1 className="wf-h1">Урок подготовлен</h1>
      <p className="wf-lead">
        Сохранить {lesson.subject || "предмет"}, {lesson.grade || "класс"} и выбранный учебник, чтобы в следующий раз не выбирать их заново?
      </p>
      <div className="wf-grid wf-grid-2">
        <div className="wf-card">
          <p className="wf-card-title">Контекст разового урока</p>
          <p className="wf-card-detail">
            {lesson.subject}, {lesson.grade}, {lesson.topic}. {lesson.textbook || "учебник не выбран"}.
          </p>
        </div>
        <div className="wf-card">
          <p className="wf-card-title">Зачем сохранять</p>
          <p className="wf-card-detail">Следующий урок по программе можно начать быстрее, не настраивая класс с нуля.</p>
        </div>
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onSave}>Сохранить контекст</WButton>
        <WButton variant="secondary" onClick={onNextLesson}>
          Добавить следующий урок
        </WButton>
        <WButton variant="secondary" onClick={onSchedule}>
          Добавить расписание
        </WButton>
        <WButton variant="ghost" onClick={onSkip}>
          Пока не сохранять
        </WButton>
      </div>
    </div>
  );
}

export function ComingSoon({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div>
      <h1 className="wf-h1">{title}</h1>
      <p className="wf-lead">Следующий доступный этап. В основной тестовый маршрут не входит.</p>
      <WButton onClick={onBack}>Вернуться</WButton>
    </div>
  );
}
