import { Button, Input, Select } from "@company/ui";
import "./CreateWorksheetModal.css";

export type ModalMode = "generate" | "manual";

export const SUBJECTS = ["Алгебра", "Русский язык", "История", "Биология"].map((label) => ({
  label,
  value: label,
}));
export const GRADES = ["5", "6", "7", "8", "9"].map((value) => ({ label: value, value }));
const COUNTS = ["3", "4", "5", "6", "7"].map((value) => ({ label: value, value }));

export type CreateWorksheetModalProps = {
  mode: ModalMode;
  advanced: boolean;
  subject: string;
  grade: string;
  count: string;
  topic: string;
  wishes: string;
  manualSubject: string;
  manualGrade: string;
  manualTopic: string;
  onModeChange: (mode: ModalMode) => void;
  onAdvancedChange: (value: boolean) => void;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onCountChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onWishesChange: (value: string) => void;
  onManualSubjectChange: (value: string) => void;
  onManualGradeChange: (value: string) => void;
  onManualTopicChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function CreateWorksheetModal(props: CreateWorksheetModalProps) {
  return (
    <div className="new-modal-backdrop" role="presentation" onClick={props.onClose}>
      <section className="new-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onClick={(e) => e.stopPropagation()}>
        <aside className="new-modal__nav">
          <h2 id="create-title">Создание<br />рабочего листа</h2>
          <button className={props.mode === "generate" ? "is-active" : ""} onClick={() => props.onModeChange("generate")}>
            Сгенерировать
          </button>
          <button className={props.mode === "manual" ? "is-active" : ""} onClick={() => props.onModeChange("manual")}>
            Создать вручную
          </button>
        </aside>
        <div className="new-modal__content">
          <button className="new-modal__close" aria-label="Закрыть" onClick={props.onClose}>×</button>
          {props.mode === "manual" ? (
            <div className="new-modal__manual">
              <div className="new-modal__row">
                <Select
                  label="Предмет"
                  value={props.manualSubject}
                  placeholder="Выберите предмет"
                  options={SUBJECTS}
                  onChange={props.onManualSubjectChange}
                />
                <Select
                  label="Параллель"
                  value={props.manualGrade}
                  placeholder="Выберите параллель"
                  options={GRADES}
                  onChange={props.onManualGradeChange}
                />
              </div>
              <Input
                label="Тема рабочего листа*"
                value={props.manualTopic}
                placeholder="Например, умножение дробей"
                onChange={(e) => props.onManualTopicChange(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="new-modal__row new-modal__row--three">
                <Select label="Предмет*" value={props.subject} options={SUBJECTS} onChange={props.onSubjectChange} />
                <Select label="Параллель*" value={props.grade} options={GRADES} onChange={props.onGradeChange} />
                <Select label="Количество заданий" value={props.count} options={COUNTS} onChange={props.onCountChange} />
              </div>
              <Input label="Тема рабочего листа*" value={props.topic} onChange={(e) => props.onTopicChange(e.target.value)} />
              <label className="new-modal__textarea">
                <span>Пожелания</span>
                <textarea
                  value={props.wishes}
                  maxLength={2000}
                  placeholder="Особенности группы, акценты, ограничение по времени, опорный материал..."
                  onChange={(e) => props.onWishesChange(e.target.value)}
                />
                <small>{props.wishes.length}/2000</small>
              </label>
              <div className="new-modal__upload">
                <strong>Перетащите сюда файл или выберите на компьютере</strong>
                <span>Файл не должен весить больше 10 Мб.<br />Формат — docx, pdf, jpg, png</span>
                <Button variant="secondary" size="medium">Выбрать файл</Button>
              </div>
              <button className="new-modal__advanced" onClick={() => props.onAdvancedChange(!props.advanced)}>
                ⚙ {props.advanced ? "Скрыть" : "Показать"} расширенные настройки
              </button>
              {props.advanced ? <TaskPlan /> : null}
            </>
          )}
          <footer className="new-modal__actions">
            <Button variant="secondary" onClick={props.onClose}>Отменить</Button>
            <Button onClick={props.onSubmit} disabled={props.mode === "manual" && props.manualTopic.trim() === ""}>
              Создать
            </Button>
          </footer>
        </div>
      </section>
    </div>
  );
}

function TaskPlan() {
  const rows = [
    ["Множественный выбор", "Принадлежность точек графику"],
    ["Множественный выбор", "Показать графики и принадлежность точек графику"],
    ["Сопоставление", "Сопоставить уравнения"],
    ["Заполнение пропусков", "Заполнить пропуски в уравнении вида y = kx + b"],
  ];
  return (
    <section className="new-task-plan">
      <header><strong>Порядок заданий</strong><button>✧ Сгенерировать план</button></header>
      {rows.map(([type, text], index) => (
        <div className="new-task-plan__row" key={type}>
          <span>{index + 1}.</span>
          <div>{type}　⌄</div>
          <div>{text}</div>
          <button aria-label="Удалить">×</button>
          <span>⠿</span>
        </div>
      ))}
    </section>
  );
}
