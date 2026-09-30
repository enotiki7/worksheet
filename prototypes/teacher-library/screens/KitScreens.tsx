import { audienceLabel } from "../mock";
import type { LessonState } from "../types";
import { Stepper, WButton, WCheck } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function KitSelect({
  lesson,
  onToggle,
  onCreate,
  onBack,
}: {
  lesson: LessonState;
  onToggle: (id: string) => void;
  onCreate: () => void;
  onBack: () => void;
}) {
  const selected = lesson.materials.filter((item) => item.selected).length;
  return (
    <div>
      <Stepper steps={STEPS} current="Материалы" />
      <h1 className="wf-h1">Какие материалы подготовить к уроку?</h1>
      <p className="wf-lead">
        AI предлагает комплект. Отметьте нужное. Не обязательно создавать всё: учитель и ученики различаются в колонке «кому».
      </p>
      <table className="wf-table">
        <thead>
          <tr>
            <th></th>
            <th>Материал</th>
            <th>Кому</th>
            <th>Этап</th>
            <th>Формат</th>
            <th>Зачем</th>
          </tr>
        </thead>
        <tbody>
          {lesson.materials.map((item) => (
            <tr key={item.id}>
              <td>
                <WCheck checked={item.selected} onChange={() => onToggle(item.id)}>
                  {item.recommended ? "рек." : ""}
                </WCheck>
              </td>
              <td>{item.title}</td>
              <td>{audienceLabel(item.audience)}</td>
              <td>{item.stageTitle}</td>
              <td>{item.format}</td>
              <td>{item.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="wf-footer-actions">
        <WButton onClick={onCreate} disabled={selected === 0}>
          Создать выбранные материалы
        </WButton>
        <WButton variant="ghost" onClick={onBack}>
          К плану
        </WButton>
      </div>
    </div>
  );
}

export function GeneratingKit({ lesson }: { lesson: LessonState }) {
  const items = lesson.materials.filter((item) => item.selected);
  return (
    <div>
      <Stepper steps={STEPS} current="Материалы" />
      <h1 className="wf-h1">Собираем связанные черновики</h1>
      <p className="wf-lead">Прогресс по каждому элементу. Материалы опираются на утвержденный план.</p>
      <div className="wf-progress">
        {items.map((item) => (
          <div className="wf-progress-row" key={item.id}>
            <span>{item.title}</span>
            <div className="wf-bar">
              <span style={{ width: item.status === "ready" ? "100%" : item.status === "generating" ? "55%" : "8%" }} />
            </div>
            <span>{item.status === "ready" ? "готово" : item.status === "generating" ? "создается" : "в очереди"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LessonKit({
  lesson,
  onOpen,
  onExclude,
  onReadiness,
  onToast,
}: {
  lesson: LessonState;
  onOpen: (id: string) => void;
  onExclude: (id: string) => void;
  onReadiness: () => void;
  onToast: (text: string) => void;
}) {
  const items = lesson.materials.filter((item) => item.selected && item.status !== "excluded");
  return (
    <div>
      <Stepper steps={STEPS} current="Материалы" />
      <h1 className="wf-h1">Комплект урока</h1>
      <p className="wf-lead">
        {lesson.topic} · {lesson.grade} · цель: {lesson.lessonGoal}
      </p>
      <div className="wf-grid wf-grid-2">
        {items.map((item) => (
          <div className="wf-card" key={item.id}>
            <p className="wf-card-kicker">
              {audienceLabel(item.audience)} · {item.stageTitle} · {item.status === "ready" ? "готово" : item.status}
            </p>
            <p className="wf-card-title">{item.title}</p>
            <div className="wf-preview">
              {item.preview.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
            <div className="wf-row" style={{ marginTop: 10 }}>
              <WButton variant="secondary" onClick={() => onOpen(item.id)}>
                Открыть
              </WButton>
              <WButton variant="ghost" onClick={() => onOpen(item.id)}>
                Редактировать
              </WButton>
              <WButton variant="ghost" onClick={() => onToast(`AI дорабатывает: ${item.title}`)}>
                Доработать с AI
              </WButton>
              <WButton variant="ghost" onClick={() => onToast(`Скачивание: ${item.title}`)}>
                Скачать
              </WButton>
              <WButton variant="ghost" onClick={() => onToast(`Печать: ${item.title}`)}>
                Распечатать
              </WButton>
              <WButton variant="ghost" onClick={() => onToast(`Замена: ${item.title}`)}>
                Заменить
              </WButton>
              <WButton variant="ghost" onClick={() => onExclude(item.id)}>
                Исключить
              </WButton>
            </div>
          </div>
        ))}
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onReadiness}>Проверить готовность урока</WButton>
      </div>
    </div>
  );
}
