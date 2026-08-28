import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Button } from "@company/ui";
import "./BlanksEditor.css";

export type BlankRange = {
  id: string;
  start: number;
  end: number;
  text: string;
};

type BlanksEditorProps = {
  text: string;
  blanks: BlankRange[];
  active: boolean;
  showAnswers: boolean;
  onChange: (text: string, blanks: BlankRange[]) => void;
};

type FloatingAction = {
  mode: "add" | "remove";
  start: number;
  end: number;
  blankId?: string;
  left: number;
  top: number;
};

let blankSequence = 1;

function validBlanks(text: string, blanks: BlankRange[]) {
  return [...blanks]
    .filter((blank) => (
      blank.start >= 0
      && blank.end > blank.start
      && blank.end <= text.length
      && text.slice(blank.start, blank.end) === blank.text
    ))
    .sort((left, right) => left.start - right.start);
}

function renderText(text: string, blanks: BlankRange[], showAnswers: boolean, active: boolean) {
  const content: ReactNode[] = [];
  let offset = 0;

  validBlanks(text, blanks).forEach((blank) => {
    if (blank.start > offset) {
      content.push(<span key={`text-${offset}`}>{text.slice(offset, blank.start)}</span>);
    }

    content.push(
      <span
        key={blank.id}
        className={[
          "blanks-editor__blank",
          showAnswers ? "is-answer" : "",
          active ? "is-active" : "",
        ].filter(Boolean).join(" ")}
        data-blank-id={blank.id}
      >
        {active || showAnswers ? blank.text : "_".repeat(blank.text.length * 2)}
      </span>,
    );
    offset = blank.end;
  });

  if (offset < text.length) {
    content.push(<span key={`text-${offset}`}>{text.slice(offset)}</span>);
  }

  return content;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderEditorHtml(text: string, blanks: BlankRange[], showAnswers: boolean) {
  let html = "";
  let offset = 0;

  validBlanks(text, blanks).forEach((blank) => {
    html += escapeHtml(text.slice(offset, blank.start));
    html += `<span class="blanks-editor__blank is-active${showAnswers ? " is-answer" : ""}" data-blank-id="${escapeHtml(blank.id)}">${escapeHtml(blank.text)}</span>`;
    offset = blank.end;
  });

  return html + escapeHtml(text.slice(offset));
}

function insertPlainText(text: string) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function BlanksEditor({
  text,
  blanks,
  active,
  showAnswers,
  onChange,
}: BlanksEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const draftTextRef = useRef(text);
  const draftBlanksRef = useRef(validBlanks(text, blanks));
  const [action, setAction] = useState<FloatingAction | null>(null);

  useLayoutEffect(() => {
    draftTextRef.current = text;
    draftBlanksRef.current = validBlanks(text, blanks);
  }, [text, blanks]);

  useLayoutEffect(() => {
    if (!active || !editorRef.current) return;
    const html = renderEditorHtml(text, blanks, showAnswers);
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [active, text, blanks, showAnswers]);

  useEffect(() => {
    if (!active) setAction(null);
  }, [active]);

  const positionAction = (rect: DOMRect) => {
    const wrapper = wrapperRef.current?.getBoundingClientRect();
    if (!wrapper) return { left: rect.left, top: rect.top };
    return {
      left: Math.max(72, Math.min(wrapper.width - 72, rect.left - wrapper.left + rect.width / 2)),
      top: rect.top - wrapper.top - 8,
    };
  };

  const readEditorState = () => {
    const root = editorRef.current;
    if (!root) {
      return { text: draftTextRef.current, blanks: draftBlanksRef.current };
    }

    const nextText = root.textContent ?? "";
    const nextBlanks = draftBlanksRef.current.flatMap((blank) => {
      const element = root.querySelector<HTMLElement>(`[data-blank-id="${blank.id}"]`);
      if (!element || element.textContent !== blank.text) return [];
      const prefix = document.createRange();
      prefix.selectNodeContents(root);
      prefix.setEndBefore(element);
      const start = prefix.toString().length;
      return [{ ...blank, start, end: start + blank.text.length }];
    });

    draftTextRef.current = nextText;
    draftBlanksRef.current = nextBlanks;
    return { text: nextText, blanks: nextBlanks };
  };

  const commitDraft = () => {
    const next = readEditorState();
    if (
      next.text !== text
      || next.blanks.length !== blanks.length
      || next.blanks.some((blank, index) => (
        blank.id !== blanks[index]?.id
        || blank.start !== blanks[index]?.start
        || blank.end !== blanks[index]?.end
      ))
    ) {
      onChange(next.text, next.blanks);
    }
  };

  const updateActionFromSelection = () => {
    if (!active) return;
    const root = editorRef.current;
    const selection = window.getSelection();
    if (!root || !selection?.rangeCount || selection.isCollapsed) {
      setAction(null);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) {
      setAction(null);
      return;
    }

    const prefix = document.createRange();
    prefix.selectNodeContents(root);
    prefix.setEnd(range.startContainer, range.startOffset);
    const rawSelection = range.toString();
    const leadingSpace = rawSelection.match(/^\s*/)?.[0].length ?? 0;
    const trailingSpace = rawSelection.match(/\s*$/)?.[0].length ?? 0;
    const start = prefix.toString().length + leadingSpace;
    const end = prefix.toString().length + rawSelection.length - trailingSpace;
    const selectedText = (root.textContent ?? "").slice(start, end);

    if (!selectedText || /\s/.test(selectedText)) {
      setAction(null);
      return;
    }

    const current = readEditorState();
    const overlapping = current.blanks.find((blank) => start < blank.end && end > blank.start);
    const position = positionAction(range.getBoundingClientRect());
    setAction(overlapping
      ? { mode: "remove", blankId: overlapping.id, start, end, ...position }
      : { mode: "add", start, end, ...position });
  };

  const showRemoveAction = (blankId: string, target: HTMLElement) => {
    const current = readEditorState();
    const blank = current.blanks.find((item) => item.id === blankId);
    if (!blank) return;
    setAction({
      mode: "remove",
      blankId,
      start: blank.start,
      end: blank.end,
      ...positionAction(target.getBoundingClientRect()),
    });
  };

  const applyAction = () => {
    if (!action) return;
    const current = readEditorState();

    if (action.mode === "remove" && action.blankId) {
      onChange(current.text, current.blanks.filter((blank) => blank.id !== action.blankId));
    } else {
      const selectedText = current.text.slice(action.start, action.end);
      if (selectedText && !current.blanks.some((blank) => action.start < blank.end && action.end > blank.start)) {
        onChange(current.text, validBlanks(current.text, [
          ...current.blanks,
          {
            id: `blank-${blankSequence++}`,
            start: action.start,
            end: action.end,
            text: selectedText,
          },
        ]));
      }
    }

    window.getSelection()?.removeAllRanges();
    setAction(null);
  };

  const handleEditorClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-blank-id]");
    if (!target) return;
    event.stopPropagation();
    showRemoveAction(target.dataset.blankId ?? "", target);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setAction(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    insertPlainText("\n");
    readEditorState();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    insertPlainText(event.clipboardData.getData("text/plain").replace(/\r\n?/g, "\n"));
    readEditorState();
  };

  const sortedBlanks = validBlanks(text, blanks);
  const actionStyle = action
    ? ({ left: action.left, top: action.top } satisfies CSSProperties)
    : undefined;

  return (
    <div ref={wrapperRef} className={active ? "blanks-editor is-active" : "blanks-editor"}>
      {active ? (
        <div
          ref={editorRef}
          className="blanks-editor__text"
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder="Текст с пропусками"
          onBlur={commitDraft}
          onClick={handleEditorClick}
          onInput={() => {
            const previousCount = draftBlanksRef.current.length;
            const next = readEditorState();
            if (next.blanks.length !== previousCount) onChange(next.text, next.blanks);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActionFromSelection}
          onMouseUp={updateActionFromSelection}
          onPaste={handlePaste}
        />
      ) : (
        <p className={text ? "blanks-editor__text" : "blanks-editor__text is-placeholder"}>
          {text ? renderText(text, blanks, showAnswers, false) : "Текст с пропусками"}
        </p>
      )}

      {sortedBlanks.length ? (
        <div className="blanks-editor__words">
          <span>Пропущенные слова:</span>
          {sortedBlanks.map((blank) => (
            <button
              key={blank.id}
              type="button"
              className={action?.blankId === blank.id ? "is-selected" : ""}
              disabled={!active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                showRemoveAction(blank.id, event.currentTarget);
              }}
            >
              {blank.text},
            </button>
          ))}
        </div>
      ) : null}

      {action ? (
        <Button
          className="blanks-editor__action"
          variant="outline"
          size="small"
          style={actionStyle}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            applyAction();
          }}
        >
          {action.mode === "add" ? "Сделать пропуском" : "Убрать пропуск"}
        </Button>
      ) : null}
    </div>
  );
}
