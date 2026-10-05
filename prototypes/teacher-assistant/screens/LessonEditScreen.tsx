import { ExistingMaterialsPanel } from "../components/ExistingMaterialsPanel";
import { MaterialGenerationCards } from "../components/MaterialGenerationCards";
import { LESSON_TYPES, regenerateLessonPlan } from "../lessonContent";
import { EditableBlock, WireWysiwyg } from "../components/WireWysiwyg";
import { WireAiPanel } from "../components/WireAiPanel";
import { WButton, WChip } from "../components/wire";
import type { LessonContent, LessonStep, LessonType, LibraryMaterial, MaterialId } from "../types";

type Props = {
  topic: string;
  content: LessonContent;
  lessonType: LessonType;
  onLessonType: (value: LessonType) => void;
  onChange: (content: LessonContent) => void;
  onBack: () => void;
  onGeneratePlan: () => void;
  onGenerateMaterials: () => void;
  libraryMaterials?: LibraryMaterial[];
  attachedLibraryIds?: string[];
  showLibraryAttach?: boolean;
  onToggleLibrary?: (id: string) => void;
};

export function LessonEditScreen({
  topic,
  content,
  lessonType,
  onLessonType,
  onChange,
  onBack,
  onGeneratePlan,
  onGenerateMaterials,
  libraryMaterials,
  attachedLibraryIds = [],
  showLibraryAttach,
  onToggleLibrary,
}: Props) {
  const updateStep = (id: string, patch: Partial<LessonStep>) => {
    onChange({
      ...content,
      steps: content.steps.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    });
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const next = [...content.steps];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...content, steps: next });
  };

  const deleteStep = (id: string) => {
    onChange({ ...content, steps: content.steps.filter((step) => step.id !== id) });
  };

  const regenerateStep = (id: string) => {
    updateStep(id, { goal: "Обновлённая формулировка цели этапа (ИИ)." });
  };

  const toggleMaterial = (id: MaterialId, checked: boolean) => {
    onChange({ ...content, materials: { ...content.materials, [id]: checked } });
  };

  const updateListItem = (list: "goals" | "tasks", index: number, value: string) => {
    const copy = [...content[list]];
    copy[index] = value;
    onChange({ ...content, [list]: copy });
  };

  const handleGeneratePlan = () => {
    onChange(regenerateLessonPlan(content, topic));
    onGeneratePlan();
  };

  return (
    <div className="ta-edit">
      <header className="ta-edit__header">
        <div>
          <p className="wf-kicker">Редактирование урока</p>
          <h1 className="wf-title">{topic}</h1>
        </div>
        <div className="ta-edit__actions">
          <WButton variant="ghost" onClick={onBack}>
            Назад
          </WButton>
          <WButton variant="secondary" onClick={handleGeneratePlan}>
            Сгенерировать план урока
          </WButton>
        </div>
      </header>

      <div className="ta-edit__layout">
        <div className="ta-edit__main">
          <section className="ta-section">
            <h2 className="ta-section__title">Тип урока</h2>
            <div className="wf-row">
              {LESSON_TYPES.map((item) => (
                <WChip key={item.id} selected={lessonType === item.id} onClick={() => onLessonType(item.id)}>
                  {item.label}
                </WChip>
              ))}
            </div>
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Цели урока</h2>
            {content.goals.map((goal, index) => (
              <WireWysiwyg key={`goal-${index}`}>
                <EditableBlock html={goal} onChange={(value) => updateListItem("goals", index, value)} multiline />
              </WireWysiwyg>
            ))}
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Задачи урока</h2>
            {content.tasks.map((task, index) => (
              <WireWysiwyg key={`task-${index}`}>
                <EditableBlock html={task} onChange={(value) => updateListItem("tasks", index, value)} multiline />
              </WireWysiwyg>
            ))}
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Ключевые результаты</h2>
            {content.results.map((block, blockIndex) => (
              <div key={block.label} className="ta-result-block">
                <p className="ta-result-block__label">{block.label}</p>
                {block.items.map((item, itemIndex) => (
                  <WireWysiwyg key={`${block.label}-${itemIndex}`}>
                    <EditableBlock
                      html={item}
                      onChange={(value) => {
                        const results = content.results.map((entry, idx) =>
                          idx === blockIndex
                            ? {
                                ...entry,
                                items: entry.items.map((line, lineIdx) => (lineIdx === itemIndex ? value : line)),
                              }
                            : entry,
                        );
                        onChange({ ...content, results });
                      }}
                      multiline
                    />
                  </WireWysiwyg>
                ))}
              </div>
            ))}
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">План урока</h2>
            <ul className="ta-steps">
              {content.steps.map((step, index) => (
                <li key={step.id} className="ta-step">
                  <div className="ta-step__head">
                    <span className="ta-step__num">{index + 1}</span>
                    <input
                      className="ta-step__title"
                      value={step.title}
                      onChange={(event) => updateStep(step.id, { title: event.target.value })}
                    />
                    <label className="ta-step__time">
                      <input
                        type="number"
                        min={1}
                        max={45}
                        value={step.minutes}
                        onChange={(event) => updateStep(step.id, { minutes: Number(event.target.value) || 1 })}
                      />
                      мин
                    </label>
                  </div>
                  <WireWysiwyg label="Цель этапа">
                    <EditableBlock
                      html={step.goal}
                      onChange={(value) => updateStep(step.id, { goal: value })}
                      multiline
                    />
                  </WireWysiwyg>
                  <div className="ta-step__controls">
                    <WButton variant="ghost" onClick={() => moveStep(index, -1)} disabled={index === 0}>
                      ↑
                    </WButton>
                    <WButton variant="ghost" onClick={() => moveStep(index, 1)} disabled={index === content.steps.length - 1}>
                      ↓
                    </WButton>
                    <WButton variant="ghost" onClick={() => regenerateStep(step.id)}>
                      Перегенерировать
                    </WButton>
                    <WButton variant="ghost" onClick={() => deleteStep(step.id)}>
                      Удалить
                    </WButton>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Вопросы для рефлексии</h2>
            {content.reflection.map((question, index) => (
              <WireWysiwyg key={`refl-${index}`}>
                <EditableBlock
                  html={question}
                  onChange={(value) => {
                    const reflection = [...content.reflection];
                    reflection[index] = value;
                    onChange({ ...content, reflection });
                  }}
                  multiline
                />
              </WireWysiwyg>
            ))}
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Домашняя работа по уровням</h2>
            {content.homework.map((item, index) => (
              <div key={item.level} className="ta-hw-level">
                <p className="ta-hw-level__label">{item.level}</p>
                <WireWysiwyg>
                  <EditableBlock
                    html={item.text}
                    onChange={(value) => {
                      const homework = content.homework.map((entry, idx) =>
                        idx === index ? { ...entry, text: value } : entry,
                      );
                      onChange({ ...content, homework });
                    }}
                    multiline
                  />
                </WireWysiwyg>
              </div>
            ))}
          </section>

          <section className="ta-section">
            <h2 className="ta-section__title">Материалы для генерации</h2>
            <MaterialGenerationCards selected={content.materials} onToggle={toggleMaterial} />
          </section>

          {showLibraryAttach && libraryMaterials && onToggleLibrary ? (
            <section className="ta-section">
              <ExistingMaterialsPanel
                title="Вариант B · Добавить из библиотеки"
                hint="Выберите материалы, созданные ранее отдельно. Их не нужно генерировать заново — они войдут в комплект урока."
                materials={libraryMaterials}
                selectedIds={attachedLibraryIds}
                onToggle={onToggleLibrary}
              />
            </section>
          ) : null}

          <div className="ta-edit__footer">
            <WButton onClick={onGenerateMaterials}>Сгенерировать материалы</WButton>
          </div>
        </div>

        <WireAiPanel
          contextLabel="редактирование урока"
          suggests={["Сократить цель урока", "Добавить групповую работу", "Упростить формулировки", "Добавить задание повышенной сложности"]}
        />
      </div>
    </div>
  );
}
