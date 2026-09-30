import { createElement, useLayoutEffect, useRef, type ElementType } from "react";
import { stopEditableClick } from "./usePlanEditor";

type PlanEditableProps = {
  as: ElementType;
  initial: string;
  className?: string;
};

export function PlanEditable({ as, initial, className }: PlanEditableProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || node.dataset.planSeeded === "true") return;
    node.textContent = initial;
    node.dataset.planSeeded = "true";
  }, [initial]);

  return createElement(as, {
    ref,
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onMouseDown: stopEditableClick,
  });
}
