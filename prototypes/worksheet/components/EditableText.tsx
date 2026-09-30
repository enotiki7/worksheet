import { useLayoutEffect, useRef, useState } from "react";

function adjustTextareaHeight(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  const styles = window.getComputedStyle(element);
  const borders = styles.boxSizing === "border-box"
    ? parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
    : 0;
  element.style.height = `${element.scrollHeight + borders}px`;
}

function stateClassName(className: string | undefined, isEmpty: boolean, focused: boolean) {
  return [
    "editable-text",
    className,
    isEmpty ? "is-empty is-placeholder" : "is-filled",
    focused ? "is-active" : "",
  ].filter(Boolean).join(" ");
}

export function EditableText({
  value,
  editing,
  placeholder,
  onChange,
  className,
  maxLength,
  readOnly = false,
}: {
  value: string;
  editing: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
  maxLength?: number;
  readOnly?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const isPlaceholderValue = placeholder.length > 0 && value === placeholder;
  const isEmpty = value.trim().length === 0 || isPlaceholderValue;
  const displayValue = isPlaceholderValue ? "" : value;

  useLayoutEffect(() => {
    if (!editing || readOnly || !textareaRef.current) return;
    adjustTextareaHeight(textareaRef.current);
  }, [editing, readOnly, displayValue]);

  if (editing && !readOnly) {
    return (
      <textarea
        ref={textareaRef}
        className={stateClassName(className, isEmpty, focused)}
        value={displayValue}
        rows={1}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={(event) => adjustTextareaHeight(event.currentTarget)}
        onClick={(event) => event.stopPropagation()}
      />
    );
  }

  return (
    <p className={stateClassName(className, isEmpty, false)}>
      {isEmpty ? placeholder || "\u00a0" : value}
    </p>
  );
}
