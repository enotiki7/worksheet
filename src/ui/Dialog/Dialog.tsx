import type { ReactNode } from "react";
import "./Dialog.css";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ open, title, onClose, children }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-dialog-backdrop" onClick={onClose} role="presentation">
      <div
        className="ui-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="ui-dialog-title" className="ui-dialog__title">
          {title}
        </h2>
        <div className="ui-dialog__body">{children}</div>
      </div>
    </div>
  );
}
