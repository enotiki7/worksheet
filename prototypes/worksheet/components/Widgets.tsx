import { Checkbox, Radio } from "@company/ui";
import type {
  ChoiceTask,
  MatchTask,
  OrderTask,
  Task,
  TextTask,
} from "../types";
import { AnswerArea } from "./AnswerArea";
import { Icon } from "./Icon";
import { Wysiwyg } from "./Wysiwyg";

type WidgetProps = {
  task: Task;
  index: number;
  selected: boolean;
  preview: boolean;
  showAnswers: boolean;
  showDifficulty: boolean;
  onSelect: () => void;
  onChange: (task: Task) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUnsupported: (label: string) => void;
};

export function TaskWidget(props: WidgetProps) {
  const { task, selected, preview, onSelect } = props;

  return (
    <article
      className={selected && !preview ? "ws-widget is-selected" : "ws-widget"}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {selected && !preview ? (
        <>
          <Wysiwyg onUnsupported={props.onUnsupported} />
          <div className="ws-widget__actions">
            <button type="button" aria-label="Выше" onClick={() => props.onMove(-1)}>
              <Icon name="arrowUp" size={16} />
            </button>
            <button type="button" aria-label="Ниже" onClick={() => props.onMove(1)}>
              <Icon name="arrowDown" size={16} />
            </button>
            <button type="button" aria-label="Перемешать" onClick={() => props.onUnsupported("Перемешать")}>
              <Icon name="blink" size={16} />
            </button>
            <button type="button" aria-label="Дублировать" onClick={props.onDuplicate}>
              <Icon name="duplicate" size={16} />
            </button>
            <button type="button" aria-label="Удалить" onClick={props.onDelete}>
              <Icon name="trash" size={16} />
            </button>
          </div>
          <span className="ws-widget__drag">
            <Icon name="drag" size={20} />
          </span>
        </>
      ) : null}

      <QuestionHeader
        index={props.index}
        prompt={task.prompt}
        difficulty={task.difficulty}
        showDifficulty={props.showDifficulty}
        editable={selected && !preview}
        onPromptChange={(prompt) => props.onChange({ ...task, prompt })}
        onDifficultyChange={(difficulty) => props.onChange({ ...task, difficulty })}
      />

      {task.kind === "text" ? (
        <TextBody task={task} showAnswers={props.showAnswers} selected={selected && !preview} onChange={props.onChange} />
      ) : null}
      {task.kind === "single" || task.kind === "multi" ? (
        <ChoiceBody task={task} selected={selected && !preview} onChange={props.onChange} />
      ) : null}
      {task.kind === "match" ? (
        <MatchBody task={task} selected={selected && !preview} onChange={props.onChange} />
      ) : null}
      {task.kind === "order" ? (
        <OrderBody task={task} selected={selected && !preview} onChange={props.onChange} />
      ) : null}
    </article>
  );
}

function QuestionHeader({
  index,
  prompt,
  difficulty,
  showDifficulty,
  editable,
  onPromptChange,
  onDifficultyChange,
}: {
  index: number;
  prompt: string;
  difficulty: 0 | 1 | 2 | 3;
  showDifficulty: boolean;
  editable: boolean;
  onPromptChange: (value: string) => void;
  onDifficultyChange: (value: 0 | 1 | 2 | 3) => void;
}) {
  return (
    <div className="ws-question">
      <span className="ws-question__index">{index}.</span>
      <div className="ws-question__body">
        {editable ? (
          <textarea
            className="ws-inline"
            rows={1}
            placeholder="Введите текст"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
          />
        ) : (
          <p className={prompt ? "ws-question__text" : "ws-question__text is-placeholder"}>
            {prompt || "Введите текст"}
          </p>
        )}
        {showDifficulty ? (
          <div className="ws-difficulty">
            <span>Сложность:</span>
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                className="ws-difficulty__star"
                aria-label={`Сложность ${star}`}
                disabled={!editable}
                onClick={() =>
                  onDifficultyChange(
                    (difficulty === star ? 0 : star) as 0 | 1 | 2 | 3,
                  )
                }
              >
                <Icon name={star <= difficulty ? "starOn" : "starOff"} size={16} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TextBody({
  task,
  showAnswers,
  selected,
  onChange,
}: {
  task: TextTask;
  showAnswers: boolean;
  selected: boolean;
  onChange: (task: Task) => void;
}) {
  return (
    <div className="ws-answer">
      <p className="ws-answer__label">Ответ:</p>
      {selected ? (
        <textarea
          className="ws-inline ws-inline--answer"
          rows={1}
          placeholder="Введите ответ"
          value={task.answer}
          onChange={(event) => onChange({ ...task, answer: event.target.value })}
        />
      ) : null}
      {showAnswers && task.answer && !selected ? (
        <p className="ws-answer__value">{task.answer}</p>
      ) : null}
      <AnswerArea type={task.answerType} height={task.blockHeight} />
    </div>
  );
}

function ChoiceBody({
  task,
  selected,
  onChange,
}: {
  task: ChoiceTask;
  selected: boolean;
  onChange: (task: ChoiceTask) => void;
}) {
  const withImage = task.answerType !== "Текст";
  const withCaption = task.answerType !== "Картинка";

  return (
    <div className={withImage ? "ws-choice-grid" : "ws-choice-list"}>
      {task.options.map((option, index) => {
        const control =
          task.kind === "multi" ? (
            <Checkbox
              checked={option.correct}
              onChange={(correct) =>
                onChange({
                  ...task,
                  options: task.options.map((item) =>
                    item.id === option.id ? { ...item, correct } : item,
                  ),
                })
              }
            />
          ) : (
            <Radio
              name={task.id}
              checked={option.correct}
              onChange={() =>
                onChange({
                  ...task,
                  options: task.options.map((item) => ({
                    ...item,
                    correct: item.id === option.id,
                  })),
                })
              }
            />
          );

        if (withImage) {
          return (
            <div key={option.id} className="ws-image-answer">
              <div className="ws-image-answer__media">
                <Icon name="imagePlaceholder" size={20} />
                <span className="ws-image-answer__check">{control}</span>
              </div>
              {withCaption ? (
                selected ? (
                  <textarea
                    className="ws-inline"
                    rows={1}
                    placeholder={`Ответ ${index + 1}`}
                    value={option.text}
                    onChange={(event) =>
                      onChange({
                        ...task,
                        options: task.options.map((item) =>
                          item.id === option.id ? { ...item, text: event.target.value } : item,
                        ),
                      })
                    }
                  />
                ) : (
                  <p>{option.text || `Ответ ${index + 1}`}</p>
                )
              ) : null}
            </div>
          );
        }

        return (
          <div key={option.id} className="ws-choice-row">
            {control}
            {selected ? (
              <textarea
                className="ws-inline"
                rows={1}
                placeholder={`Ответ ${index + 1}`}
                value={option.text}
                onChange={(event) =>
                  onChange({
                    ...task,
                    options: task.options.map((item) =>
                      item.id === option.id ? { ...item, text: event.target.value } : item,
                    ),
                  })
                }
              />
            ) : (
              <p>{option.text || `Ответ ${index + 1}`}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MatchBody({
  task,
  selected,
  onChange,
}: {
  task: MatchTask;
  selected: boolean;
  onChange: (task: MatchTask) => void;
}) {
  const right = task.shuffleRight ? [...task.pairs].reverse() : task.pairs;

  return (
    <div className="ws-match">
      {task.pairs.map((pair, index) => {
        const rightPair = right[index];
        return (
          <div key={pair.id} className="ws-match__row">
            <MatchCell
              type={task.leftColumn}
              value={pair.left}
              editable={selected}
              onChange={(left) =>
                onChange({
                  ...task,
                  pairs: task.pairs.map((item) => (item.id === pair.id ? { ...item, left } : item)),
                })
              }
            />
            <Radio checked onChange={() => undefined} />
            <span className="ws-match__line" />
            <Radio checked onChange={() => undefined} />
            <MatchCell
              type={task.rightColumn}
              value={rightPair.right}
              editable={selected && !task.shuffleRight}
              onChange={(value) =>
                onChange({
                  ...task,
                  pairs: task.pairs.map((item) =>
                    item.id === rightPair.id ? { ...item, right: value } : item,
                  ),
                })
              }
            />
          </div>
        );
      })}
    </div>
  );
}

function MatchCell({
  type,
  value,
  editable,
  onChange,
}: {
  type: "Текст" | "Картинка";
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}) {
  if (type === "Картинка") {
    return (
      <div className="ws-match__card ws-match__card--image">
        <Icon name="imagePlaceholder" size={20} />
      </div>
    );
  }

  return (
    <div className="ws-match__card">
      {editable ? (
        <textarea
          className="ws-inline"
          rows={1}
          placeholder="Ответ"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <p>{value || "Ответ"}</p>
      )}
    </div>
  );
}

function OrderBody({
  task,
  selected,
  onChange,
}: {
  task: OrderTask;
  selected: boolean;
  onChange: (task: OrderTask) => void;
}) {
  const items = task.shuffle ? [...task.items].reverse() : task.items;

  return (
    <div className="ws-order">
      {items.map((item, index) => (
        <div key={item.id} className="ws-order__row">
          <span className="ws-order__num">{index + 1}</span>
          <div className="ws-order__cell">
            {selected ? (
              <textarea
                className="ws-inline"
                rows={1}
                placeholder="Текст"
                value={item.text}
                onChange={(event) =>
                  onChange({
                    ...task,
                    items: task.items.map((row) =>
                      row.id === item.id ? { ...row, text: event.target.value } : row,
                    ),
                  })
                }
              />
            ) : (
              <p>{item.text || "Текст"}</p>
            )}
            <span className="ws-order__handle">
              <Icon name="dragRow" size={20} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
