import plus from "../assets/plus.svg";
import more from "../assets/more.svg";
import play from "../assets/play.svg";
import toolText from "../assets/tool-text.svg";
import toolPagebreak from "../assets/tool-pagebreak.svg";
import toolInput from "../assets/tool-input.svg";
import toolSingle from "../assets/tool-single.svg";
import toolMulti from "../assets/tool-multi.svg";
import toolBlanks from "../assets/tool-blanks.svg";
import toolMatch from "../assets/tool-match.svg";
import toolOrder from "../assets/tool-order.svg";
import toolTable from "../assets/tool-table.svg";
import toolMedia from "../assets/tool-media.svg";
import duplicate from "../assets/duplicate.svg";
import blink from "../assets/blink.svg";
import starOn from "../assets/star-on.svg";
import starOff from "../assets/star-off.svg";
import drag from "../assets/drag.svg";
import arrowUp from "../assets/arrow-up.svg";
import arrowDown from "../assets/arrow-down.svg";
import trash from "../assets/trash.svg";
import wysiwygBold from "../assets/wysiwyg-bold.svg";
import wysiwygItalic from "../assets/wysiwyg-italic.svg";
import wysiwygUnderline from "../assets/wysiwyg-underline.svg";
import wysiwygStrike from "../assets/wysiwyg-strike.svg";
import wysiwygMath from "../assets/wysiwyg-math.svg";
import wysiwygCode from "../assets/wysiwyg-code.svg";
import wysiwygSuper from "../assets/wysiwyg-super.svg";
import wysiwygSub from "../assets/wysiwyg-sub.svg";
import wysiwygImage from "../assets/wysiwyg-image.svg";
import wysiwygMore from "../assets/wysiwyg-more.svg";
import imagePlaceholder from "../assets/image-placeholder.svg";
import dragRow from "../assets/drag-row.svg";
import aiBg from "../assets/ai-bg.png";

export const icons = {
  plus,
  more,
  play,
  toolText,
  toolPagebreak,
  toolInput,
  toolSingle,
  toolMulti,
  toolBlanks,
  toolMatch,
  toolOrder,
  toolTable,
  toolMedia,
  duplicate,
  blink,
  starOn,
  starOff,
  drag,
  arrowUp,
  arrowDown,
  trash,
  wysiwygBold,
  wysiwygItalic,
  wysiwygUnderline,
  wysiwygStrike,
  wysiwygMath,
  wysiwygCode,
  wysiwygSuper,
  wysiwygSub,
  wysiwygImage,
  wysiwygMore,
  imagePlaceholder,
  dragRow,
  aiBg,
};

export function Icon({
  name,
  size = 24,
  alt = "",
}: {
  name: keyof typeof icons;
  size?: number;
  alt?: string;
}) {
  return (
    <span className="ws-icon" style={{ width: size, height: size }}>
      <img src={icons[name]} alt={alt} width={size} height={size} />
    </span>
  );
}
