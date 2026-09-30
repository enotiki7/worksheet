import { WButton, WField, WInput } from "../components/wire";

export function PhoneScreen({
  phone,
  onPhone,
  onContinue,
}: {
  phone: string;
  onPhone: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="ta-auth">
      <div className="ta-auth__card">
        <p className="wf-badge">Регистрация</p>
        <h1 className="wf-h1">Ассистент преподавателя</h1>
        <p className="wf-lead">Введите номер телефона — для прототипа подойдёт любой номер.</p>
        <WField label="Номер телефона" required>
          <WInput
            type="tel"
            placeholder="+7 900 000-00-00"
            value={phone}
            onChange={(event) => onPhone(event.target.value)}
          />
        </WField>
        <WButton onClick={onContinue} disabled={phone.trim().length < 5}>
          Продолжить
        </WButton>
        <p className="wf-hint">Нажимая «Продолжить», вы соглашаетесь с условиями сервиса.</p>
      </div>
    </div>
  );
}
