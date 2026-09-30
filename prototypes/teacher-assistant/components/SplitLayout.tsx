import type { ReactNode } from "react";
import { WButton } from "./wire";

export function SplitLayout({
  step,
  total,
  title,
  children,
  benefitTitle,
  benefit,
  onSkip,
  onBack,
  onNext,
  nextLabel = "Далее",
  nextDisabled,
}: {
  step: number;
  total: number;
  title: string;
  children: ReactNode;
  benefitTitle: string;
  benefit: ReactNode;
  onSkip: () => void;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="ta-split-page">
      <header className="ta-split-page__top">
        <span className="wf-badge">Онбординг</span>
        <span className="ta-split-page__progress">
          Шаг {step} из {total}
        </span>
        <WButton variant="ghost" onClick={onSkip}>
          Пропустить
        </WButton>
      </header>

      <div className="ta-split">
        <section className="ta-split__form">
          <h1 className="wf-h1">{title}</h1>
          {children}
          <div className="wf-footer-actions">
            {onBack ? (
              <WButton variant="ghost" onClick={onBack}>
                Назад
              </WButton>
            ) : null}
            <WButton onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </WButton>
          </div>
        </section>

        <aside className="ta-split__benefit">
          <p className="wf-card-kicker">Зачем это нужно</p>
          <h2 className="wf-h2">{benefitTitle}</h2>
          <div className="ta-benefit-copy">{benefit}</div>
        </aside>
      </div>
    </div>
  );
}
