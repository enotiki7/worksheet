import { Checkbox, Radio } from "@company/ui";
import { useMemo, useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";
import type { ChoiceAnswerType, ChoiceOption } from "../types";
import { EditableText } from "./EditableText";
import { Icon } from "./Icon";

type ChoiceOptionsProps = {
  kind: "single" | "multi";
  choiceAnswerType: ChoiceAnswerType;
  options: ChoiceOption[];
  editable: boolean;
  showAnswers: boolean;
  shuffleOptions: boolean;
  blockId: string;
  onChange: (options: ChoiceOption[]) => void;
};

let optionSequence = 100;
export const nextOptionId = () => `choice-option-${optionSequence++}`;

export function createChoiceOptions(kind: "single" | "multi", count = 4): ChoiceOption[] {
  return Array.from({ length: count }, (_, index) => ({
    id: nextOptionId(),
    text: "",
    correct: kind === "single" ? index === 0 : index < 2,
  }));
}

function shuffleOptionsList(options: ChoiceOption[], seed: string) {
  const copy = [...options];
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  for (let index = copy.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const swapIndex = hash % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function ChoiceImageUpload({
  imageUrl,
  editable,
  control,
  onUpload,
}: {
  imageUrl?: string;
  editable: boolean;
  control: ReactNode;
  onUpload: (imageUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onUpload(URL.createObjectURL(file));
    event.target.value = "";
  };

  const openPicker = (event: { stopPropagation: () => void }) => {
    if (!editable) return;
    event.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div
      className={[
        "ws-image-answer__media",
        editable ? "is-editable" : "",
        imageUrl ? "has-image" : "",
      ].filter(Boolean).join(" ")}
      onClick={openPicker}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : (
        <Icon name="imagePlaceholder" size={20} />
      )}
      <span
        className="ws-image-answer__check"
        onClick={(event) => event.stopPropagation()}
      >
        {control}
      </span>
      {editable ? (
        <div className="ws-image-answer__upload">
          <button type="button" onClick={openPicker}>
            {imageUrl ? "Заменить" : "Добавить картинку"}
          </button>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export function ChoiceOptions({
  kind,
  choiceAnswerType,
  options,
  editable,
  showAnswers,
  shuffleOptions,
  blockId,
  onChange,
}: ChoiceOptionsProps) {
  const withImage = choiceAnswerType !== "Текст";
  const withCaption = choiceAnswerType !== "Картинка";
  const controlsDisabled = !editable;

  const visibleOptions = useMemo(() => {
    if (editable || !shuffleOptions) return options;
    return shuffleOptionsList(options, blockId);
  }, [blockId, editable, options, shuffleOptions]);

  const updateOption = (optionId: string, patch: Partial<ChoiceOption>) => {
    onChange(options.map((option) => (option.id === optionId ? { ...option, ...patch } : option)));
  };

  const markCorrect = (optionId: string, correct: boolean) => {
    if (kind === "single") {
      onChange(options.map((option) => ({
        ...option,
        correct: option.id === optionId,
      })));
      return;
    }
    updateOption(optionId, { correct });
  };

  const renderControl = (option: ChoiceOption) => {
    const checked = showAnswers || editable ? option.correct : false;

    if (kind === "multi") {
      return (
        <Checkbox
          checked={checked}
          onChange={(next) => {
            if (controlsDisabled) return;
            markCorrect(option.id, next);
          }}
        />
      );
    }

    return (
      <Radio
        name={blockId}
        checked={checked}
        onChange={() => {
          if (controlsDisabled) return;
          markCorrect(option.id, true);
        }}
      />
    );
  };

  const wrapDisabled = (control: ReactNode) => {
    if (!controlsDisabled) return control;
    return (
      <span className="ws-choice-control is-disabled" onClick={(event) => event.stopPropagation()}>
        {control}
      </span>
    );
  };

  if (withImage) {
    return (
      <div className="ws-choice-grid">
        {visibleOptions.map((option, index) => (
          <div key={option.id} className="ws-image-answer">
            <ChoiceImageUpload
              imageUrl={option.imageUrl}
              editable={editable}
              control={wrapDisabled(renderControl(option))}
              onUpload={(imageUrl) => updateOption(option.id, { imageUrl })}
            />
            {withCaption ? (
              <EditableText
                className="ws-inline"
                value={option.text}
                editing={editable}
                placeholder={`Ответ ${index + 1}`}
                onChange={(text) => updateOption(option.id, { text })}
              />
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ws-choice-list">
      {visibleOptions.map((option, index) => (
        <div key={option.id} className="ws-choice-row">
          {wrapDisabled(renderControl(option))}
          <EditableText
            className="ws-inline"
            value={option.text}
            editing={editable}
            placeholder={`Ответ ${index + 1}`}
            onChange={(text) => updateOption(option.id, { text })}
          />
        </div>
      ))}
    </div>
  );
}
