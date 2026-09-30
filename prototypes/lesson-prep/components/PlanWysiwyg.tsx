import { createPortal } from "react-dom";
import { Icon } from "./Icon";

const ACTIONS = [
  { cmd: "bold", icon: "wysiwygBold" as const, label: "Жирный" },
  { cmd: "italic", icon: "wysiwygItalic" as const, label: "Курсив" },
  { cmd: "underline", icon: "wysiwygUnderline" as const, label: "Подчёркнутый" },
  { cmd: "strikeThrough", icon: "wysiwygStrike" as const, label: "Зачёркнутый" },
  { cmd: "insertText", icon: "wysiwygMath" as const, label: "Формула", value: "√x" },
  { cmd: "formatBlock", icon: "wysiwygCode" as const, label: "Код", value: "pre" },
  { cmd: "superscript", icon: "wysiwygSuper" as const, label: "Надстрочный" },
  { cmd: "subscript", icon: "wysiwygSub" as const, label: "Подстрочный" },
];

type PlanWysiwygProps = {
  top: number;
  left: number;
};

export function PlanWysiwyg({ top, left }: PlanWysiwygProps) {
  const run = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  return createPortal(
    <div
      className="lp-wysiwyg"
      style={{ top, left }}
      role="toolbar"
      aria-label="Форматирование текста"
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="lp-wysiwyg__tools">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="lp-wysiwyg__item"
            aria-label={action.label}
            onClick={() => run(action.cmd, action.value)}
          >
            <span className="lp-wysiwyg__icon-wrap">
              <Icon name={action.icon} size={18} />
            </span>
          </button>
        ))}
        <button type="button" className="lp-wysiwyg__item" aria-label="Изображение">
          <span className="lp-wysiwyg__icon-wrap">
            <Icon name="wysiwygImage" size={18} />
          </span>
        </button>
      </div>
      <span className="lp-wysiwyg__divider" aria-hidden="true" />
      <button type="button" className="lp-wysiwyg__item" aria-label="Разделитель">
        <span className="lp-wysiwyg__bar" />
      </button>
    </div>,
    document.body,
  );
}
