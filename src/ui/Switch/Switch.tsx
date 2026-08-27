import "./Switch.css";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="ui-switch">
      {label ? <span className="ui-switch__label">{label}</span> : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={checked ? "ui-switch__track is-on" : "ui-switch__track"}
        onClick={() => onChange(!checked)}
      >
        <span className="ui-switch__thumb" />
      </button>
    </label>
  );
}
