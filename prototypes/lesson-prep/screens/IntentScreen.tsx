import { INTENT_ACTIONS } from "../mock";

export function IntentScreen({ onPrepare }: { onPrepare: () => void }) {
  return (
    <div>
      <h1 className="wf-h1">Что вы хотите сделать?</h1>
      <div className="wf-grid wf-grid-2">
        {INTENT_ACTIONS.map((action) =>
          action.enabled ? (
            <button key={action.id} type="button" className="wf-card is-button" onClick={onPrepare}>
              <p className="wf-card-title">{action.title}</p>
              <p className="wf-card-detail">{action.detail}</p>
            </button>
          ) : (
            <div key={action.id} className="wf-card is-disabled" aria-disabled="true">
              <p className="wf-card-title">{action.title}</p>
              <p className="wf-card-detail">{action.detail}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
