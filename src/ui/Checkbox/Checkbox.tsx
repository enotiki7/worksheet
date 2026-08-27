import "./Checkbox.css";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="ui-checkbox">
      <input
        type="checkbox"
        className="ui-checkbox__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={checked ? "ui-checkbox__box is-on" : "ui-checkbox__box"} />
      {label ? <span className="ui-checkbox__label">{label}</span> : null}
    </label>
  );
}
