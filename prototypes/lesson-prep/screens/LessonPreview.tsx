import type { ThematicLesson } from "../types";

export function LessonPreview({ lesson }: { lesson: ThematicLesson | undefined }) {
  return (
    <aside className="wf-aside" aria-label="Предпросмотр урока">
      <p className="wf-aside-title">Предпросмотр урока</p>
      {!lesson ? <p className="wf-placeholder">Выберите урок, чтобы увидеть предпросмотр</p> : null}
      {lesson ? (
        <>
          <h2 className="wf-h2">{lesson.number}. {lesson.topic}</h2>
          <div className="wf-preview-block">
            <span className="wf-label">Цель урока</span>
            <p>{lesson.content.goal}</p>
          </div>
          <div className="wf-preview-block">
            <span className="wf-label">Задачи урока</span>
            <p>{lesson.content.tasks}</p>
          </div>
          <div className="wf-preview-block">
            <span className="wf-label">Планируемые результаты</span>
            <p>Предметные. {lesson.content.results.subject}</p>
            <p>Личностные. {lesson.content.results.personal}</p>
            <p>Метапредметные. {lesson.content.results.meta}</p>
          </div>
          <div className="wf-preview-block">
            <span className="wf-label">Ключевые слова</span>
            <p>{lesson.content.keywords}</p>
          </div>
        </>
      ) : null}
    </aside>
  );
}
