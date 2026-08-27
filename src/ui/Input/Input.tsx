import type { InputHTMLAttributes } from "react";
import "./Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, id, ...props }: InputProps) {
  const classes = ["ui-input", className].filter(Boolean).join(" ");

  return (
    <label className="ui-input-field" htmlFor={id}>
      {label ? <span className="ui-input-field__label">{label}</span> : null}
      <input id={id} className={classes} {...props} />
    </label>
  );
}
