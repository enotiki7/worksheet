import { WButton } from "./wire";

export function LinkedUpdateDialog({
  open,
  onKeepLocal,
  onUpdateLinked,
}: {
  open: boolean;
  onKeepLocal: () => void;
  onUpdateLinked: () => void;
}) {
  if (!open) return null;
  return (
    <div className="wf-modal-back">
      <div className="wf-modal" role="dialog" aria-labelledby="linked-title">
        <h2 className="wf-h2" id="linked-title">
          Изменение может повлиять на план и критерии
        </h2>
        <p className="wf-lead">
          Вы изменили проверяемый результат в рабочем листе. Обновить связанные элементы: этап практической работы и критерии готовности?
        </p>
        <div className="wf-footer-actions">
          <WButton onClick={onUpdateLinked}>Обновить связанные элементы</WButton>
          <WButton variant="secondary" onClick={onKeepLocal}>
            Оставить только в этом материале
          </WButton>
        </div>
      </div>
    </div>
  );
}
