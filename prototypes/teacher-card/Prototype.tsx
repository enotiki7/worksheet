import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, IconButton, Toast } from "@company/ui";
import { CardForm } from "./components/CardForm";
import { CardPreview } from "./components/CardPreview";
import { ShareSheet } from "./components/ShareSheet";
import { SiteFooter } from "./components/SiteFooter";
import { TemplatePicker } from "./components/TemplatePicker";
import {
  DEFAULT_TEMPLATE,
  ERRORS,
  FILLED_FORM,
  formatFrom,
  formatTeacherName,
  hasStopWord,
  TEMPLATES,
  type TemplateId,
} from "./mock";
import { getScenario } from "./scenarios";
import logo from "./assets/logo-light.svg";
import reloadIcon from "./assets/icon-reload.svg";

const GENERATE_MS = 500;

function fieldError(value: string, submitted: boolean, emptyText: string) {
  if (hasStopWord(value)) return emptyText;
  if (submitted && !value.trim()) return emptyText;
  return null;
}

export function Prototype() {
  const [params] = useSearchParams();
  const scenario = getScenario(params.get("scenario"));

  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [screen, setScreen] = useState<"home" | "result">("home");
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (scenario === "filled") {
      setTeacherName(FILLED_FORM.teacherName);
      setSubject(FILLED_FORM.subject);
      setFrom(FILLED_FORM.from);
      setSubmitted(false);
      setScreen("home");
      return;
    }
    if (scenario === "error") {
      setTeacherName("");
      setSubject("");
      setFrom("");
      setSubmitted(true);
      setScreen("home");
      return;
    }
    setTeacherName("");
    setSubject("");
    setFrom("");
    setSubmitted(false);
    setScreen("home");
  }, [scenario]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const nameError = fieldError(teacherName, submitted, ERRORS.name);
  const subjectError = submitted && !subject ? ERRORS.subject : null;
  const fromError = fieldError(from, submitted, ERRORS.from);
  const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[1];
  const previewName = formatTeacherName(teacherName);
  const previewFrom = formatFrom(from);

  function createCard() {
    setSubmitted(true);
    const nameInvalid = !teacherName.trim() || hasStopWord(teacherName);
    const fromInvalid = !from.trim() || hasStopWord(from);
    if (nameInvalid || !subject || fromInvalid || generating) return;
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setScreen("result");
    }, GENERATE_MS);
  }

  function reset() {
    setScreen("home");
    setShareOpen(false);
    setSubmitted(false);
    setRegenerating(false);
  }

  function reloadCard() {
    if (regenerating) return;
    setRegenerating(true);
    window.setTimeout(() => {
      const index = TEMPLATES.findIndex((item) => item.id === templateId);
      const next = TEMPLATES[(index + 1) % TEMPLATES.length];
      setTemplateId(next.id);
      setRegenerating(false);
    }, GENERATE_MS);
  }

  function copyLink() {
    void navigator.clipboard.writeText(window.location.href).catch(() => undefined);
    setToast("Ссылка скопирована");
  }

  return (
    <div className="tc-app">
      <main className="tc-phone">
        {screen === "home" ? (
          <div className="tc-home">
            <img className="tc-logo" src={logo} alt="Ассистент преподавателя" width={136} height={40} />
            <div className="tc-title">
              <h1>Поздравьте педагогов с Днём учителя</h1>
              <p>
                Создайте персональную открытку. Укажите имя учителя, выберите предмет и подпишите, от кого
                поздравление. Появится готовая открытка, которой можно поделиться
              </p>
            </div>
            <TemplatePicker templates={TEMPLATES} value={templateId} onChange={setTemplateId} />
            <CardForm
              teacherName={teacherName}
              subject={subject}
              from={from}
              nameError={nameError}
              subjectError={subjectError}
              fromError={fromError}
              disabled={generating}
              onTeacherName={setTeacherName}
              onSubject={setSubject}
              onFrom={setFrom}
            />
            <div className="tc-generate">
              <Button className="tc-btn-block" variant="brand" size="medium" onClick={createCard}>
                {generating ? "Создаём…" : "Создать открытку"}
              </Button>
              <p className="tc-caption">на базе GigaChat</p>
            </div>
            <SiteFooter onToast={setToast} />
          </div>
        ) : (
          <div className="tc-result">
            <img className="tc-logo" src={logo} alt="Ассистент преподавателя" width={136} height={40} />
            <div className="tc-result-card">
              <CardPreview image={template.image} name={previewName} from={previewFrom} loading={regenerating} />
              <div className="tc-reload">
                <IconButton aria-label="Сгенерировать заново" disabled={regenerating} onClick={reloadCard}>
                  <img src={reloadIcon} alt="" width={20} height={20} />
                </IconButton>
              </div>
            </div>
            <div className="tc-actions">
              <Button
                className="tc-btn-block"
                variant="brand"
                size="medium"
                onClick={() => setToast("Открытка сохранена")}
              >
                Скачать
              </Button>
              <Button className="tc-btn-block" variant="secondary" size="medium" onClick={() => setShareOpen(true)}>
                Поделиться
              </Button>
              <Button className="tc-btn-block tc-ghost-inverse" variant="ghost" size="medium" onClick={reset}>
                Начать сначала
              </Button>
            </div>
            <SiteFooter onToast={setToast} />
          </div>
        )}
      </main>
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onCopy={copyLink}
        onTelegram={() => setToast("Открыто в Telegram")}
        onMax={() => setToast("Открыто в Max")}
      />
      <Toast message={toast} />
    </div>
  );
}
