import { useEffect, useId, useRef, useState } from "react";
import chevron from "../assets/chevron.svg";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  label?: string;
  value: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function Select({ label, value, placeholder, options, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="ui-select" ref={rootRef}>
      {label ? <span className="ui-select__label">{label}</span> : null}
      <button
        type="button"
        className="ui-select__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "ui-select__value" : "ui-select__placeholder"}>
          {selected?.label ?? placeholder}
        </span>
        <span className="ui-select__chevron">
          <img src={chevron} alt="" width={20} height={20} />
        </span>
      </button>
      {open ? (
        <ul className="ui-select__list" id={listId} role="listbox">
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className="ui-select__option"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
