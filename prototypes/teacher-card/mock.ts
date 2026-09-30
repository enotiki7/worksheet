import flowers from "./assets/card-flowers.png";
import trophy from "./assets/card-trophy.png";
import archive from "./assets/card-archive.png";
import previewTrophy from "./assets/preview-trophy.png";

export type TemplateId = "flowers" | "trophy" | "archive" | "flowers-2" | "trophy-2";

export type CardTemplate = {
  id: TemplateId;
  label: string;
  preview: string;
  image: string;
};

export const CARD_BODY =
  "Не все супергерои носят плащи. Некоторые носят с собой указку, стопку тетрадей и спасают оценки!";

export const TEMPLATES: CardTemplate[] = [
  { id: "flowers", label: "Цветы", preview: flowers, image: flowers },
  { id: "trophy", label: "Кубок", preview: previewTrophy, image: trophy },
  { id: "archive", label: "Букет", preview: archive, image: archive },
  { id: "flowers-2", label: "Цветы", preview: flowers, image: flowers },
  { id: "trophy-2", label: "Кубок", preview: previewTrophy, image: trophy },
];

export const DEFAULT_TEMPLATE: TemplateId = "trophy";

export const SUBJECTS = [
  "Алгебра",
  "Русский язык",
  "Литература",
  "История",
  "Биология",
  "Физика",
  "Химия",
  "География",
  "Английский язык",
].map((label) => ({ value: label, label }));

export const STOP_WORDS = ["мат", "дурак"];

export const ERRORS = {
  name: "Введите имя учителя",
  subject: "Выберите предмет",
  from: "Введите имя отправителя",
};

export const FOOTER = {
  support: "Поддержка",
  telegram: "Телеграм-бот",
  max: "Max-бот",
  agreement: "Пользовательское соглашение",
  copyright: "© 2026, ООО «СберОбразование»",
};

export const FILLED_FORM = {
  teacherName: "Елена Сергеевна",
  subject: "Русский язык",
  from: "от Маши Ивановой",
};

export function hasStopWord(text: string) {
  const value = text.trim().toLowerCase();
  if (!value) return false;
  return STOP_WORDS.some((word) => new RegExp(`(^|[^а-яёa-z])${word}([^а-яёa-z]|$)`, "i").test(value));
}

export function formatTeacherName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return /[!?]$/.test(trimmed) ? trimmed : `${trimmed}!`;
}

export function formatFrom(from: string) {
  const trimmed = from.trim();
  if (!trimmed) return "";
  return /^от\s/i.test(trimmed) ? trimmed : `от ${trimmed}`;
}
