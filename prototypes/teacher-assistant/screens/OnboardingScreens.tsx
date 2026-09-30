import { GRADES, ROLES, SUBJECTS, umkForSubject } from "../mock";
import type { RoleId, TeachingPair } from "../types";
import { SplitLayout } from "../components/SplitLayout";
import { WButton, WCard, WChip, WDropzone } from "../components/wire";

export function OnboardingRoleStep({
  roles,
  onToggle,
  onSkip,
  onNext,
}: {
  roles: RoleId[];
  onToggle: (id: RoleId) => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  const selected = ROLES.filter((item) => roles.includes(item.id));

  return (
    <SplitLayout
      step={1}
      total={4}
      title="Расскажите о вашей работе"
      benefitTitle="Роль помогает настроить сценарии"
      benefit={
        <>
          {selected.length > 0 ? (
            selected.map((item) => (
              <div key={item.id} className="ta-benefit-item">
                <strong>{item.title}.</strong> {item.benefit}
              </div>
            ))
          ) : (
            <p className="wf-hint">Выберите одну или несколько ролей — справа появится, что это даст в продукте.</p>
          )}
        </>
      }
      onSkip={onSkip}
      onNext={onNext}
      nextDisabled={roles.length === 0}
    >
      <div className="wf-grid wf-grid-2">
        {ROLES.map((role) => (
          <WCard
            key={role.id}
            title={role.title}
            detail={role.detail}
            selected={roles.includes(role.id)}
            onClick={() => onToggle(role.id)}
          />
        ))}
      </div>
    </SplitLayout>
  );
}

export function OnboardingSubjectStep({
  draft,
  pairs,
  onDraft,
  onAddPair,
  onRemovePair,
  onSkip,
  onBack,
  onNext,
}: {
  draft: TeachingPair;
  pairs: TeachingPair[];
  onDraft: (patch: Partial<TeachingPair>) => void;
  onAddPair: () => void;
  onRemovePair: (id: string) => void;
  onSkip: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const umk = umkForSubject(draft.subject);

  return (
    <SplitLayout
      step={2}
      total={4}
      title="Выберите предмет и класс"
      benefitTitle="Профиль педагога сохранится в личном кабинете"
      benefit={
        <>
          <p>Можно вести несколько предметов в разных классах и по разным УМК. Эти данные потом редактируются в ЛК.</p>
          {pairs.length > 0 ? (
            <ul className="ta-pair-list">
              {pairs.map((pair) => (
                <li key={pair.id}>
                  {pair.subject} · {pair.grade} класс · {pair.umk}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      }
      onSkip={onSkip}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={pairs.length === 0}
    >
      <p className="wf-card-kicker">Предмет</p>
      <div className="wf-row">
        {SUBJECTS.map((subject) => (
          <WChip key={subject} selected={draft.subject === subject} onClick={() => onDraft({ subject, umk: umkForSubject(subject) })}>
            {subject}
          </WChip>
        ))}
      </div>

      <p className="wf-card-kicker">Класс / параллель</p>
      <div className="wf-row">
        {GRADES.map((grade) => (
          <WChip key={grade} selected={draft.grade === grade} onClick={() => onDraft({ grade, umk: umkForSubject(draft.subject) })}>
            {grade}
          </WChip>
        ))}
      </div>

      <p className="wf-card-kicker">УМК / программа</p>
      <div className="ta-umk-single">
        <span>{umk}</span>
        <span className="wf-hint">Определяется автоматически по предмету и классу</span>
      </div>

      <div className="wf-footer-actions">
        <WButton variant="secondary" onClick={onAddPair}>
          + Добавить связку
        </WButton>
      </div>

      {pairs.length > 0 ? (
        <div className="ta-added-pairs">
          {pairs.map((pair) => (
            <div key={pair.id} className="ta-added-pair">
              <span>
                {pair.subject} · {pair.grade} · {pair.umk}
              </span>
              <button type="button" className="ta-link-btn" onClick={() => onRemovePair(pair.id)}>
                Удалить
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </SplitLayout>
  );
}

export function OnboardingScheduleStep({
  fileName,
  onPick,
  onSkip,
  onBack,
  onNext,
}: {
  fileName: string | null;
  onPick: () => void;
  onSkip: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <SplitLayout
      step={3}
      total={4}
      title="Загрузите расписание"
      benefitTitle="Расписание экономит время на главном экране"
      benefit={
        <p>
          Система покажет ближайшие уроки, напомнит о подготовке и предложит материалы в контексте вашей недели. Можно
          загрузить Excel или CSV из электронного журнала.
        </p>
      }
      onSkip={onSkip}
      onBack={onBack}
      onNext={onNext}
      nextLabel={fileName ? "Далее" : "Пропустить шаг"}
    >
      <WDropzone
        label="Файл расписания"
        fileName={fileName}
        hint="Например, raspisanie_9A.xlsx · до 5 МБ"
        onPick={onPick}
      />
      <p className="wf-hint">Для прототипа достаточно клика по зоне — файл подставится автоматически.</p>
    </SplitLayout>
  );
}

export function OnboardingPlanStep({
  fileName,
  onPick,
  onSkip,
  onBack,
  onFinish,
}: {
  fileName: string | null;
  onPick: () => void;
  onSkip: () => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <SplitLayout
      step={4}
      total={4}
      title="Загрузите тематический план"
      benefitTitle="КТП связывает уроки между собой"
      benefit={
        <p>
          Если загрузить план сейчас, на главном экране сразу будут доступны темы по ФРП и ФГОС. Каждый урок сохранит
          связь с предыдущим и следующим. План можно заменить или дополнить позже в личном кабинете.
        </p>
      }
      onSkip={onSkip}
      onBack={onBack}
      onNext={onFinish}
      nextLabel="На главный экран"
    >
      <WDropzone
        label="Тематический план (КТП)"
        fileName={fileName}
        hint="Например, ktp_algebra_9.docx · Word или PDF"
        onPick={onPick}
      />
      <p className="wf-hint">Если файла нет, система предложит типовой КТП по выбранному предмету и УМК.</p>
    </SplitLayout>
  );
}
