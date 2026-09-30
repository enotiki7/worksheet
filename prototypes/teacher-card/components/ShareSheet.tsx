import { IconButton } from "@company/ui";
import closeIcon from "../assets/icon-close.svg";
import copyIcon from "../assets/icon-copy.svg";
import telegramIcon from "../assets/icon-telegram.svg";
import maxIcon from "../assets/icon-max.svg";

type ShareSheetProps = {
  open: boolean;
  onClose: () => void;
  onCopy: () => void;
  onTelegram: () => void;
  onMax: () => void;
};

export function ShareSheet({ open, onClose, onCopy, onTelegram, onMax }: ShareSheetProps) {
  if (!open) return null;

  return (
    <div className="tc-share-backdrop" onClick={onClose} role="presentation">
      <div
        className="tc-share"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tc-share-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="tc-share__head">
          <h2 id="tc-share-title" className="tc-share__title">
            Поделиться открыткой
          </h2>
          <IconButton aria-label="Закрыть" onClick={onClose}>
            <img src={closeIcon} alt="" width={20} height={20} />
          </IconButton>
        </div>
        <div className="tc-share__actions">
          <IconButton className="tc-share__copy" aria-label="Скопировать ссылку" onClick={onCopy}>
            <img src={copyIcon} alt="" width={20} height={20} />
          </IconButton>
          <button type="button" className="tc-share__messenger" aria-label="Telegram" onClick={onTelegram}>
            <img src={telegramIcon} alt="" width={40} height={40} />
          </button>
          <button type="button" className="tc-share__messenger" aria-label="Max" onClick={onMax}>
            <img src={maxIcon} alt="" width={40} height={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
