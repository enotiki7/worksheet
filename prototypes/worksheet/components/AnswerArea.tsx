import type { CSSProperties } from "react";
import type { TextAnswerType } from "../types";

type AnswerAreaProps = {
  type: TextAnswerType;
  height: number;
};

export function AnswerArea({ type, height }: AnswerAreaProps) {
  if (type === "Линии") {
    return (
      <div className="ws-lines">
        {Array.from({ length: height }, (_, index) => (
          <div key={index} className="ws-lines__row" />
        ))}
      </div>
    );
  }

  if (type === "Клетка") {
    return <div className="ws-grid" style={{ "--rows": height } as CSSProperties} />;
  }

  if (type === "Блок ответа") {
    return <div className="ws-answer-block" style={{ minHeight: `${height * 48}px` }} />;
  }

  if (type === "Оси") {
    return (
      <div className="ws-axes" style={{ height: `${Math.max(height, 2) * 72}px` }}>
        <span className="ws-axes__y" />
        <span className="ws-axes__x" />
      </div>
    );
  }

  if (type === "Координатные прямые") {
    return (
      <div className="ws-number-lines">
        {Array.from({ length: height }, (_, index) => (
          <div key={index} className="ws-number-line">
            <span className="ws-number-line__bar" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ws-ray">
      <span className="ws-ray__origin" />
      <span className="ws-ray__line" />
    </div>
  );
}
