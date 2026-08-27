import { Input, Select, Switch } from "@company/ui";
import {
  CHOICE_ANSWER_TYPES,
  COLUMN_TYPES,
  ORDER_ANSWER_TYPES,
  TEXT_ANSWER_TYPES,
  type ChoiceTask,
  type MatchTask,
  type OrderTask,
  type Task,
  type TextTask,
  type Worksheet,
} from "../types";
import { GRADES, SUBJECTS, uid } from "../mock";

type SettingsPanelProps = {
  worksheet: Worksheet;
  selected: Task | undefined;
  onWorksheetChange: (patch: Partial<Worksheet>) => void;
  onTaskChange: (task: Task) => void;
};

export function SettingsPanel({
  worksheet,
  selected,
  onWorksheetChange,
  onTaskChange,
}: SettingsPanelProps) {
  if (!selected) {
    return (
      <aside className="ws-settings">
        <p className="ws-settings__title">Настройки рабочего листа</p>
        <div className="ws-settings__field">
          <Select
            placeholder="Выберите предмет"
            value={worksheet.subject}
            options={SUBJECTS.map((item) => ({ value: item, label: item }))}
            onChange={(subject) => onWorksheetChange({ subject })}
          />
        </div>
        <div className="ws-settings__field">
          <Select
            placeholder="Выберите параллель"
            value={worksheet.grade}
            options={GRADES.map((item) => ({ value: item, label: item }))}
            onChange={(grade) => onWorksheetChange({ grade })}
          />
        </div>
        <div className="ws-settings__switch">
          <Switch
            label="Показать ответы"
            checked={worksheet.showAnswers}
            onChange={(showAnswers) => onWorksheetChange({ showAnswers })}
          />
        </div>
        <div className="ws-settings__switch">
          <Switch
            label="Показывать сложность"
            checked={worksheet.showDifficulty}
            onChange={(showDifficulty) => onWorksheetChange({ showDifficulty })}
          />
        </div>
        <div className="ws-settings__rule" />
      </aside>
    );
  }

  return (
    <aside className="ws-settings">
      <p className="ws-settings__title">Настройки задания</p>
      {selected.kind === "text" ? (
        <TextSettings task={selected} onChange={onTaskChange} />
      ) : null}
      {selected.kind === "single" || selected.kind === "multi" ? (
        <ChoiceSettings task={selected} onChange={onTaskChange} />
      ) : null}
      {selected.kind === "match" ? <MatchSettings task={selected} onChange={onTaskChange} /> : null}
      {selected.kind === "order" ? <OrderSettings task={selected} onChange={onTaskChange} /> : null}
    </aside>
  );
}

function TextSettings({ task, onChange }: { task: TextTask; onChange: (task: Task) => void }) {
  return (
    <>
      <div className="ws-settings__field">
        <Select
          label="Тип ответов"
          value={task.answerType}
          options={TEXT_ANSWER_TYPES.map((item) => ({ value: item, label: item }))}
          onChange={(answerType) =>
            onChange({ ...task, answerType: answerType as TextTask["answerType"] })
          }
        />
      </div>
      <div className="ws-settings__field">
        <Input
          label="Высота блока"
          type="number"
          min={1}
          max={8}
          value={task.blockHeight}
          onChange={(event) =>
            onChange({ ...task, blockHeight: Math.max(1, Number(event.target.value) || 1) })
          }
        />
      </div>
    </>
  );
}

function ChoiceSettings({
  task,
  onChange,
}: {
  task: ChoiceTask;
  onChange: (task: Task) => void;
}) {
  return (
    <>
      <div className="ws-settings__field">
        <Select
          label="Тип ответов"
          value={task.answerType}
          options={CHOICE_ANSWER_TYPES.map((item) => ({ value: item, label: item }))}
          onChange={(answerType) =>
            onChange({ ...task, answerType: answerType as ChoiceTask["answerType"] })
          }
        />
      </div>
      <div className="ws-settings__field">
        <Input
          label="Количество ответов"
          type="number"
          min={2}
          max={8}
          value={task.options.length}
          onChange={(event) => {
            const count = Math.max(2, Math.min(8, Number(event.target.value) || 2));
            const options = [...task.options];
            while (options.length < count) {
              options.push({ id: uid(), text: "", correct: false });
            }
            onChange({ ...task, options: options.slice(0, count) });
          }}
        />
      </div>
    </>
  );
}

function MatchSettings({ task, onChange }: { task: MatchTask; onChange: (task: Task) => void }) {
  return (
    <>
      <div className="ws-settings__field">
        <Select
          label="Левая колонка"
          value={task.leftColumn}
          options={COLUMN_TYPES.map((item) => ({ value: item, label: item }))}
          onChange={(leftColumn) =>
            onChange({ ...task, leftColumn: leftColumn as MatchTask["leftColumn"] })
          }
        />
      </div>
      <div className="ws-settings__field">
        <Select
          label="Правая колонка"
          value={task.rightColumn}
          options={COLUMN_TYPES.map((item) => ({ value: item, label: item }))}
          onChange={(rightColumn) =>
            onChange({ ...task, rightColumn: rightColumn as MatchTask["rightColumn"] })
          }
        />
      </div>
      <div className="ws-settings__field">
        <Input
          label="Количество пар"
          type="number"
          min={2}
          max={8}
          value={task.pairs.length}
          onChange={(event) => {
            const count = Math.max(2, Math.min(8, Number(event.target.value) || 2));
            const pairs = [...task.pairs];
            while (pairs.length < count) {
              pairs.push({ id: uid(), left: "", right: "" });
            }
            onChange({ ...task, pairs: pairs.slice(0, count) });
          }}
        />
      </div>
      <div className="ws-settings__switch">
        <Switch
          label="Перемешать правую колонку"
          checked={task.shuffleRight}
          onChange={(shuffleRight) => onChange({ ...task, shuffleRight })}
        />
      </div>
    </>
  );
}

function OrderSettings({ task, onChange }: { task: OrderTask; onChange: (task: Task) => void }) {
  return (
    <>
      <div className="ws-settings__field">
        <Select
          label="Тип ответов"
          value={task.answerType}
          options={ORDER_ANSWER_TYPES.map((item) => ({ value: item, label: item }))}
          onChange={(answerType) =>
            onChange({ ...task, answerType: answerType as OrderTask["answerType"] })
          }
        />
      </div>
      <div className="ws-settings__field">
        <Input
          label="Количество строк"
          type="number"
          min={2}
          max={10}
          value={task.items.length}
          onChange={(event) => {
            const count = Math.max(2, Math.min(10, Number(event.target.value) || 2));
            const items = [...task.items];
            while (items.length < count) {
              items.push({ id: uid(), text: "" });
            }
            onChange({ ...task, items: items.slice(0, count) });
          }}
        />
      </div>
      <div className="ws-settings__switch">
        <Switch
          label="Перемешать ответы"
          checked={task.shuffle}
          onChange={(shuffle) => onChange({ ...task, shuffle })}
        />
      </div>
    </>
  );
}
