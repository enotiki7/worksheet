import { LIBRARY_CARDS, GENERATORS, SUBJECTS, GRADES } from "../mock";
import { WButton, WCard, WSelect } from "../components/wire";
import { useState } from "react";

export function LibraryHome({
  onCreate,
  onCollectLesson,
  createdCount,
}: {
  onCreate: (id: string) => void;
  onCollectLesson: () => void;
  createdCount: number;
}) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const cards = LIBRARY_CARDS.filter((card) => {
    if (subject && card.subject !== subject) return false;
    if (grade && card.grade !== grade) return false;
    return true;
  });

  return (
    <div>
      <div className="wf-row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="wf-h1">Библиотека материалов</h1>
          <p className="wf-lead">Создавайте материалы по одному. План урока здесь отдельный инструмент.</p>
        </div>
        <WButton onClick={() => setOpenCreate((value) => !value)}>Создать</WButton>
      </div>
      {openCreate ? (
        <div className="wf-card" style={{ marginBottom: 16 }}>
          <p className="wf-card-kicker">Генераторы</p>
          <div className="wf-row">
            {GENERATORS.map((item) => (
              <WButton key={item.id} variant="secondary" onClick={() => onCreate(item.id)}>
                {item.title}
              </WButton>
            ))}
          </div>
        </div>
      ) : null}
      <div className="wf-grid wf-grid-2" style={{ marginBottom: 16 }}>
        <WSelect options={SUBJECTS} value={subject} onChange={(event) => setSubject(event.target.value)} />
        <WSelect options={GRADES} value={grade} onChange={(event) => setGrade(event.target.value)} />
      </div>
      <div className="wf-grid wf-grid-3">
        {cards.map((card) => (
          <WCard key={card.id} kicker={`${card.type} · ${card.grade}`} title={card.title} detail={`${card.subject} · ${card.updated}`} />
        ))}
      </div>
      {createdCount > 0 ? (
        <div className="wf-footer-actions">
          <span className="wf-meta" style={{ margin: 0 }}>
            Создано отдельно: {createdCount}
          </span>
          <WButton variant="secondary" onClick={onCollectLesson}>
            Собрать в урок
          </WButton>
        </div>
      ) : null}
    </div>
  );
}
