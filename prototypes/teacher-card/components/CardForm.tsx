import { Input, Select } from "@company/ui";
import { SUBJECTS } from "../mock";

type CardFormProps = {
  teacherName: string;
  subject: string;
  from: string;
  nameError: string | null;
  subjectError: string | null;
  fromError: string | null;
  disabled?: boolean;
  onTeacherName: (value: string) => void;
  onSubject: (value: string) => void;
  onFrom: (value: string) => void;
};

export function CardForm({
  teacherName,
  subject,
  from,
  nameError,
  subjectError,
  fromError,
  disabled,
  onTeacherName,
  onSubject,
  onFrom,
}: CardFormProps) {
  return (
    <div className="tc-fields">
      <div className="tc-field">
        <Input
          id="teacher-name"
          value={teacherName}
          placeholder="Например, Елена Сергеевна"
          disabled={disabled}
          onChange={(event) => onTeacherName(event.target.value)}
          aria-invalid={Boolean(nameError)}
        />
        {nameError ? <p className="tc-field__error">{nameError}</p> : null}
      </div>
      <div className="tc-field">
        <Select
          value={subject}
          placeholder="Выберите предмет"
          options={SUBJECTS}
          onChange={onSubject}
        />
        {subjectError ? <p className="tc-field__error">{subjectError}</p> : null}
      </div>
      <div className="tc-field">
        <Input
          id="card-from"
          value={from}
          placeholder="Например, от Маши Ивановой"
          disabled={disabled}
          onChange={(event) => onFrom(event.target.value)}
          aria-invalid={Boolean(fromError)}
        />
        {fromError ? <p className="tc-field__error">{fromError}</p> : null}
      </div>
    </div>
  );
}
