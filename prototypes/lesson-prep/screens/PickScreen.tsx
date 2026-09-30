import { Button, Input, Select } from "@company/ui";
import { Icon } from "../components/Icon";
import { GRADES, PLANS, SUBJECTS, THEMES } from "../content";

export function PickScreen({
  subject,
  grade,
  duration,
  planId,
  lessonId,
  openTheme,
  ready,
  onSubject,
  onGrade,
  onDuration,
  onPlan,
  onToggleTheme,
  onLesson,
}: {
  subject: string;
  grade: string;
  duration: string;
  planId: string;
  lessonId: string;
  openTheme: string;
  ready: boolean;
  onSubject: (value: string) => void;
  onGrade: (value: string) => void;
  onDuration: (value: string) => void;
  onPlan: (value: string) => void;
  onToggleTheme: (id: string) => void;
  onLesson: (id: string) => void;
}) {
  return (
    <div className="lp-body">
      <div className="lp-col">
        <div className="lp-form">
          <div className="lp-row">
            <Select label="Предмет *" value={subject} placeholder="Выберите предмет" options={SUBJECTS} onChange={onSubject} />
            <Select label="Параллель *" value={grade} placeholder="Выберите параллель" options={GRADES} onChange={onGrade} />
          </div>
          <div className="lp-row">
            <Input label="Продолжительность урока" value={duration} onChange={(event) => onDuration(event.target.value)} />
          </div>
          <Select
            label="Тематический план *"
            value={planId}
            placeholder="Выберите тематический план"
            options={subject === "algebra" && grade === "9" ? PLANS : []}
            onChange={onPlan}
          />
          <p className="lp-or">или загрузите свой файл</p>
          <div className="lp-drop">
            <strong>Перетащите сюда файл или выберите на компьютере</strong>
            файл не должен весить больше 10 Мб.
            <br />
            Формат — docx, pdf, jpg, png
            <div style={{ marginTop: 12 }}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.click();
                }}
              >
                Выбрать файл
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="lp-divider" />
      <div className="lp-col" aria-label="Темы и уроки">
        {!ready ? <div className="lp-empty">Заполните обязательные поля, чтобы выбрать урок</div> : null}
        {ready
          ? THEMES.map((theme) => (
              <section key={theme.id} className="lp-theme">
                <button type="button" className="lp-theme-head" onClick={() => onToggleTheme(theme.id)}>
                  <span>
                    <strong>
                      {theme.number}. {theme.title}
                    </strong>
                    <span>{theme.meta}</span>
                  </span>
                  <Icon name={openTheme === theme.id ? "chevronUp" : "chevronDown"} size={20} />
                </button>
                {openTheme === theme.id ? (
                  <div className="lp-theme-lessons">
                    {theme.lessons.map((lesson) => {
                      const featured = lesson.id === "compare";
                      const open = featured && lesson.id === lessonId;
                      if (!featured) {
                        return (
                          <div key={lesson.id} className="lp-lesson is-static">
                            <span className="lp-lesson-num">{lesson.number}</span>
                            <span className="lp-lesson-main">
                              <strong>{lesson.title}</strong>
                              <small>{lesson.kind}</small>
                            </span>
                            {lesson.id === "rational" ? (
                              <span className="lp-lesson-icons">
                                <Icon name="whiteboard" size={20} />
                                <Icon name="document" size={20} />
                              </span>
                            ) : null}
                          </div>
                        );
                      }
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={open ? "lp-lesson is-open" : "lp-lesson"}
                          onClick={() => onLesson(lesson.id)}
                        >
                          <span className="lp-lesson-num">{lesson.number}</span>
                          <span className="lp-lesson-main">
                            <strong>{lesson.title}</strong>
                            {open ? null : <small>{lesson.kind}</small>}
                          </span>
                          {open ? (
                            <div className="lp-lesson-expand">
                              <CompareDetails />
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            ))
          : null}
      </div>
    </div>
  );
}

function CompareDetails() {
  return (
    <div className="lp-lesson-body">
      <section>
        <h3>Цель урока</h3>
        <ul>
          <li>
            К концу урока научиться сравнивать действительные числа, представленные десятичными дробями, обыкновенными дробями, корнями и
            степенями, и обосновывать выбор знака сравнения не менее чем в 4 из 5 заданий формата ОГЭ.
          </li>
          <li>
            Сформировать умение распознавать способы сравнения действительных чисел: приведение к общей форме, оценка, сравнение квадратов и
            использование координатной прямой.
          </li>
          <li>Развивать умение анализировать условие, выбирать рациональный алгоритм и проверять полученный результат.</li>
          <li>Формировать навыки самоконтроля при выполнении заданий ОГЭ и снижать тревожность через пошаговую проверку решения.</li>
          <li>Воспитывать ответственное отношение к математической записи, аргументации и взаимной помощи при работе в паре.</li>
        </ul>
      </section>
      <section>
        <h3>Задачи урока</h3>
        <p>Ввести понятия уравнения, корня уравнения, повторить понятия числовых выражений и равенств, осмыслить, что значит решить уравнение.</p>
        <p>Продолжить формировать умение решать текстовые задачи различных типов.</p>
      </section>
      <section>
        <h3>Планируемые результаты</h3>
        <div className="lp-result-row">
          <span>Предметные</span>
          <ul>
            <li>Знать свойства отношений «больше», «меньше», «равно» и связь положения числа на координатной прямой с его величиной.</li>
            <li>Уметь сравнивать положительные и отрицательные числа, десятичные и обыкновенные дроби, степени с одинаковым основанием и квадратные корни.</li>
          </ul>
        </div>
        <div className="lp-result-row">
          <span>Личностные</span>
          <ul>
            <li>Осознают практическую ценность умения сравнивать числа для проверки расчётов, чтения данных и выполнения заданий ОГЭ.</li>
          </ul>
        </div>
        <div className="lp-result-row">
          <span>Метапредметные</span>
          <ul>
            <li>Выделяют существенные данные в условии и выбирают подходящий способ сравнения.</li>
          </ul>
        </div>
      </section>
      <section>
        <h3>Ключевые слова:</h3>
        <p>уравнение; корень уравнения; математическая модель</p>
      </section>
    </div>
  );
}
