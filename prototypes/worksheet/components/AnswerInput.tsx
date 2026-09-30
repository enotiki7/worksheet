import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TextAnswerType } from "../types";
import { AnswerArea } from "./AnswerArea";

type AnswerInputProps = {
  answerType: TextAnswerType;
  blockHeight: number;
  value: string;
  onChange: (value: string) => void;
  interactive: boolean;
  showAnswer: boolean;
  persistChanges: boolean;
  placeholder?: string;
};

function adjustTextareaHeight(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  const styles = window.getComputedStyle(element);
  const borders = styles.boxSizing === "border-box"
    ? parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
    : 0;
  element.style.height = `${element.scrollHeight + borders}px`;
}

export function AnswerInput({
  answerType,
  blockHeight,
  value,
  onChange,
  interactive,
  showAnswer,
  persistChanges,
  placeholder = "Введите ответ",
}: AnswerInputProps) {
  const [previewValue, setPreviewValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayValue = persistChanges ? value : previewValue;
  const isEmpty = displayValue.trim().length === 0;

  useEffect(() => {
    if (!persistChanges) {
      setPreviewValue("");
    }
  }, [persistChanges, answerType, blockHeight]);

  useLayoutEffect(() => {
    if (!interactive || !textareaRef.current) return;
    adjustTextareaHeight(textareaRef.current);
  }, [interactive, displayValue, answerType, blockHeight]);

  const handleChange = (next: string) => {
    if (persistChanges) {
      onChange(next);
      return;
    }
    setPreviewValue(next);
  };

  const showReadOnlyAnswer = showAnswer && value && !interactive;

  return (
    <div
      className={[
        "canvas-answer",
        isEmpty ? "is-empty" : "is-filled",
        focused ? "is-active" : "",
        `canvas-answer--${answerType === "Линии" ? "lines" : "area"}`,
      ].filter(Boolean).join(" ")}
    >
      <AnswerArea type={answerType} height={blockHeight} />
      {showReadOnlyAnswer ? (
        <p className="canvas-answer__readonly is-filled">{value}</p>
      ) : interactive ? (
        <textarea
          ref={textareaRef}
          className={[
            "canvas-answer__overlay",
            "editable-text",
            isEmpty ? "is-empty is-placeholder" : "is-filled",
            focused ? "is-active" : "",
          ].filter(Boolean).join(" ")}
          value={displayValue}
          rows={answerType === "Линии" ? blockHeight : 1}
          placeholder={placeholder}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={(event) => adjustTextareaHeight(event.currentTarget)}
          onClick={(event) => event.stopPropagation()}
        />
      ) : null}
    </div>
  );
}
