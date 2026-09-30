import type { LessonState, WorksheetTask } from "../types";
import { WButton, WField, WInput, WTextarea } from "../components/wire";

export function MaterialEditor({
  lesson,
  materialId,
  onWorksheetChange,
  onSave,
  onBack,
  backLabel = "К комплекту",
}: {
  lesson: LessonState;
  materialId: string;
  onWorksheetChange: (patch: Partial<LessonState["worksheet"]> & { resultChanged?: boolean }) => void;
  onSave: () => void;
  onBack: () => void;
  backLabel?: string;
}) {
  const material = lesson.materials.find((item) => item.id === materialId);
  const isWorksheet = materialId === "m-worksheet";
  const stage = lesson.stages.find((item) => item.id === lesson.worksheet.stageId);
  const result = lesson.plannedResults.find((item) => item.id === lesson.worksheet.resultId);

  if (!isWorksheet) {
    return (
      <div>
        <h1 className="wf-h1">{material?.title ?? "Материал"}</h1>
        <p className="wf-lead">
          Упрощенный просмотр. Полноценный редактор презентаций в прототип не входит. Можно заменить или доработать с AI.
        </p>
        <div className="wf-preview" style={{ minHeight: 220 }}>
          {(material?.preview ?? []).map((line) => (
            <div key={line}>{line}</div>
          ))}
          <div>Связь: {material?.stageTitle}</div>
          <div>Получатель: {material?.audience === "teacher" ? "учитель" : "ученики"}</div>
        </div>
        <div className="wf-footer-actions">
          <WButton onClick={onBack}>{backLabel}</WButton>
        </div>
      </div>
    );
  }

  const updateTask = (id: string, patch: Partial<WorksheetTask>) => {
    onWorksheetChange({
      tasks: lesson.worksheet.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    });
  };

  return (
    <div>
      <h1 className="wf-h1">{lesson.worksheet.title}</h1>
      <p className="wf-lead">
        Связь: этап «{stage?.title}», результат «{result?.text}». Правки текста сохраняются как ручные изменения.
      </p>
      <div className="wf-stack">
        <WField label="Название">
          <WInput value={lesson.worksheet.title} onChange={(event) => onWorksheetChange({ title: event.target.value })} />
        </WField>
        <WField label="Инструкция ученику">
          <WTextarea
            value={lesson.worksheet.studentInstruction}
            onChange={(event) => onWorksheetChange({ studentInstruction: event.target.value })}
          />
        </WField>
        {lesson.worksheet.tasks.map((task, index) => (
          <div className="wf-card" key={task.id}>
            <p className="wf-card-kicker">Задание {index + 1}</p>
            <WTextarea value={task.prompt} onChange={(event) => updateTask(task.id, { prompt: event.target.value })} />
            <div className="wf-row" style={{ marginTop: 8 }}>
              <WButton
                variant="ghost"
                onClick={() =>
                  onWorksheetChange({
                    tasks: lesson.worksheet.tasks.filter((item) => item.id !== task.id),
                    resultChanged: true,
                  })
                }
              >
                Удалить задание
              </WButton>
              <WButton variant="ghost" onClick={() => updateTask(task.id, { support: "Подсказка: сначала назовите, что известно, а что нужно найти." })}>
                Вариант с поддержкой
              </WButton>
              <WButton variant="ghost" onClick={() => updateTask(task.id, { challenge: true, prompt: `${task.prompt} Составьте ещё одно уравнение по тексту.` })}>
                Повышенная сложность
              </WButton>
            </div>
          </div>
        ))}
        <WButton
          variant="secondary"
          onClick={() =>
            onWorksheetChange({
              tasks: [
                ...lesson.worksheet.tasks,
                { id: `t-${lesson.worksheet.tasks.length + 1}`, prompt: "Новое задание" },
              ],
              resultChanged: true,
            })
          }
        >
          Добавить задание
        </WButton>
        <WField label="Ожидаемое время, мин">
          <WInput
            type="number"
            value={lesson.worksheet.expectedMinutes}
            onChange={(event) => onWorksheetChange({ expectedMinutes: Number(event.target.value) || 12 })}
          />
        </WField>
        <div className="wf-card">
          <p className="wf-card-title">Критерии</p>
          <ul className="wf-list">
            {lesson.worksheet.criteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <WField label="Связанный результат" hint="Если изменить, система спросит про обновление плана и критериев.">
          <select
            className="wf-select"
            value={lesson.worksheet.resultId}
            onChange={(event) => onWorksheetChange({ resultId: event.target.value, resultChanged: true })}
          >
            {lesson.plannedResults.map((item) => (
              <option key={item.id} value={item.id}>
                {item.text}
              </option>
            ))}
          </select>
        </WField>
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onSave}>Сохранить рабочий лист</WButton>
        <WButton variant="ghost" onClick={onBack}>
          {backLabel}
        </WButton>
      </div>
    </div>
  );
}
