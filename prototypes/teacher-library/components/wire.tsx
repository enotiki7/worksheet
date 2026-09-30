import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

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
      {hint ? <span className="wf-hint" style={{ margin: 0 }}>{hint}</span> : null}
    </label>
  );
}

export function WInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="wf-input" {...props} />;
}

export function WSelect({ options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select className="wf-select" {...props}>
      <option value="">Выберите</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
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
  onClick,
  children,
}: {
  kicker?: string;
  title: string;
  detail?: string;
  selected?: boolean;
  later?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const className = ["wf-card", onClick ? "is-button" : "", selected ? "is-selected" : "", later ? "is-later" : ""]
    .filter(Boolean)
    .join(" ");
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {kicker ? <p className="wf-card-kicker">{kicker}</p> : null}
        <p className="wf-card-title">{title}</p>
        {detail ? <p className="wf-card-detail">{detail}</p> : null}
        {children}
      </button>
    );
  }
  return (
    <div className={className}>
      {kicker ? <p className="wf-card-kicker">{kicker}</p> : null}
      <p className="wf-card-title">{title}</p>
      {detail ? <p className="wf-card-detail">{detail}</p> : null}
      {children}
    </div>
  );
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

export function Stepper({ steps, current }: { steps: string[]; current: string }) {
  return (
    <div className="wf-stepper">
      {steps.map((step, index) => (
        <span key={step} className={step === current ? "is-current" : undefined}>
          {index + 1}. {step}
        </span>
      ))}
    </div>
  );
}
