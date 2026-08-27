import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconButton.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function IconButton({ className, children, type = "button", ...props }: IconButtonProps) {
  const classes = ["ui-icon-button", className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
