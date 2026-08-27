import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type ButtonVariant = "brand" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({
  variant = "brand",
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {icon ? <span className="ui-button__icon">{icon}</span> : null}
      {children ? <span className="ui-button__label">{children}</span> : null}
    </button>
  );
}
