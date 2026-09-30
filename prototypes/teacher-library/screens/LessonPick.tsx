import { GRADES, SUBJECTS, THEMATIC_PLANS } from "../mock";
import type { LessonState } from "../types";
import { Stepper, WButton, WCard, WInput } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function LessonPick({
  lesson,
  onSelect,
  onContinue,
  onBack,
}: {
  lesson: LessonState;
  onSelect: (patch: Partial<LessonState>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const matchingPlans = THEMATIC_PLANS.filter((plan) => !lesson.subject || plan.subject === lesson.subject);
  const gradeOptions = matchingPlans.length
    ? matchingPlans.map((item) => ({ id: item.id, grade: item.grade, subject: item.subject }))
    : GRADES.map((grade) => ({ id: grade, grade, subject: lesson.subject }));
  const plan = THEMATIC_PLANS.find((item) => item.subject === lesson.subject && item.grade === lesson.grade);
  const canContinue = Boolean(lesson.subject && lesson.grade && lesson.topic);

  return (
    <div>
      <Stepper steps={STEPS} current="Урок" />
      <h1 className="wf-h1">Какой урок готовим?</h1>
      <p className="wf-lead">Достаточно выбрать предмет, класс и тему урока. Остальное AI предложит на следующем шаге.</p>
      <p className="wf-card-kicker">Предмет</p>
      <div className="wf-row" style={{ marginBottom: 16 }}>
        {SUBJECTS.map((subject) => (
          <WButton
            key={subject}
            variant={lesson.subject === subject ? "primary" : "secondary"}
            onClick={() => onSelect({ subject, grade: "", topic: "" })}
          >
            {subject}
          </WButton>
        ))}
      </div>
      <p className="wf-card-kicker">Параллель / класс</p>
      <div className="wf-row" style={{ marginBottom: 16 }}>
        {gradeOptions.map((item) => (
          <WButton
            key={item.id}
            variant={lesson.grade === item.grade && lesson.subject === item.subject ? "primary" : "secondary"}
            onClick={() => onSelect({ subject: item.subject, grade: item.grade, topic: "" })}
          >
            {item.grade}
          </WButton>
        ))}
      </div>
      {plan ? (
        <>
          <p className="wf-card-kicker">
            Тематический план · {plan.title} · {plan.hours} ч
          </p>
          <div className="wf-stack">
            {plan.lessons.map((item) => (
              <WCard
                key={item.id}
                selected={lesson.topic === item.topic}
                kicker={`${item.hours} ч · урок ${item.number}`}
                title={item.topic}
                detail={item.status === "next" ? "Следующий по программе" : item.status === "done" ? "Уже проведен" : "В плане"}
                onClick={() => onSelect({ subject: plan.subject, grade: plan.grade, topic: item.topic })}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="wf-card">
          <p className="wf-card-title">Тема урока</p>
          <p className="wf-hint">Для этого предмета в прототипе нет КТП. Введите тему вручную.</p>
          <WInput value={lesson.topic} onChange={(event) => onSelect({ topic: event.target.value })} />
        </div>
      )}
      <div className="wf-footer-actions">
        <WButton onClick={onContinue} disabled={!canContinue}>
          Продолжить подготовку
        </WButton>
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
