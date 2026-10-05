import { useState } from "react";
import type { ThematicPlan } from "../mock";
import { clonePlan } from "../planMutations";
import { ThematicPlanEditor } from "./ThematicPlanEditor";
import { WireModal, WireModalActions } from "./WireModal";

type Props = {
  plan: ThematicPlan;
  onSave: (plan: ThematicPlan) => void;
  onClose: () => void;
};

export function ThematicPlanEditModal({ plan, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(() => clonePlan(plan));

  return (
    <WireModal
      title="Редактирование тематического плана"
      size="wide"
      onClose={onClose}
      actions={
        <WireModalActions
          primaryLabel="Сохранить"
          secondaryLabel="Отмена"
          onPrimary={() => onSave(clonePlan(draft))}
          onSecondary={onClose}
        />
      }
    >
      <p className="wf-hint ta-plan-editor__summary">
        {draft.title} · {draft.hours} ч · {draft.themes.length} разделов
      </p>
      <ThematicPlanEditor plan={draft} onChange={setDraft} />
    </WireModal>
  );
}
