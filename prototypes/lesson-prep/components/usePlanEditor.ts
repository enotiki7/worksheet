import { useEffect, useRef, useState, type MouseEvent } from "react";

const TOOLBAR_WIDTH = 409;
const TOOLBAR_OFFSET = 52;

export function usePlanEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const root = containerRef.current;
      const selection = window.getSelection();

      if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setToolbar(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const anchor = range.commonAncestorContainer;
      const element = anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : (anchor as Element);

      if (!element || !root.contains(element)) {
        setToolbar(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setToolbar(null);
        return;
      }

      let left = rect.left + rect.width / 2 - TOOLBAR_WIDTH / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - TOOLBAR_WIDTH - 12));

      setToolbar({
        top: Math.max(12, rect.top - TOOLBAR_OFFSET),
        left,
      });
    };

    document.addEventListener("selectionchange", update);
    window.addEventListener("resize", update);

    const root = containerRef.current;
    root?.addEventListener("scroll", update, { passive: true });

    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("resize", update);
      root?.removeEventListener("scroll", update);
    };
  }, []);

  return { containerRef, toolbar };
}

export function stopEditableClick(event: MouseEvent) {
  event.stopPropagation();
}
