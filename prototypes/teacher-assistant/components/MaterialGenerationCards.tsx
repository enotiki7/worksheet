import { useState } from "react";
import { MATERIAL_OPTIONS } from "../lessonContent";
import type { MaterialId } from "../types";
import { WButton } from "./wire";

export function MaterialGenerationCards({
  selected,
  onToggle,
}: {
  selected: Record<MaterialId, boolean>;
  onToggle: (id: MaterialId, checked: boolean) => void;
}) {
  const [configuringId, setConfiguringId] = useState<MaterialId | null>(null);
  const configuring = MATERIAL_OPTIONS.find((item) => item.id === configuringId);

  return (
    <div className="ta-materials">
      {MATERIAL_OPTIONS.map(({ id, label, metaLabel }) => {
        const isSelected = selected[id];

        return (
          <div key={id} className={["ta-material-card", isSelected ? "is-selected" : ""].filter(Boolean).join(" ")}>
            <label className="ta-material-card__select">
              <input type="checkbox" checked={isSelected} onChange={(event) => onToggle(id, event.target.checked)} />
            </label>
            <div className="ta-material-card__body">
              <p className="ta-material-card__title">{label}</p>
              {metaLabel ? <p className="ta-material-card__meta">{metaLabel}</p> : null}
            </div>
            <WButton
              variant="secondary"
              className="ta-material-card__configure"
              onClick={() => setConfiguringId(id)}
            >
              Настроить
            </WButton>
          </div>
        );
      })}

      {configuring ? (
        <p className="wf-hint ta-materials__hint">Настройки «{configuring.label}» — прототип, детальный редактор в следующей итерации.</p>
      ) : null}
    </div>
  );
}
