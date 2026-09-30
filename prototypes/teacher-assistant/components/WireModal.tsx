import type { ReactNode } from "react";
import { WButton } from "./wire";

export function WireModal({
  title,
  children,
  onClose,
  actions,
}: {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="ta-modal" role="presentation" onClick={onClose}>
      <div
        className="ta-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "ta-modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <h2 id="ta-modal-title" className="ta-modal__title">
            {title}
          </h2>
        ) : null}
        <div className="ta-modal__body">{children}</div>
        {actions ? <div className="ta-modal__actions">{actions}</div> : null}
      </div>
    </div>
  );
}

export function WireModalActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <>
      <WButton onClick={onPrimary}>{primaryLabel}</WButton>
      <WButton variant="secondary" onClick={onSecondary}>
        {secondaryLabel}
      </WButton>
    </>
  );
}
