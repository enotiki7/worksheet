import { MATERIAL_OPTIONS } from "../mock";
import type { EntryState, GeneratedMaterial } from "../types";
import { LessonMeta } from "./PrepScreen";
import { WButton } from "../components/wire";

export function ResultScreen({
  entry,
  topic,
  materials,
  onBack,
}: {
  entry: EntryState;
  topic: string;
  materials: GeneratedMaterial[];
  onBack: () => void;
}) {
  const ordered = MATERIAL_OPTIONS.map((option) => materials.find((item) => item.kind === option.id)).filter((item): item is GeneratedMaterial => Boolean(item));

  return (
    <div>
      <h1 className="wf-h1">Урок «{topic}»</h1>
      <LessonMeta entry={entry} topic={topic} />
      <div className="wf-stack">
        {ordered.map((material) => (
          <article key={material.kind} className="wf-card">
            <p className="wf-card-title">{material.title}</p>
            <ul className="wf-list">
              {material.lines.map((line, index) => (
                <li key={`${material.kind}-${index}`}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="wf-footer-actions">
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
