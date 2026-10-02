import type { MaterialId } from "../types";

const ICONS: { id: MaterialId; short: string; label: string }[] = [
  { id: "presentation", short: "Пр", label: "Презентация" },
  { id: "motivation", short: "Мт", label: "Мотивирующее задание" },
  { id: "classWork", short: "Кр", label: "Задание для классной работы" },
  { id: "homework", short: "Дз", label: "Задание для домашней работы" },
  { id: "worksheet", short: "Рл", label: "Рабочий лист" },
];

export function LessonMaterialIcons({ materials }: { materials: MaterialId[] }) {
  const items = ICONS.filter((item) => materials.includes(item.id));
  if (items.length === 0) return null;

  return (
    <div className="ta-lesson-materials" aria-label="Созданные материалы урока">
      {items.map((item) => (
        <span key={item.id} className="ta-lesson-material-icon" data-tip={item.label} tabIndex={0}>
          {item.short}
        </span>
      ))}
    </div>
  );
}
