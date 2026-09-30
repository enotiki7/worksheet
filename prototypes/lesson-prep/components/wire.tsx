import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { SelectOption } from "../types";

export function WButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const classes = ["wf-btn", variant === "secondary" ? "is-secondary" : "", variant === "ghost" ? "is-ghost" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...props}>
      {props.children}
    </button>
  );
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
      {hint ? <span className="wf-hint" style={{ margin: 0 }}>{hint}</span> : null}
    </label>
  );
}

export function WInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="wf-input" {...props} />;
}

export function WSelect({
  options,
  placeholder = "Выберите",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[]; placeholder?: string }) {
  return (
    <select className="wf-select" {...props}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function WTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={["wf-textarea", className].filter(Boolean).join(" ")} {...props} />;
}

export function WCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="wf-check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  );
}
