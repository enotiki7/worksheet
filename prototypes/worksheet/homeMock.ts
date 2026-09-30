import homeTask from "./assets/home-task.png";
import homePresentation from "./assets/home-presentation.png";
import homeWorksheet from "./assets/home-worksheet.png";
import homeMotivation from "./assets/home-motivation.png";
import iconMain from "./assets/home/icon-main.svg";
import iconMaterials from "./assets/home/icon-materials.svg";
import iconPlus from "./assets/home/icon-plus.svg";
import iconQuiz from "./assets/home/icon-quiz.svg";
import iconArrowUpRight from "./assets/home/icon-arrow-up-right.svg";
import iconCalendarLesson from "./assets/home/icon-calendar-lesson.svg";
import iconSmile from "./assets/home/icon-smile.svg";
import iconQuestionRatings from "./assets/home/icon-question-ratings.svg";
import iconPerformance from "./assets/home/icon-performance.svg";
import iconAnalysis from "./assets/home/icon-analysis.svg";
import iconStatistics from "./assets/home/icon-statistics.svg";
import iconChevronDown from "./assets/home/icon-chevron-down.svg";
import expTextErrors from "./assets/home/exp-text-errors.png";
import expCards from "./assets/home/exp-cards.png";
import expInfographic from "./assets/home/exp-infographic.png";
import expLessonPlan from "./assets/home/exp-lesson-plan.png";
import expSummary from "./assets/home/exp-summary.png";
import quiz1 from "./assets/home/quiz-1.png";
import quiz2 from "./assets/home/quiz-2.png";
import quiz3 from "./assets/home/quiz-3.png";
import quiz4 from "./assets/home/quiz-4.png";
import quiz5 from "./assets/home/quiz-5.png";

export type HomeNavItem = {
  label: string;
  icon: string;
  trailingIcon?: string;
  active?: boolean;
  brand?: boolean;
};

export type HomeNavSection = {
  title?: string;
  items: HomeNavItem[];
};

export type HomePrompt = {
  title: string;
  subtitle: string;
};

export type HomeExperiment = {
  title: string;
  subtitle: string;
  image: string;
};

export type HomeQuiz = {
  title: string;
  subtitle: string;
  image: string;
};

export type HomeMaterialCard = {
  title: string;
  image: string;
  clickable?: boolean;
};

export const HOME_TABS = [
  "Подготовка к уроку",
  "Проведение урока",
  "Анализ результатов",
] as const;

export const HOME_NAV_SECTIONS: HomeNavSection[] = [
  {
    items: [
      { label: "Рабочий стол", icon: iconMain, active: true, brand: true },
      { label: "ИИ-помощник", icon: "" },
    ],
  },
  {
    title: "Подготовка к уроку",
    items: [
      { label: "Библиотека заданий", icon: iconMaterials, trailingIcon: iconPlus },
      { label: "Викторины", icon: iconQuiz, trailingIcon: iconArrowUpRight },
    ],
  },
  {
    title: "Проведение урока",
    items: [
      { label: "Расписание", icon: iconCalendarLesson },
      { label: "Мои ученики", icon: iconSmile },
    ],
  },
  {
    title: "Анализ результатов",
    items: [
      { label: "ИИ-проверка заданий", icon: iconQuestionRatings },
      { label: "Результаты учеников", icon: iconPerformance },
      { label: "Анализ уроков", icon: iconAnalysis, trailingIcon: iconPlus },
      { label: "Статистика", icon: iconStatistics, trailingIcon: iconChevronDown },
      { label: "Рейтинги", icon: iconQuestionRatings },
    ],
  },
];

export const HOME_PROMPTS: HomePrompt[] = [
  {
    title: "Подготовить сценарий урока",
    subtitle: "Сценарий урока по готовому материалу",
  },
  {
    title: "Объяснить материал",
    subtitle: "Объяснение темы простыми словами",
  },
  {
    title: "Найти межпредметные связи",
    subtitle: "Связи темы с другими предметами",
  },
  {
    title: "Создать первое занятие",
    subtitle: "Вовлекающее первое занятие для новой темы",
  },
];

export const HOME_EXPERIMENTS: HomeExperiment[] = [
  {
    title: "Текст с ошибками",
    subtitle: "Создайте учебный текст с намеренными ошибками по теме",
    image: expTextErrors,
  },
  {
    title: "Интерактивные карточки",
    subtitle: "Создайте набор карточек для запоминания и повторения",
    image: expCards,
  },
  {
    title: "Учебная инфографика",
    subtitle: "Создайте инфографику по тему, предмету и классу",
    image: expInfographic,
  },
  {
    title: "План урока",
    subtitle: "Создайте подробный план урока по теме, предмету и классу",
    image: expLessonPlan,
  },
  {
    title: "Конспект",
    subtitle: "Преобразуйте страницы учебника в конспект с формулами",
    image: expSummary,
  },
];

export const HOME_QUIZZES: HomeQuiz[] = [
  { title: "Уроки со всего света", subtitle: "10 вопросов", image: quiz1 },
  { title: "Физика вокруг нас: проверь свои знания", subtitle: "9 вопросов", image: quiz2 },
  { title: "Атомный ледокольный флот России", subtitle: "5 вопросов", image: quiz3 },
  { title: "Слова, ноты, подвиг — в сердцах навсегда", subtitle: "12 фактов", image: quiz4 },
  { title: "Современное состояние ледокольного флота", subtitle: "7 достижений", image: quiz5 },
];

export const HOME_MATERIAL_CARDS: HomeMaterialCard[] = [
  { title: "Задание", image: homeTask },
  { title: "Презентация", image: homePresentation },
  { title: "Рабочий лист", image: homeWorksheet, clickable: true },
  { title: "Мотивирующее задание", image: homeMotivation },
];

export const HOME_FOOTER = {
  legals: [
    "Политика обработки персональных данных",
    "Пользовательское соглашение",
  ],
  copyright: "© 2026, ООО «СберОбразование»",
  supportTitle: "Есть вопрос или что‑то сломалось?",
};
