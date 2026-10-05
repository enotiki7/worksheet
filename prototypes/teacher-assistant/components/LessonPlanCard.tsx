import { formatLessonKind, lessonStatusLabel, type KtpLesson } from "../mock";
import { LessonMaterialIcons } from "./LessonMaterialIcons";
import { WCard } from "./wire";

export function LessonPlanCard({
  lesson,
  selected,
  onClick,
}: {
  lesson: KtpLesson;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <WCard
      selected={selected}
      kicker={[`Урок ${lesson.number}`, `${lesson.hours} ч`, lessonStatusLabel(lesson.status)].join(" · ")}
      title={lesson.topic}
      onClick={onClick}
    >
      <p className="ta-lesson-card__kind">Тип урока: {formatLessonKind(lesson.lessonKind)}</p>
      {lesson.createdMaterials?.length ? <LessonMaterialIcons materials={lesson.createdMaterials} /> : null}
    </WCard>
  );
}
