import radioOn from "../assets/radio-on.svg";
import "./Radio.css";

type RadioProps = {
  checked: boolean;
  onChange?: () => void;
  name?: string;
  label?: string;
};

export function Radio({ checked, onChange = () => undefined, name, label }: RadioProps) {
  return (
    <label className="ui-radio">
      <input
        type="radio"
        className="ui-radio__input"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      {checked ? (
        <img className="ui-radio__mark" src={radioOn} alt="" width={20} height={20} />
      ) : (
        <span className="ui-radio__empty" />
      )}
      {label ? <span className="ui-radio__label">{label}</span> : null}
    </label>
  );
}
