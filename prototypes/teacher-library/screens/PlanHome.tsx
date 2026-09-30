import { TEST_LESSON, THEMATIC_PLANS } from "../mock";
import { WButton, WCard } from "../components/wire";
import { useState } from "react";

export function PlanHome({ onPrepareLesson }: { onPrepareLesson: () => void }) {
  const [subject, setSubject] = useState(TEST_LESSON.subject);
  const plans = THEMATIC_PLANS.filter((plan) => plan.subject === subject);
  const subjects = [...new Set(THEMATIC_PLANS.map((plan) => plan.subject))];
  const current = plans[0];

  return (
    <div>
      <h1 className="wf-h1">Тематический план</h1>
      <p className="wf-lead">Выберите предмет и урок из последовательности. Расписание импортировать не нужно.</p>
      <div className="wf-row" style={{ marginBottom: 16 }}>
        {subjects.map((item) => (
          <WButton key={item} variant={item === subject ? "primary" : "secondary"} onClick={() => setSubject(item)}>
            {item}
          </WButton>
        ))}
      </div>
      {current ? (
        <div className="wf-card" style={{ marginBottom: 16 }}>
          <p className="wf-card-kicker">
            {current.grade} · {current.hours} ч
          </p>
          <p className="wf-card-title">{current.title}</p>
        </div>
      ) : null}
      <table className="wf-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Тема</th>
            <th>Часы</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(current?.lessons ?? []).map((lesson) => (
            <tr key={lesson.id}>
              <td>{lesson.number}</td>
              <td>
                {lesson.topic}
                {lesson.status === "done" ? " · проведен" : null}
                {lesson.status === "next" ? " · следующий" : null}
              </td>
              <td>{lesson.hours}</td>
              <td>
                {lesson.topic === TEST_LESSON.topic ? (
                  <WButton onClick={onPrepareLesson}>Продолжить подготовку</WButton>
                ) : (
                  <WButton variant="ghost" disabled>
                    Позже
                  </WButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!current ? <WCard title="Нет плана" detail="Для этого предмета в прототипе нет КТП." /> : null}
    </div>
  );
}
