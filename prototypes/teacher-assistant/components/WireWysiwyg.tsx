import type { ReactNode } from "react";

export function WireWysiwyg({
  label,
  children,
  onAi,
}: {
  label?: string;
  children: ReactNode;
  onAi?: () => void;
}) {
  return (
    <div className="ta-wysiwyg">
      {label ? <span className="ta-wysiwyg__label">{label}</span> : null}
      <div className="ta-wysiwyg__toolbar" aria-hidden>
        <span>Ж</span>
        <span>К</span>
        <span>Ч</span>
        <span>T</span>
        <span>•</span>
        <span>1.</span>
        {onAi ? (
          <button type="button" className="ta-wysiwyg__ai" onClick={onAi}>
            ИИ
          </button>
        ) : null}
      </div>
      <div className="ta-wysiwyg__body">{children}</div>
    </div>
  );
}

export function EditableBlock({
  html,
  onChange,
  multiline,
}: {
  html: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div
      className={["ta-editable", multiline ? "is-multiline" : ""].filter(Boolean).join(" ")}
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.textContent ?? "")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
