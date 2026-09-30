import iconAi from "../assets/icon-ai.png";
import iconArrowTurnRight from "../assets/icon-arrow-turn-right.svg";
import iconCheck from "../assets/icon-check.svg";
import iconChevronDown from "../assets/icon-chevron-down.svg";
import iconChevronUp from "../assets/icon-chevron-up.svg";
import iconDocument from "../assets/icon-document.svg";
import iconDuplicate from "../assets/icon-duplicate.svg";
import iconEdit from "../assets/icon-edit.svg";
import iconExport from "../assets/icon-export.svg";
import iconKitOutline from "../assets/icon-kit-outline.svg";
import iconKitSlides from "../assets/icon-kit-slides.svg";
import iconKitTasks from "../assets/icon-kit-tasks.svg";
import iconPlus from "../assets/icon-plus.svg";
import iconRegenerate from "../assets/icon-regenerate.svg";
import iconSend from "../assets/icon-send.svg";
import iconStepActive from "../assets/icon-step-active.svg";
import iconStepCurrent from "../assets/icon-step-current.svg";
import iconStepDisabled from "../assets/icon-step-disabled.svg";
import iconStepDone from "../assets/icon-step-done.svg";
import iconThumbDown from "../assets/icon-thumb-down.svg";
import iconThumbDown20 from "../assets/icon-thumb-down-20.svg";
import iconThumbUp from "../assets/icon-thumb-up.svg";
import iconThumbUp20 from "../assets/icon-thumb-up-20.svg";
import iconTrash from "../assets/icon-trash.svg";
import iconWhiteboard from "../assets/icon-whiteboard.svg";
import wysiwygBold from "../assets/wysiwyg-bold.svg";
import wysiwygCode from "../assets/wysiwyg-code.svg";
import wysiwygImage from "../assets/wysiwyg-image.svg";
import wysiwygItalic from "../assets/wysiwyg-italic.svg";
import wysiwygMath from "../assets/wysiwyg-math.svg";
import wysiwygMore from "../assets/wysiwyg-more.svg";
import wysiwygStrike from "../assets/wysiwyg-strike.svg";
import wysiwygSub from "../assets/wysiwyg-sub.svg";
import wysiwygSuper from "../assets/wysiwyg-super.svg";
import wysiwygUnderline from "../assets/wysiwyg-underline.svg";

const icons = {
  ai: iconAi,
  arrowTurnRight: iconArrowTurnRight,
  check: iconCheck,
  chevronDown: iconChevronDown,
  chevronUp: iconChevronUp,
  document: iconDocument,
  duplicate: iconDuplicate,
  edit: iconEdit,
  export: iconExport,
  kitOutline: iconKitOutline,
  kitSlides: iconKitSlides,
  kitTasks: iconKitTasks,
  plus: iconPlus,
  regenerate: iconRegenerate,
  send: iconSend,
  stepActive: iconStepActive,
  stepCurrent: iconStepCurrent,
  stepDisabled: iconStepDisabled,
  stepDone: iconStepDone,
  thumbDown: iconThumbDown,
  thumbDown20: iconThumbDown20,
  thumbUp: iconThumbUp,
  thumbUp20: iconThumbUp20,
  trash: iconTrash,
  whiteboard: iconWhiteboard,
  wysiwygBold,
  wysiwygCode,
  wysiwygImage,
  wysiwygItalic,
  wysiwygMath,
  wysiwygMore,
  wysiwygStrike,
  wysiwygSub,
  wysiwygSuper,
  wysiwygUnderline,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const src = icons[name];
  return <img src={src} alt="" width={size} height={size} className={className} aria-hidden="true" />;
}
