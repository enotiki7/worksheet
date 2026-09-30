import { CARD_BODY } from "../mock";

type CardPreviewProps = {
  image: string;
  name: string;
  from: string;
  loading?: boolean;
};

export function CardPreview({ image, name, from, loading }: CardPreviewProps) {
  return (
    <div className="tc-card">
      <img className="tc-card__art" src={image} alt="" />
      <div className="tc-card__plate">
        <p className={name ? "tc-card__name" : "tc-card__name is-placeholder"}>{name || "Имя учителя"}</p>
        <p className="tc-card__body">{CARD_BODY}</p>
        <p className={from ? "tc-card__from" : "tc-card__from is-placeholder"}>{from || "от кого"}</p>
      </div>
      {loading ? (
        <div className="tc-card__loading" role="status">
          Создаём…
        </div>
      ) : null}
    </div>
  );
}
