import { Icon } from "./Icon";

const ACTIONS = [
  { cmd: "bold", icon: "wysiwygBold" as const, label: "Жирный" },
  { cmd: "italic", icon: "wysiwygItalic" as const, label: "Курсив" },
  { cmd: "underline", icon: "wysiwygUnderline" as const, label: "Подчёркнутый" },
  { cmd: "strikeThrough", icon: "wysiwygStrike" as const, label: "Зачёркнутый" },
  { cmd: "insertHTML", icon: "wysiwygMath" as const, label: "Формула", html: "√x" },
  { cmd: "formatBlock", icon: "wysiwygCode" as const, label: "Код", value: "pre" },
  { cmd: "superscript", icon: "wysiwygSuper" as const, label: "Надстрочный" },
  { cmd: "subscript", icon: "wysiwygSub" as const, label: "Подстрочный" },
];

type WysiwygProps = {
  onUnsupported: (label: string) => void;
};

export function Wysiwyg({ onUnsupported }: WysiwygProps) {
  return (
    <div className="ws-wysiwyg" onMouseDown={(event) => event.preventDefault()}>
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          className="ws-wysiwyg__item"
          aria-label={action.label}
          onClick={() => {
            if (action.html) {
              document.execCommand("insertText", false, action.html);
              return;
            }
            document.execCommand(action.cmd, false, action.value);
          }}
        >
          <Icon name={action.icon} size={18} />
        </button>
      ))}
      <button
        type="button"
        className="ws-wysiwyg__item"
        aria-label="Изображение"
        onClick={() => onUnsupported("Вставка изображения")}
      >
        <Icon name="wysiwygImage" size={18} />
      </button>
      <span className="ws-wysiwyg__divider" />
      <button type="button" className="ws-wysiwyg__item" aria-label="Разделитель">
        <span className="ws-wysiwyg__bar" />
      </button>
      <button
        type="button"
        className="ws-wysiwyg__item"
        aria-label="Ещё"
        onClick={() => onUnsupported("Дополнительные инструменты")}
      >
        <Icon name="wysiwygMore" size={18} />
      </button>
    </div>
  );
}
