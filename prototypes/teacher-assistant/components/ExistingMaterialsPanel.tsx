import { LIBRARY_TYPE_LABELS } from "../mock";
import type { LibraryMaterial } from "../types";
import { WCard } from "./wire";

const TYPE_ORDER: LibraryMaterial["type"][] = ["presentation", "worksheet", "task", "infographic"];

export function ExistingMaterialsPanel({
  title,
  hint,
  materials,
  selectedIds,
  onToggle,
  compact,
}: {
  title: string;
  hint?: string;
  materials: LibraryMaterial[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  compact?: boolean;
}) {
  if (materials.length === 0) {
    return (
      <div className="ta-library">
        <p className="ta-library__title">{title}</p>
        <p className="wf-hint">Нет сохранённых материалов по этому предмету и классу.</p>
      </div>
    );
  }

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    items: materials.filter((item) => item.type === type),
  })).filter((group) => group.items.length > 0);

  return (
    <div className={["ta-library", compact ? "is-compact" : ""].filter(Boolean).join(" ")}>
      <p className="ta-library__title">{title}</p>
      {hint ? <p className="wf-hint">{hint}</p> : null}
      {grouped.map((group) => (
        <div key={group.type} className="ta-library__group">
          <p className="ta-library__group-label">{LIBRARY_TYPE_LABELS[group.type]}</p>
          <div className="wf-stack">
            {group.items.map((item) => (
              <WCard
                key={item.id}
                selected={selectedIds.includes(item.id)}
                kicker={`${LIBRARY_TYPE_LABELS[item.type]} · ${item.updatedAt}`}
                title={item.title}
                onClick={() => onToggle(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
      {selectedIds.length > 0 ? (
        <p className="ta-library__summary">Добавлено к уроку: {selectedIds.length}</p>
      ) : null}
    </div>
  );
}
