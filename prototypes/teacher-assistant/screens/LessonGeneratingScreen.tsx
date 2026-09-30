import { useEffect, useState } from "react";
import { MATERIAL_LABELS } from "../lessonContent";
import type { LessonContent } from "../types";

type Props = {
  content: LessonContent;
  onDone: () => void;
};

export function LessonGeneratingScreen({ content, onDone }: Props) {
  const selected = MATERIAL_LABELS.filter(({ id }) => content.materials[id]);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (doneCount >= selected.length) {
      const timer = window.setTimeout(onDone, 600);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setDoneCount((value) => value + 1), 500);
    return () => window.clearTimeout(timer);
  }, [doneCount, selected.length, onDone]);

  return (
    <div className="ta-generating">
      <p className="wf-kicker">Генерация</p>
      <h1 className="wf-title">Создаём материалы урока</h1>
      <ul className="ta-generating__list">
        {selected.map(({ id, label }, index) => (
          <li key={id} className={index < doneCount ? "is-done" : index === doneCount ? "is-active" : ""}>
            <span className="ta-generating__mark">{index < doneCount ? "✓" : "…"}</span>
            {label}
          </li>
        ))}
      </ul>
      {doneCount >= selected.length ? <p className="ta-generating__hint">Открываем рабочую область…</p> : null}
    </div>
  );
}
