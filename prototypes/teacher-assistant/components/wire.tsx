import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function WButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const classes = ["wf-btn", variant === "secondary" ? "is-secondary" : "", variant === "ghost" ? "is-ghost" : "", className]
    .filter(Boolean)
    .join(" ");
  return <button type="button" className={classes} {...props} />;
}

export function WField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="wf-field">
      <span className="wf-label">
        {label}
        {required ? <span className="wf-req"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="wf-hint">{hint}</span> : null}
    </label>
  );
}

export function WInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="wf-input" {...props} />;
}

export function WTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="wf-textarea" {...props} />;
}

export function WCard({
  kicker,
  title,
  detail,
  selected,
  later,
  disabled,
  onClick,
  children,
}: {
  kicker?: string;
  title: string;
  detail?: string;
  selected?: boolean;
  later?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const className = [
    "wf-card",
    onClick && !disabled ? "is-button" : "",
    selected ? "is-selected" : "",
    later || disabled ? "is-later" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {kicker ? <p className="wf-card-kicker">{kicker}</p> : null}
      <p className="wf-card-title">{title}</p>
      {detail ? <p className="wf-card-detail">{detail}</p> : null}
      {children}
    </>
  );

  if (onClick && !disabled) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}

export function WChip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={["wf-chip", selected ? "is-selected" : ""].filter(Boolean).join(" ")} onClick={onClick}>
      {children}
    </button>
  );
}

export function WCheck({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="wf-check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function WDropzone({
  label,
  fileName,
  hint,
  onPick,
}: {
  label: string;
  fileName: string | null;
  hint?: string;
  onPick: () => void;
}) {
  return (
    <button type="button" className="wf-dropzone" onClick={onPick}>
      <span className="wf-dropzone__label">{label}</span>
      {fileName ? <span className="wf-dropzone__file">{fileName}</span> : <span className="wf-dropzone__hint">{hint ?? "Нажмите, чтобы выбрать файл"}</span>}
    </button>
  );
}
