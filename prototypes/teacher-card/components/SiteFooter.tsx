import { FOOTER } from "../mock";

type SiteFooterProps = {
  onToast: (message: string) => void;
};

export function SiteFooter({ onToast }: SiteFooterProps) {
  return (
    <footer className="tc-footer">
      <p className="tc-footer__title">{FOOTER.support}</p>
      <button type="button" className="tc-footer__link" onClick={() => onToast("Открыто в Telegram")}>
        {FOOTER.telegram}
      </button>
      <button type="button" className="tc-footer__link" onClick={() => onToast("Открыто в Max")}>
        {FOOTER.max}
      </button>
      <div className="tc-footer__legal">
        <button type="button" className="tc-footer__muted" onClick={() => onToast(FOOTER.agreement)}>
          {FOOTER.agreement}
        </button>
        <p>{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
