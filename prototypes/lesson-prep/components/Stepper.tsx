import { useState } from "react";
import { Icon } from "./Icon";

export type StepState = "done" | "current" | "disabled";

export type StepItem = {
  id: string;
  label: string;
  state: StepState;
  hint?: string;
  onClick?: () => void;
};

export function Stepper({ steps }: { steps: StepItem[] }) {
  return (
    <nav className="lp-steps" aria-label="Этапы">
      {steps.map((step, index) => (
        <span key={step.id} className="lp-steps__group">
          <Step {...step} />
          {index < steps.length - 1 ? <span className="lp-step-line" aria-hidden="true" /> : null}
        </span>
      ))}
    </nav>
  );
}

function Step({ label, state, hint, onClick }: StepItem) {
  const [tip, setTip] = useState(false);
  const iconName = state === "done" ? "stepDone" : state === "current" ? "stepCurrent" : "stepDisabled";

  return (
    <button
      type="button"
      className={["lp-step", state === "current" ? "is-current" : "", state === "disabled" ? "is-disabled" : "", state === "done" ? "is-done" : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        if (state !== "disabled") onClick?.();
      }}
      onMouseEnter={() => state === "disabled" && hint && setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      <Icon name={iconName} size={20} />
      {label}
      {tip && hint ? <span className="lp-tip">{hint}</span> : null}
    </button>
  );
}
