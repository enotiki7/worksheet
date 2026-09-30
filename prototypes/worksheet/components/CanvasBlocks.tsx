import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import graph1 from "../assets/graph-1.png";
import graph2 from "../assets/graph-2.png";
import graph3 from "../assets/graph-3.png";
import graph4 from "../assets/graph-4.png";
import { Icon } from "./Icon";
import { Wysiwyg } from "./Wysiwyg";
import { BlanksEditor, type BlankRange } from "./BlanksEditor";
import { AnswerInput } from "./AnswerInput";
import { ChoiceOptions, createChoiceOptions } from "./ChoiceOptions";
import { EditableText } from "./EditableText";
import type { ChoiceAnswerType, ChoiceOption, TextAnswerType } from "../types";
import {
  TEXT_BLOCK_CHAR_LIMIT,
  getTextGroupId,
  getTextSegmentVisualRole,
  getTotalTextLength,
  isActiveTextSegment,
  isTextGroupSelected,
} from "../utils/textBlockGroups";

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

export type PagebreakSource = "manual" | "auto";

export type CanvasBlock = {
  id: string;
  kind: CanvasBlockKind;
  prompt: string;
  pagebreakSource?: PagebreakSource;
  text?: string;
  answer?: string;
  answerType?: TextAnswerType;
  blockHeight?: number;
  choiceAnswerType?: ChoiceAnswerType;
  shuffleOptions?: boolean;
  options?: ChoiceOption[];
  pairs?: Array<[string, string]>;
  items?: string[];
  columns?: string[];
  rows?: string[][];
  blanks?: BlankRange[];
  textGroupId?: string;
  textSegmentIndex?: number;
  difficulty: 0 | 1 | 2 | 3;
};

let blockSequence = 100;
const nextId = () => `canvas-block-${blockSequence++}`;

export const GENERATED_BLOCKS: CanvasBlock[] = [
  {
    id: "generated-choice",
    kind: "multi",
    prompt: "Какие из точек принадлежат графику уравнения x − 2y + 4 = 0?",
    choiceAnswerType: "Текст",
    shuffleOptions: true,
    options: [
      { id: "generated-opt-1", text: "A(0; 2)", correct: true },
      { id: "generated-opt-2", text: "B(2; 3)", correct: true },
      { id: "generated-opt-3", text: "C(−4; 0)", correct: false },
      { id: "generated-opt-4", text: "D(4; 0)", correct: false },
    ],
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
  const base = { id: nextId(), kind, prompt: "", difficulty: 0 as const };
  switch (kind) {
    case "text":
      return { ...base, text: "", textGroupId: base.id, textSegmentIndex: 0 };
    case "answer":
      return { ...base, answer: "", answerType: "Линии", blockHeight: 2 };
    case "single":
    case "multi":
      return {
        ...base,
        choiceAnswerType: "Текст",
        shuffleOptions: true,
        options: createChoiceOptions(kind),
      };
    case "match":
      return { ...base, pairs: [["", ""], ["", ""], ["", ""]] };
    case "order":
      return { ...base, items: ["", "", "", "", ""] };
    case "table":
      return {
        ...base,
        columns: ["", "", ""],
        rows: Array.from({ length: 4 }, () => ["", "", ""]),
      };
    case "blanks":
      return {
        ...base,
        text: "",
        blanks: [],
      };
    case "media":
      return { ...base };
    case "pagebreak":
      return { ...base, pagebreakSource: "manual" };
    default:
      return base;
  }
}

type BlockProps = {
  block: CanvasBlock;
  allBlocks: CanvasBlock[];
  number: number;
  editing: boolean;
  selectedBlockId: string | null;
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

function PageBreakChrome(props: { onDelete: () => void }) {
  return (
    <div className="canvas-block__chrome canvas-block__actions">
      <button
        type="button"
        aria-label="Удалить"
        onClick={(event) => {
          event.stopPropagation();
          props.onDelete();
        }}
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}

export function CanvasBlockView(props: BlockProps) {
  const { block, allBlocks, editing, selectedBlockId } = props;
  const activate = (event: MouseEvent) => {
    event.stopPropagation();
    if (!editing) props.onEnterEdit?.();
    props.onSelect();
  };

  const isTextBlock = block.kind === "text";
  const isActiveSegment = isTextBlock ? isActiveTextSegment(allBlocks, block) : false;
  const textGroupId = isTextBlock ? getTextGroupId(block) : null;
  const textRole = isTextBlock ? getTextSegmentVisualRole(allBlocks, block) : null;
  const groupSelected = Boolean(
    textGroupId && isTextGroupSelected(allBlocks, textGroupId, selectedBlockId),
  );
  const selected = isTextBlock ? groupSelected : block.id === selectedBlockId;
  const otherSegmentsLength = textGroupId
    ? getTotalTextLength(allBlocks, textGroupId) - (block.text?.length ?? 0)
    : 0;
  const textCharBudget = TEXT_BLOCK_CHAR_LIMIT - otherSegmentsLength;
  const showWidgetChrome = isTextBlock
    ? editing && groupSelected && Boolean(textRole?.isFirst)
    : editing && block.id === selectedBlockId;
  const textWidgetClasses = textRole ? [
    textRole.isFirst && textRole.isLast ? "is-text-widget-only" : "",
    textRole.isFirst && !textRole.isLast ? "is-text-widget-start" : "",
    !textRole.isFirst ? "is-text-widget-continue" : "",
    textRole.continuesToNextPage ? "is-text-widget-overflow" : "",
    groupSelected && editing ? "is-text-group-selected" : "",
  ].filter(Boolean) : [];

  if (block.kind === "pagebreak") {
    return (
      <div
        className={[
          "canvas-pagebreak",
          block.id === selectedBlockId && editing ? "is-selected" : "",
        ].filter(Boolean).join(" ")}
        role="separator"
        aria-label="Разрыв страницы"
        onClick={activate}
        draggable={editing}
        onDragStart={(event) => {
          event.stopPropagation();
          props.onDragStart();
        }}
      >
        {editing && selected ? <PageBreakChrome onDelete={props.onDelete} /> : null}
      </div>
    );
  }

  return (
    <section
      className={[
        "canvas-block",
        `canvas-block--${block.kind}`,
        ...textWidgetClasses,
        selected && editing && !isTextBlock ? "is-selected" : "",
      ].filter(Boolean).join(" ")}
      onClick={activate}
      draggable={
        editing
        && (!isTextBlock || Boolean(textRole?.isFirst))
        && !(block.kind === "blanks" && selected)
      }
      onDragStart={(event) => {
        event.stopPropagation();
        props.onDragStart();
      }}
    >
      {showWidgetChrome ? (
        <>
          <Wysiwyg onUnsupported={() => undefined} />
          <BlockChrome onMove={props.onMove} onDuplicate={props.onDuplicate} onDelete={props.onDelete} />
        </>
      ) : null}

      {block.kind === "text" ? (
        <EditableText
          className="canvas-text-block"
          value={block.text ?? ""}
          editing={editing && groupSelected && isActiveSegment}
          readOnly={editing && (!groupSelected || !isActiveSegment)}
          placeholder="Введите текст"
          maxLength={textCharBudget}
          onChange={(text) => props.onChange({ ...block, text: text.slice(0, textCharBudget) })}
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
  const { block, editing, selectedBlockId, showAnswers, onChange } = props;
  const selected = block.id === selectedBlockId;
  const editable = editing && selected;

  if (block.kind === "answer") {
    const promptEditing = editing && selected;
    return (
      <AnswerInput
        answerType={block.answerType ?? "Линии"}
        blockHeight={block.blockHeight ?? 2}
        value={block.answer ?? ""}
        onChange={(answer) => onChange({ ...block, answer })}
        interactive={!promptEditing}
        showAnswer={showAnswers}
        persistChanges={editing}
      />
    );
  }

  if (block.kind === "single" || block.kind === "multi") {
    return (
      <ChoiceOptions
        kind={block.kind}
        choiceAnswerType={block.choiceAnswerType ?? "Текст"}
        options={block.options ?? []}
        editable={editable}
        showAnswers={showAnswers}
        shuffleOptions={block.shuffleOptions ?? true}
        blockId={block.id}
        onChange={(options) => onChange({ ...block, options })}
      />
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
