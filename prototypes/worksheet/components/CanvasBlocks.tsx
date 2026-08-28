import { Checkbox, Radio } from "@company/ui";
import { useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import graph1 from "../assets/graph-1.png";
import graph2 from "../assets/graph-2.png";
import graph3 from "../assets/graph-3.png";
import graph4 from "../assets/graph-4.png";
import { Icon } from "./Icon";
import { Wysiwyg } from "./Wysiwyg";
import { BlanksEditor, type BlankRange } from "./BlanksEditor";

export type CanvasBlockKind =
  | "text"
  | "answer"
  | "single"
  | "multi"
  | "match"
  | "order"
  | "table"
  | "blanks"
  | "graph"
  | "media"
  | "pagebreak";

export type CanvasBlock = {
  id: string;
  kind: CanvasBlockKind;
  prompt: string;
  text?: string;
  answer?: string;
  options?: string[];
  pairs?: Array<[string, string]>;
  items?: string[];
  columns?: string[];
  rows?: string[][];
  blanks?: BlankRange[];
  difficulty: 0 | 1 | 2 | 3;
};

let blockSequence = 100;
const nextId = () => `canvas-block-${blockSequence++}`;

export const GENERATED_BLOCKS: CanvasBlock[] = [
  {
    id: "generated-choice",
    kind: "multi",
    prompt: "Какие из точек принадлежат графику уравнения x − 2y + 4 = 0?",
    options: ["A(0; 2)", "B(2; 3)", "C(−4; 0)", "D(4; 0)"],
    difficulty: 0,
  },
  {
    id: "generated-graph",
    kind: "graph",
    prompt: "Какие из точек принадлежат графику уравнения x − 2y + 4 = 0?",
    difficulty: 0,
  },
  {
    id: "generated-match",
    kind: "match",
    prompt: "Соедините пары уравнений так, чтобы в каждой соответствующие прямые были параллельны.",
    pairs: [
      ["2x = 5 – 3y", "4x + 6y + 7 = 0"],
      ["2y = x + 1", "2x − 4y + 9 = 0"],
      ["3x − y + 8 = 0", "6x = 2y + 1"],
      ["y − 4 = –x", "3x + 3y + 2 = 0"],
    ],
    difficulty: 0,
  },
  {
    id: "generated-blanks",
    kind: "blanks",
    prompt: "Приведите линейное уравнение к виду y = kx + b, заполнив пропуски:",
    text: "2x + 3y − 6 = 0\n3y = −2x + 6\ny = −2/3 x + 2",
    blanks: [
      { id: "generated-blank-1", start: 21, end: 28, text: "−2x + 6" },
      { id: "generated-blank-2", start: 33, end: 37, text: "−2/3" },
      { id: "generated-blank-3", start: 42, end: 43, text: "2" },
    ],
    difficulty: 0,
  },
];

export function createCanvasBlock(kind: CanvasBlockKind): CanvasBlock {
  const base = { id: nextId(), kind, prompt: "Введите текст", difficulty: 0 as const };
  switch (kind) {
    case "text":
      return { ...base, prompt: "", text: "" };
    case "answer":
      return { ...base, answer: "" };
    case "single":
    case "multi":
      return { ...base, options: ["Ответ", "Ответ", "Ответ", "Ответ"] };
    case "match":
      return { ...base, pairs: [["Ответ", "Ответ"], ["Ответ", "Ответ"], ["Ответ", "Ответ"]] };
    case "order":
      return { ...base, items: ["Текст", "Текст", "Текст", "Текст", "Текст"] };
    case "table":
      return {
        ...base,
        columns: ["Название группы", "Название группы", "Название группы"],
        rows: Array.from({ length: 4 }, () => ["", "", ""]),
      };
    case "blanks":
      return {
        ...base,
        prompt: "",
        text: "",
        blanks: [],
      };
    case "media":
      return { ...base };
    case "pagebreak":
      return { ...base, prompt: "" };
    default:
      return base;
  }
}

type BlockProps = {
  block: CanvasBlock;
  number: number;
  editing: boolean;
  selected: boolean;
  showAnswers: boolean;
  showDifficulty: boolean;
  onSelect: () => void;
  onEnterEdit?: () => void;
  onChange: (block: CanvasBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDragStart: () => void;
};

function BlockChrome(props: {
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="canvas-block__chrome canvas-block__actions">
        <button type="button" aria-label="Выше" onClick={(event) => { event.stopPropagation(); props.onMove(-1); }}><Icon name="arrowUp" size={16} /></button>
        <button type="button" aria-label="Ниже" onClick={(event) => { event.stopPropagation(); props.onMove(1); }}><Icon name="arrowDown" size={16} /></button>
        <button type="button" aria-label="Обновить" onClick={(event) => event.stopPropagation()}><Icon name="blink" size={16} /></button>
        <button type="button" aria-label="Дублировать" onClick={(event) => { event.stopPropagation(); props.onDuplicate(); }}><Icon name="duplicate" size={16} /></button>
        <button type="button" aria-label="Удалить" onClick={(event) => { event.stopPropagation(); props.onDelete(); }}><Icon name="trash" size={16} /></button>
      </div>
      <span className="canvas-block__chrome canvas-block__drag"><Icon name="drag" size={20} /></span>
    </>
  );
}

export function CanvasBlockView(props: BlockProps) {
  const { block, editing, selected } = props;
  const activate = (event: MouseEvent) => {
    event.stopPropagation();
    if (!editing) props.onEnterEdit?.();
    props.onSelect();
  };

  if (block.kind === "pagebreak") {
    return (
      <div
        className={[
          "canvas-pagebreak",
          selected && editing ? "is-selected" : "",
        ].filter(Boolean).join(" ")}
        onClick={activate}
        draggable={editing}
        onDragStart={props.onDragStart}
      >
        {editing && selected ? <BlockChrome onMove={props.onMove} onDuplicate={props.onDuplicate} onDelete={props.onDelete} /> : null}
        <span>Разрыв страницы</span>
      </div>
    );
  }

  return (
    <section
      className={[
        "canvas-block",
        `canvas-block--${block.kind}`,
        selected && editing ? "is-selected" : "",
      ].filter(Boolean).join(" ")}
      onClick={activate}
      draggable={editing && !(block.kind === "blanks" && selected)}
      onDragStart={(event) => {
        event.stopPropagation();
        props.onDragStart();
      }}
    >
      {editing && selected ? (
        <>
          <Wysiwyg onUnsupported={() => undefined} />
          <BlockChrome onMove={props.onMove} onDuplicate={props.onDuplicate} onDelete={props.onDelete} />
        </>
      ) : null}

      {block.kind === "text" ? (
        <EditableText
          className="canvas-text-block"
          value={block.text ?? ""}
          editing={editing && selected}
          placeholder=""
          onChange={(text) => props.onChange({ ...block, text })}
        />
      ) : (
        <>
          <Question
            block={block}
            number={props.number}
            editing={editing && selected}
            showDifficulty={props.showDifficulty}
            onChange={props.onChange}
          />
          <BlockBody {...props} />
        </>
      )}
    </section>
  );
}

function Question({
  block,
  number,
  editing,
  showDifficulty,
  onChange,
}: {
  block: CanvasBlock;
  number: number;
  editing: boolean;
  showDifficulty: boolean;
  onChange: (block: CanvasBlock) => void;
}) {
  return (
    <div className="canvas-question">
      <span>{number}.</span>
      <div>
        <EditableText
          className="canvas-question__prompt"
          value={block.prompt}
          editing={editing}
          placeholder="Введите текст"
          onChange={(prompt) => onChange({ ...block, prompt })}
        />
        {showDifficulty ? (
          <div className="canvas-difficulty">
            <span>Сложность:</span>
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                disabled={!editing}
                aria-label={`Сложность ${star}`}
                onClick={() => onChange({ ...block, difficulty: star as 1 | 2 | 3 })}
              >
                <Icon name={star <= block.difficulty ? "starOn" : "starOff"} size={16} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BlockBody(props: BlockProps) {
  const { block, editing, selected, showAnswers, onChange } = props;
  const editable = editing && selected;

  if (block.kind === "answer") {
    return (
      <div className="canvas-answer">
        {showAnswers && block.answer ? <p>{block.answer}</p> : null}
        <i /><i /><i />
      </div>
    );
  }

  if (block.kind === "single" || block.kind === "multi") {
    return (
      <div className="canvas-choice">
        {(block.options ?? []).map((option, index) => (
          <div key={index}>
            {block.kind === "single" ? (
              <Radio name={block.id} checked={showAnswers && index === 0} onChange={() => undefined} />
            ) : (
              <Checkbox checked={showAnswers && index < 2} onChange={() => undefined} />
            )}
            <EditableText
              value={option}
              editing={editable}
              placeholder="Ответ"
              onChange={(value) => onChange({
                ...block,
                options: block.options?.map((item, optionIndex) => optionIndex === index ? value : item),
              })}
            />
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "graph") {
    return (
      <div className="canvas-graphs">
        {[graph1, graph2, graph3, graph4].map((graph, index) => (
          <button key={graph} type="button" className={showAnswers && index === 2 ? "is-answer" : ""}>
            <img src={graph} alt="" /><span />
          </button>
        ))}
      </div>
    );
  }

  if (block.kind === "match") {
    return (
      <div className="canvas-match">
        {(block.pairs ?? []).map(([left, right], index) => (
          <div key={index}>
            <EditableText
              value={left}
              editing={editable}
              placeholder="Ответ"
              onChange={(value) => onChange({
                ...block,
                pairs: block.pairs?.map((pair, pairIndex) => pairIndex === index ? [value, pair[1]] : pair),
              })}
            />
            <i /><b /><i />
            <EditableText
              value={right}
              editing={editable}
              placeholder="Ответ"
              onChange={(value) => onChange({
                ...block,
                pairs: block.pairs?.map((pair, pairIndex) => pairIndex === index ? [pair[0], value] : pair),
              })}
            />
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "order") {
    return (
      <div className="canvas-order">
        {(block.items ?? []).map((item, index) => (
          <div key={index}>
            <span>{index + 1}</span>
            <EditableText
              value={item}
              editing={editable}
              placeholder="Текст"
              onChange={(value) => onChange({
                ...block,
                items: block.items?.map((row, rowIndex) => rowIndex === index ? value : row),
              })}
            />
            <Icon name="dragRow" size={20} />
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "table") {
    return (
      <div className="canvas-table">
        {(block.columns ?? []).map((column, columnIndex) => (
          <div key={columnIndex}>
            <EditableText
              value={column}
              editing={editable}
              placeholder="Название группы"
              onChange={(value) => onChange({
                ...block,
                columns: block.columns?.map((item, index) => index === columnIndex ? value : item),
              })}
            />
            {(block.rows ?? []).map((row, rowIndex) => (
              <EditableText
                key={rowIndex}
                value={row[columnIndex] ?? ""}
                editing={editable}
                placeholder=""
                onChange={(value) => onChange({
                  ...block,
                  rows: block.rows?.map((cells, index) => index === rowIndex
                    ? cells.map((cell, indexCell) => indexCell === columnIndex ? value : cell)
                    : cells),
                })}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "blanks") {
    return (
      <div className="canvas-blanks">
        <BlanksEditor
          text={block.text ?? ""}
          blanks={block.blanks ?? []}
          active={editable}
          showAnswers={showAnswers}
          onChange={(text, blanks) => onChange({ ...block, text, blanks })}
        />
      </div>
    );
  }

  if (block.kind === "media") {
    return (
      <div className="canvas-media">
        <Icon name="imagePlaceholder" size={24} />
      </div>
    );
  }

  return null;
}

function adjustTextareaHeight(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  const styles = window.getComputedStyle(element);
  // scrollHeight excludes borders, but border-box height must include them
  const borders = styles.boxSizing === "border-box"
    ? parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth)
    : 0;
  element.style.height = `${element.scrollHeight + borders}px`;
}

function EditableText({
  value,
  editing,
  placeholder,
  onChange,
  className,
}: {
  value: string;
  editing: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!editing || !textareaRef.current) return;
    adjustTextareaHeight(textareaRef.current);
  }, [editing, value]);

  if (editing) {
    return (
      <textarea
        ref={textareaRef}
        className={className}
        value={value}
        rows={1}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => adjustTextareaHeight(event.currentTarget)}
      />
    );
  }
  // keeps an empty paragraph one line tall, so selecting a block never changes its height
  return <p className={className}>{value || placeholder || "\u00a0"}</p>;
}

export function CanvasDropZone({
  active,
  onDrop,
  children,
}: {
  active: boolean;
  onDrop: () => void;
  children?: ReactNode;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={active && over ? "canvas-drop-zone is-over" : "canvas-drop-zone"}
      onDragEnter={(event) => {
        if (!active) return;
        event.preventDefault();
        setOver(true);
      }}
      onDragOver={(event) => {
        if (!active) return;
        event.preventDefault();
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        if (!active) return;
        event.preventDefault();
        event.stopPropagation();
        setOver(false);
        onDrop();
      }}
    >
      {children}
    </div>
  );
}
