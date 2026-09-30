import { useEffect, useRef } from "react";
import type { CardTemplate, TemplateId } from "../mock";

type TemplatePickerProps = {
  templates: CardTemplate[];
  value: TemplateId;
  onChange: (id: TemplateId) => void;
};

export function TemplatePicker({ templates, value, onChange }: TemplatePickerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skipScrollRef = useRef(false);

  useEffect(() => {
    const index = templates.findIndex((item) => item.id === value);
    const node = itemRefs.current[index];
    if (!node) return;
    skipScrollRef.current = true;
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const timer = window.setTimeout(() => {
      skipScrollRef.current = false;
    }, 450);
    return () => window.clearTimeout(timer);
  }, [value, templates]);

  function syncFromScroll() {
    if (skipScrollRef.current) return;
    const root = scrollerRef.current;
    if (!root) return;
    const mid = root.scrollLeft + root.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < min) {
        min = dist;
        closest = index;
      }
    });
    const next = templates[closest]?.id;
    if (next && next !== value) onChange(next);
  }

  return (
    <div className="tc-picker-block">
      <div
        ref={scrollerRef}
        className="tc-picker"
        role="listbox"
        aria-label="Шаблон открытки"
        onScroll={syncFromScroll}
      >
        {templates.map((template, index) => {
          const selected = template.id === value;
          return (
            <button
              key={template.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={selected}
              className={selected ? "tc-picker__item is-active" : "tc-picker__item"}
              onClick={() => onChange(template.id)}
            >
              <img
                src={template.preview}
                alt={template.label}
                width={selected ? 210 : 160}
                height={selected ? 273 : 208}
              />
            </button>
          );
        })}
      </div>
      <div className="tc-dots" role="tablist" aria-label="Слайды">
        {templates.map((template) => {
          const selected = template.id === value;
          return (
            <button
              key={template.id}
              type="button"
              className={selected ? "tc-dot is-active" : "tc-dot"}
              aria-label={template.label}
              aria-current={selected ? "true" : undefined}
              onClick={() => onChange(template.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
