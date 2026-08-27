import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button, Input, Select, Switch } from "@company/ui";
import { Icon } from "./components/Icon";
import {
  CanvasBlockView,
  CanvasDropZone,
  GENERATED_BLOCKS,
  createCanvasBlock,
  type CanvasBlock,
  type CanvasBlockKind,
} from "./components/CanvasBlocks";
import editIcon from "./assets/header-edit.svg";
import moreIcon from "./assets/header-more.svg";
import printIcon from "./assets/header-print.svg";
import homeMotivation from "./assets/home-motivation.png";
import homePresentation from "./assets/home-presentation.png";
import homeTask from "./assets/home-task.png";
import homeWorksheet from "./assets/home-worksheet.png";
import needBiggerScreen from "./assets/need-bigger-screen.png";
import pageDeleteIcon from "./assets/page-delete.svg";
import thumbDown from "./assets/thumb-down.svg";
import thumbUp from "./assets/thumb-up.svg";

type Screen = "home" | "loading" | "preview" | "edit";
type ModalMode = "generate" | "manual";

/** Content area below header where blocks must fit (Figma sheet 1132 − header − page #). */
const SHEET_CONTENT_MAX = 980;
const SHEET_CONTENT_MAX_CONTINUED = 1084;

type SheetPage = {
  blocks: CanvasBlock[];
  /** Global indices of blocks on this page (excluding pagebreaks). */
  indices: number[];
};

function splitBlocksIntoPages(blocks: CanvasBlock[]): SheetPage[] {
  const pages: SheetPage[] = [{ blocks: [], indices: [] }];
  blocks.forEach((block, index) => {
    if (block.kind === "pagebreak") {
      pages.push({ blocks: [], indices: [] });
      return;
    }
    const page = pages[pages.length - 1];
    page.blocks.push(block);
    page.indices.push(index);
  });
  return pages;
}

function pageDropStartIndex(blocks: CanvasBlock[], pages: SheetPage[], pageIndex: number) {
  const page = pages[pageIndex];
  if (page.indices.length) return page.indices[0];
  let breaks = 0;
  for (let index = 0; index < blocks.length; index += 1) {
    if (blocks[index].kind !== "pagebreak") continue;
    breaks += 1;
    if (breaks === pageIndex) return index + 1;
  }
  return blocks.length;
}

function taskNumberAt(blocks: CanvasBlock[], index: number) {
  return blocks
    .slice(0, index + 1)
    .filter((item) => item.kind !== "text" && item.kind !== "pagebreak")
    .length;
}

function insertPagebreakBefore(blocks: CanvasBlock[], blockId: string): CanvasBlock[] | null {
  const index = blocks.findIndex((block) => block.id === blockId);
  if (index <= 0) return null;
  if (blocks[index - 1]?.kind === "pagebreak") return null;
  const next = [...blocks];
  next.splice(index, 0, createCanvasBlock("pagebreak"));
  return next;
}

function pagebreakIndexAfterPage(blocks: CanvasBlock[], pageIndex: number): number | null {
  const pages = splitBlocksIntoPages(blocks);
  const page = pages[pageIndex];
  if (!page) return null;

  const searchFrom = page.indices.length
    ? page.indices[page.indices.length - 1] + 1
    : pageDropStartIndex(blocks, pages, pageIndex);

  for (let index = searchFrom; index < blocks.length; index += 1) {
    if (blocks[index].kind === "pagebreak") return index;
  }
  return null;
}

function moveBlockToNextPage(
  blocks: CanvasBlock[],
  overflowBlockId: string,
  pageIndex: number,
): CanvasBlock[] | null {
  const overflowIndex = blocks.findIndex((block) => block.id === overflowBlockId);
  if (overflowIndex < 0) return null;

  const pagebreakIndex = pagebreakIndexAfterPage(blocks, pageIndex);
  if (pagebreakIndex === null) return null;

  const next = [...blocks];
  const [block] = next.splice(overflowIndex, 1);
  const targetIndex = overflowIndex < pagebreakIndex ? pagebreakIndex : pagebreakIndex + 1;
  next.splice(targetIndex, 0, block);
  return next;
}

function resolvePageOverflow(
  blocks: CanvasBlock[],
  pageIndex: number,
  overflowBlockId: string,
): CanvasBlock[] | null {
  const pages = splitBlocksIntoPages(blocks);
  if (pageIndex + 1 < pages.length) {
    return moveBlockToNextPage(blocks, overflowBlockId, pageIndex);
  }
  return insertPagebreakBefore(blocks, overflowBlockId);
}

function deletePage(blocks: CanvasBlock[], pageIndex: number): CanvasBlock[] | null {
  const pages = splitBlocksIntoPages(blocks);
  if (pages.length <= 1) return null;

  const page = pages[pageIndex];
  const remove = new Set<number>();
  page.indices.forEach((index) => remove.add(index));

  if (pageIndex === 0) {
    const breakAfter = pagebreakIndexAfterPage(blocks, 0);
    if (breakAfter !== null) remove.add(breakAfter);
  } else {
    const breakBefore = pagebreakIndexAfterPage(blocks, pageIndex - 1);
    if (breakBefore !== null) remove.add(breakBefore);
  }

  return blocks.filter((_, index) => !remove.has(index));
}

const SUBJECTS = ["Русский язык", "Математика", "История", "Биология"].map((label) => ({
  label,
  value: label,
}));
const GRADES = ["5", "6", "7", "8", "9"].map((value) => ({ label: value, value }));
const COUNTS = ["3", "4", "5", "6", "7"].map((value) => ({ label: value, value }));

const TOOL_GROUPS = [
  {
    title: "Инструменты",
    items: [
      ["toolText", "Текстовый блок", "text"],
      ["toolInput", "Медиа задание", "media"],
      ["toolPagebreak", "Разрыв страницы", "pagebreak"],
    ],
  },
  {
    title: "Готовые блоки",
    items: [
      ["toolInput", "Ввод ответа", "answer"],
      ["toolSingle", "Одиночный выбор", "single"],
      ["toolMulti", "Множественный выбор", "multi"],
      ["toolBlanks", "Заполнение пропусков", "blanks"],
      ["toolMatch", "Сопоставление", "match"],
      ["toolOrder", "Упорядочивание", "order"],
      ["toolTable", "Таблица", "table"],
    ],
  },
] as const;

function useMinWidth(minWidth: number) {
  const [matches, setMatches] = useState(() => (
    typeof window === "undefined" ? true : window.matchMedia(`(min-width: ${minWidth}px)`).matches
  ));

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [minWidth]);

  return matches;
}

export function Prototype() {
  const [screen, setScreen] = useState<Screen>("home");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("generate");
  const [advanced, setAdvanced] = useState(true);
  const [subject, setSubject] = useState("Русский язык");
  const [grade, setGrade] = useState("6");
  const [count, setCount] = useState("5");
  const [topic, setTopic] = useState("Закрепление материалов");
  const [wishes, setWishes] = useState("");
  const [manualSubject, setManualSubject] = useState("");
  const [manualGrade, setManualGrade] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [worksheetOrigin, setWorksheetOrigin] = useState<"generated" | "manual">("generated");
  const [blocks, setBlocks] = useState<CanvasBlock[]>(GENERATED_BLOCKS);

  useEffect(() => {
    if (screen !== "loading") return;
    const timer = window.setTimeout(() => setScreen("preview"), 900);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const createWorksheet = () => {
    setModalOpen(false);
    setSelectedBlockId(null);
    if (modalMode === "manual") {
      setWorksheetOrigin("manual");
      setBlocks([]);
      setScreen("edit");
      return;
    }
    setWorksheetOrigin("generated");
    setBlocks(GENERATED_BLOCKS);
    setScreen("loading");
  };

  if (screen === "home") {
    return (
      <>
        <HomeScreen onWorksheetClick={() => setModalOpen(true)} />
        {modalOpen ? (
          <CreateWorksheetModal
            mode={modalMode}
            advanced={advanced}
            subject={subject}
            grade={grade}
            count={count}
            topic={topic}
            wishes={wishes}
            manualSubject={manualSubject}
            manualGrade={manualGrade}
            manualTopic={manualTopic}
            onModeChange={setModalMode}
            onAdvancedChange={setAdvanced}
            onSubjectChange={setSubject}
            onGradeChange={setGrade}
            onCountChange={setCount}
            onTopicChange={setTopic}
            onWishesChange={setWishes}
            onManualSubjectChange={setManualSubject}
            onManualGradeChange={setManualGrade}
            onManualTopicChange={setManualTopic}
            onClose={() => setModalOpen(false)}
            onSubmit={createWorksheet}
          />
        ) : null}
      </>
    );
  }

  if (screen === "loading") {
    return (
      <DesktopOnly onHome={() => setScreen("home")}>
        <LoadingScreen />
      </DesktopOnly>
    );
  }

  return (
    <DesktopOnly onHome={() => setScreen("home")}>
      <WorksheetWorkspace
        editing={screen === "edit"}
        worksheetOrigin={worksheetOrigin}
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        showAnswers={showAnswers}
        showDifficulty={showDifficulty}
        onBlocksChange={setBlocks}
        onSelectedBlockChange={setSelectedBlockId}
        onShowAnswersChange={setShowAnswers}
        onShowDifficultyChange={setShowDifficulty}
        onEdit={() => setScreen("edit")}
        onPreview={() => setScreen("preview")}
        onPrint={() => window.print()}
      />
    </DesktopOnly>
  );
}

function DesktopOnly({
  children,
  onHome,
}: {
  children: ReactNode;
  onHome: () => void;
}) {
  const isDesktop = useMinWidth(1024);
  if (!isDesktop) {
    return (
      <div className="new-small-screen">
        <div className="new-small-screen__content">
          <img src={needBiggerScreen} alt="" width={400} height={228} />
          <div>
            <h1>Нужен экран побольше</h1>
            <p>
              Пока создавать и редактировать рабочие листы можно только с компьютера.
              Обещаем, что скоро будет доступно с планшета и телефона!
            </p>
          </div>
          <Button onClick={onHome}>На главную</Button>
        </div>
      </div>
    );
  }
  return children;
}

function HomeScreen({ onWorksheetClick }: { onWorksheetClick: () => void }) {
  const cards = [
    { title: "Задание", image: homeTask },
    { title: "Презентация", image: homePresentation },
    { title: "Рабочий лист", image: homeWorksheet, onClick: onWorksheetClick },
    { title: "Мотивирующее задание", image: homeMotivation },
  ];

  return (
    <div className="new-home">
      <aside className="new-home__rail" aria-label="Основная навигация">
        <span className="new-home__collapse">»</span>
        {["⌂", "✦", "▤", "▣", "○", "▢", "⌁", "▥", "☑"].map((item, index) => (
          <span key={`${item}-${index}`} className={index === 1 ? "is-active" : ""}>
            {item}
          </span>
        ))}
        <span className="new-home__avatar">И</span>
      </aside>
      <main className="new-home__main">
        <section className="new-home__surface">
          <div className="new-home__shine" />
          <div className="new-home__assistant">
            <h1><span>✦</span> Чем вам помочь?</h1>
            <div className="new-home__prompt">Например, подготовь тест по теме русский авангард <span>→</span></div>
          </div>
          <div className="new-home__settings">?　⚙</div>
          <div className="new-home__tabs">
            <button className="is-active">Подготовка к уроку</button>
            <button>Проведение урока</button>
            <button>Анализ результатов</button>
          </div>
          <section className="new-home__create">
            <h2>Создание материалов для урока</h2>
            <div className="new-home__cards">
              {cards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  className={card.onClick ? "new-home-card is-clickable" : "new-home-card"}
                  onClick={card.onClick}
                  disabled={!card.onClick}
                >
                  <img src={card.image} alt="" />
                  <span>{card.title}</span>
                </button>
              ))}
            </div>
          </section>
          <div className="new-home__bottom-grid">
            <MockPanel title="Библиотека промптов" subtitle="Выбирайте готовый сценарий взаимодействия с ИИ" />
            <MockPanel title="Пространство экспериментов" subtitle="Тестируйте новые инструменты и предлагайте свои идеи" />
            <MockPanel title="Викторины" subtitle="Используйте готовые или создавайте новые викторины" />
          </div>
        </section>
      </main>
    </div>
  );
}

function MockPanel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="new-home-panel">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <ul>
        <li>Подготовить сценарий урока</li>
        <li>Объяснить материал</li>
        <li>Создать учебный материал</li>
      </ul>
    </section>
  );
}

type ModalProps = {
  mode: ModalMode;
  advanced: boolean;
  subject: string;
  grade: string;
  count: string;
  topic: string;
  wishes: string;
  manualSubject: string;
  manualGrade: string;
  manualTopic: string;
  onModeChange: (mode: ModalMode) => void;
  onAdvancedChange: (value: boolean) => void;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onCountChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onWishesChange: (value: string) => void;
  onManualSubjectChange: (value: string) => void;
  onManualGradeChange: (value: string) => void;
  onManualTopicChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function CreateWorksheetModal(props: ModalProps) {
  return (
    <div className="new-modal-backdrop" role="presentation" onClick={props.onClose}>
      <section className="new-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onClick={(e) => e.stopPropagation()}>
        <aside className="new-modal__nav">
          <h2 id="create-title">Создание<br />рабочего листа</h2>
          <button className={props.mode === "generate" ? "is-active" : ""} onClick={() => props.onModeChange("generate")}>
            Сгенерировать
          </button>
          <button className={props.mode === "manual" ? "is-active" : ""} onClick={() => props.onModeChange("manual")}>
            Создать вручную
          </button>
        </aside>
        <div className="new-modal__content">
          <button className="new-modal__close" aria-label="Закрыть" onClick={props.onClose}>×</button>
          {props.mode === "manual" ? (
            <div className="new-modal__manual">
              <div className="new-modal__row">
                <Select
                  label="Предмет"
                  value={props.manualSubject}
                  placeholder="Выберите предмет"
                  options={SUBJECTS}
                  onChange={props.onManualSubjectChange}
                />
                <Select
                  label="Параллель"
                  value={props.manualGrade}
                  placeholder="Выберите параллель"
                  options={GRADES}
                  onChange={props.onManualGradeChange}
                />
              </div>
              <Input
                label="Тема рабочего листа*"
                value={props.manualTopic}
                placeholder="Например, умножение дробей"
                onChange={(e) => props.onManualTopicChange(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="new-modal__row new-modal__row--three">
                <Select label="Предмет*" value={props.subject} options={SUBJECTS} onChange={props.onSubjectChange} />
                <Select label="Параллель*" value={props.grade} options={GRADES} onChange={props.onGradeChange} />
                <Select label="Количество заданий" value={props.count} options={COUNTS} onChange={props.onCountChange} />
              </div>
              <Input label="Тема рабочего листа*" value={props.topic} onChange={(e) => props.onTopicChange(e.target.value)} />
              <label className="new-modal__textarea">
                <span>Пожелания</span>
                <textarea
                  value={props.wishes}
                  maxLength={2000}
                  placeholder="Особенности группы, акценты, ограничение по времени, опорный материал..."
                  onChange={(e) => props.onWishesChange(e.target.value)}
                />
                <small>{props.wishes.length}/2000</small>
              </label>
              <div className="new-modal__upload">
                <strong>Перетащите сюда файл или выберите на компьютере</strong>
                <span>Файл не должен весить больше 10 Мб.<br />Формат — docx, pdf, jpg, png</span>
                <Button variant="secondary">Выбрать файл</Button>
              </div>
              <button className="new-modal__advanced" onClick={() => props.onAdvancedChange(!props.advanced)}>
                ⚙ {props.advanced ? "Скрыть" : "Показать"} расширенные настройки
              </button>
              {props.advanced ? <TaskPlan /> : null}
            </>
          )}
          <footer className="new-modal__actions">
            <Button variant="secondary" onClick={props.onClose}>Отменить</Button>
            <Button onClick={props.onSubmit} disabled={props.mode === "manual" && props.manualTopic.trim() === ""}>
              Создать
            </Button>
          </footer>
        </div>
      </section>
    </div>
  );
}

function TaskPlan() {
  const rows = [
    ["Заполнение пропусков", "Заполнить пропуски в определении квадратного уравнения"],
    ["Краткий ответ", "Записать общую формулу квадратного уравнения"],
  ];
  return (
    <section className="new-task-plan">
      <header><strong>Порядок заданий</strong><button>✧ Сгенерировать план</button></header>
      {rows.map(([type, text], index) => (
        <div className="new-task-plan__row" key={type}>
          <span>{index + 1}.</span>
          <div>{type}　⌄</div>
          <div>{text}</div>
          <button aria-label="Удалить">×</button>
          <span>⠿</span>
        </div>
      ))}
    </section>
  );
}

function LoadingScreen() {
  return (
    <div className="new-loading">
      <WorksheetHeader compact />
      <div className="new-loading__content">
        <span className="new-spinner" />
        <span>Думаю над темой</span>
      </div>
    </div>
  );
}

type WorkspaceProps = {
  editing: boolean;
  worksheetOrigin: "generated" | "manual";
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  showAnswers: boolean;
  showDifficulty: boolean;
  onBlocksChange: (blocks: CanvasBlock[]) => void;
  onSelectedBlockChange: (value: string | null) => void;
  onShowAnswersChange: (value: boolean) => void;
  onShowDifficultyChange: (value: boolean) => void;
  onEdit: () => void;
  onPreview: () => void;
  onPrint: () => void;
};

function WorksheetWorkspace(props: WorkspaceProps) {
  const [draggedTool, setDraggedTool] = useState<CanvasBlockKind | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(0);
  const pages = splitBlocksIntoPages(props.blocks);
  const pageCount = Math.max(pages.length, 1);

  useEffect(() => {
    setActivePage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const insertBlock = (kind: CanvasBlockKind, index = props.blocks.length) => {
    const block = createCanvasBlock(kind);
    const next = [...props.blocks];
    next.splice(index, 0, block);
    props.onBlocksChange(next);
    props.onSelectedBlockChange(block.id);
    if (kind === "pagebreak") {
      setActivePage(splitBlocksIntoPages(next).length - 1);
    }
  };

  const addPage = () => {
    const next = [...props.blocks, createCanvasBlock("pagebreak")];
    props.onBlocksChange(next);
    props.onSelectedBlockChange(null);
    setActivePage(splitBlocksIntoPages(next).length - 1);
    window.requestAnimationFrame(() => {
      document.getElementById(`worksheet-page-${splitBlocksIntoPages(next).length}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const dropAt = (index: number) => {
    if (draggedTool) {
      insertBlock(draggedTool, index);
      setDraggedTool(null);
      return;
    }
    if (!draggedBlockId) return;
    const from = props.blocks.findIndex((block) => block.id === draggedBlockId);
    if (from < 0) return;
    const next = [...props.blocks];
    const [block] = next.splice(from, 1);
    next.splice(index > from ? index - 1 : index, 0, block);
    props.onBlocksChange(next);
    setDraggedBlockId(null);
  };

  const goToPage = (pageIndex: number) => {
    setActivePage(pageIndex);
    document.getElementById(`worksheet-page-${pageIndex + 1}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const deletePageAt = (pageIndex: number) => {
    const next = deletePage(props.blocks, pageIndex);
    if (!next) return;
    props.onBlocksChange(next);
    props.onSelectedBlockChange(null);
    setActivePage(Math.min(activePage, splitBlocksIntoPages(next).length - 1));
  };

  return (
    <div className={props.editing ? "new-workspace is-editing" : "new-workspace"}>
      <WorksheetHeader
        editing={props.editing}
        onEdit={props.onEdit}
        onPreview={props.onPreview}
        onPrint={props.onPrint}
      />
      <div className="new-workspace__body">
        <PageRail
          pageCount={pageCount}
          activePage={activePage}
          onSelect={goToPage}
          onAdd={addPage}
          onDelete={deletePageAt}
        />
        {props.editing ? (
          <EditorTools
            onAdd={insertBlock}
            onDragStart={(kind) => {
              setDraggedTool(kind);
              setDraggedBlockId(null);
            }}
            onDragEnd={() => setDraggedTool(null)}
          />
        ) : null}
        <main
          className="new-workspace__canvas"
          onClick={(event) => {
            if (!props.editing) return;
            const target = event.target as HTMLElement | null;
            if (target?.closest(".canvas-block, .canvas-pagebreak")) return;
            if (props.selectedBlockId) props.onSelectedBlockChange(null);
          }}
        >
          <Worksheet
            editing={props.editing}
            blocks={props.blocks}
            pages={pages}
            activePage={activePage}
            selectedBlockId={props.selectedBlockId}
            showAnswers={props.showAnswers}
            showDifficulty={props.showDifficulty}
            onSelectedBlockChange={props.onSelectedBlockChange}
            onBlocksChange={props.onBlocksChange}
            onEnterEdit={props.onEdit}
            onBlockDragStart={(id) => {
              setDraggedBlockId(id);
              setDraggedTool(null);
            }}
            onDropAt={dropAt}
            dragActive={Boolean(draggedTool || draggedBlockId)}
            onActivePageChange={setActivePage}
          />
        </main>
        {props.editing ? (
          <EditorSettings
            origin={props.worksheetOrigin}
            selectedBlock={props.blocks.find((block) => block.id === props.selectedBlockId)}
            showAnswers={props.showAnswers}
            showDifficulty={props.showDifficulty}
            onBlockChange={(changed) => props.onBlocksChange(
              props.blocks.map((block) => block.id === changed.id ? changed : block),
            )}
            onShowAnswersChange={props.onShowAnswersChange}
            onShowDifficultyChange={props.onShowDifficultyChange}
          />
        ) : null}
      </div>
    </div>
  );
}

function WorksheetHeader({
  compact = false,
  editing = false,
  onEdit,
  onPreview,
  onPrint,
}: {
  compact?: boolean;
  editing?: boolean;
  onEdit?: () => void;
  onPreview?: () => void;
  onPrint?: () => void;
}) {
  return (
    <header className="new-ws-header">
      <nav><span>Главная</span><i>/</i><span>Рабочие листы</span><i>/</i><span className="is-current">Закрепление материала</span></nav>
      {!compact ? (
        <div className="new-ws-header__actions">
          <button className="new-icon-btn" aria-label="Ещё"><img src={moreIcon} alt="" /></button>
          <Button variant="secondary">Сделать интерактивным</Button>
          <Button variant="secondary" icon={<img src={editIcon} alt="" />} onClick={editing ? onPreview : onEdit}>
            {editing ? "Предпросмотр" : "Редактировать"}
          </Button>
          <Button icon={<img src={printIcon} alt="" />} onClick={onPrint}>Распечатать</Button>
        </div>
      ) : null}
    </header>
  );
}

function PageRail({
  pageCount,
  activePage,
  onSelect,
  onAdd,
  onDelete,
}: {
  pageCount: number;
  activePage: number;
  onSelect: (pageIndex: number) => void;
  onAdd: () => void;
  onDelete: (pageIndex: number) => void;
}) {
  return (
    <aside className="new-page-rail">
      {Array.from({ length: pageCount }, (_, index) => (
        <div key={index} className="new-page-rail__item">
          <button
            type="button"
            className={[
              "new-page-rail__page",
              index === activePage ? "is-active" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => onSelect(index)}
          >
            {index + 1}
          </button>
          {pageCount > 1 ? (
            <button
              type="button"
              className="new-page-rail__delete"
              aria-label={`Удалить страницу ${index + 1}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(index);
              }}
            >
              <img src={pageDeleteIcon} alt="" width={12} height={12} />
            </button>
          ) : null}
        </div>
      ))}
      <button type="button" className="new-page-rail__add" aria-label="Добавить страницу" onClick={onAdd}>
        <Icon name="plus" size={20} />
      </button>
    </aside>
  );
}

function EditorTools({
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  onAdd: (kind: CanvasBlockKind) => void;
  onDragStart: (kind: CanvasBlockKind) => void;
  onDragEnd: () => void;
}) {
  return (
    <aside className="new-editor-tools">
      {TOOL_GROUPS.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          {group.items.map(([icon, label, kind]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              draggable
              onClick={() => onAdd(kind)}
              onDragStart={() => onDragStart(kind)}
              onDragEnd={onDragEnd}
            >
              <Icon name={icon} size={20} /><span>{label}</span>
            </button>
          ))}
        </section>
      ))}
      <section>
        <h3>Дополнительные возможности</h3>
        <button type="button" aria-label="Сгенерировать задание" title="Сгенерировать задание">
          <span className="new-ai-dot">✦</span>
          <span>Сгенерировать задание</span>
        </button>
      </section>
    </aside>
  );
}

function EditorSettings({
  origin,
  selectedBlock,
  showAnswers,
  showDifficulty,
  onShowAnswersChange,
  onShowDifficultyChange,
}: {
  origin: "generated" | "manual";
  selectedBlock?: CanvasBlock;
  showAnswers: boolean;
  showDifficulty: boolean;
  onBlockChange: (block: CanvasBlock) => void;
  onShowAnswersChange: (value: boolean) => void;
  onShowDifficultyChange: (value: boolean) => void;
}) {
  return (
    <aside className="new-editor-settings">
      <h3>{selectedBlock ? "Настройки задания" : "Настройки рабочего листа"}</h3>
      {selectedBlock ? (
        <>
          {(selectedBlock.kind === "single" || selectedBlock.kind === "multi" || selectedBlock.kind === "graph") ? (
            <>
              <Select
                label="Тип ответов"
                value="Текст"
                options={[
                  { value: "Текст", label: "Текст" },
                  { value: "Картинка", label: "Картинка" },
                  { value: "Текст + картинка", label: "Текст + картинка" },
                ]}
                onChange={() => undefined}
              />
              <Select
                label="Количество ответов"
                value={String(selectedBlock.options?.length ?? 4)}
                options={["2", "3", "4", "5", "6"].map((value) => ({ value, label: value }))}
                onChange={() => undefined}
              />
              <Switch label="Перемешать ответы" checked onChange={() => undefined} />
            </>
          ) : selectedBlock.kind === "answer" ? (
            <>
              <Select
                label="Тип ответов"
                value="Линии"
                options={["Линии", "Клетка", "Блок ответа", "Оси", "Координатные прямые", "Луч"].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={() => undefined}
              />
              <Select
                label="Высота блока"
                value="2"
                options={["1", "2", "3", "4", "5"].map((value) => ({ value, label: value }))}
                onChange={() => undefined}
              />
            </>
          ) : selectedBlock.kind === "match" ? (
            <>
              <Select label="Левая колонка" value="Текст" options={[{ value: "Текст", label: "Текст" }, { value: "Картинка", label: "Картинка" }]} onChange={() => undefined} />
              <Select label="Правая колонка" value="Текст" options={[{ value: "Текст", label: "Текст" }, { value: "Картинка", label: "Картинка" }]} onChange={() => undefined} />
              <Switch label="Перемешать правую колонку" checked onChange={() => undefined} />
            </>
          ) : selectedBlock.kind === "order" ? (
            <>
              <Select label="Тип ответа" value="Текстовые" options={[{ value: "Текстовые", label: "Текстовые" }]} onChange={() => undefined} />
              <Switch label="Перемешать" checked={false} onChange={() => undefined} />
            </>
          ) : selectedBlock.kind === "table" ? (
            <>
              <Select label="Количество столбцов" value="3" options={["2", "3", "4"].map((value) => ({ value, label: value }))} onChange={() => undefined} />
              <Select label="Количество строк" value="4" options={["2", "3", "4", "5"].map((value) => ({ value, label: value }))} onChange={() => undefined} />
            </>
          ) : null}
        </>
      ) : (
        <>
          <Select
            value={origin === "manual" ? "" : "Литература"}
            placeholder="Выберите предмет"
            options={[...SUBJECTS, { value: "Литература", label: "Литература" }]}
            onChange={() => undefined}
          />
          <Select
            value={origin === "manual" ? "" : "5"}
            placeholder="Выберите параллель"
            options={GRADES.map((item) => ({ value: item.value, label: `${item.value} параллель` }))}
            onChange={() => undefined}
          />
          <div className={origin === "manual" ? "new-editor-settings__switch is-disabled" : "new-editor-settings__switch"}>
            <Switch
              label="Показать ответы"
              checked={showAnswers}
              onChange={origin === "manual" ? () => undefined : onShowAnswersChange}
            />
          </div>
          <Switch label="Показывать сложность" checked={showDifficulty} onChange={onShowDifficultyChange} />
          {origin === "generated" ? (
            <div className="new-editor-settings__generated">
              <button type="button">
                Оценить генерацию
                <span>
                  <img src={thumbUp} alt="" width={20} height={20} />
                  <img src={thumbDown} alt="" width={20} height={20} />
                </span>
              </button>
              <button type="button">Перегенерировать <span className="new-ai-dot">✦</span></button>
            </div>
          ) : null}
        </>
      )}
      <div className="new-editor-settings__history">
        <button type="button" aria-label="Отменить">↶</button>
        <button type="button" aria-label="Повторить">↷</button>
      </div>
    </aside>
  );
}

function Worksheet({
  editing,
  blocks,
  pages,
  activePage,
  selectedBlockId,
  showAnswers,
  showDifficulty,
  onSelectedBlockChange,
  onBlocksChange,
  onEnterEdit,
  onBlockDragStart,
  onDropAt,
  dragActive,
  onActivePageChange,
}: {
  editing: boolean;
  blocks: CanvasBlock[];
  pages: SheetPage[];
  activePage: number;
  selectedBlockId: string | null;
  showAnswers: boolean;
  showDifficulty: boolean;
  onSelectedBlockChange: (value: string | null) => void;
  onBlocksChange: (blocks: CanvasBlock[]) => void;
  onEnterEdit: () => void;
  onBlockDragStart: (id: string) => void;
  onDropAt: (index: number) => void;
  dragActive: boolean;
  onActivePageChange: (pageIndex: number) => void;
}) {
  const sheetRefs = useRef<Array<HTMLElement | null>>([]);
  const paginatingRef = useRef(false);
  const showPageNumbers = pages.length > 1;

  const updateBlock = (changed: CanvasBlock) => onBlocksChange(
    blocks.map((block) => block.id === changed.id ? changed : block),
  );

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onBlocksChange(next);
  };

  useLayoutEffect(() => {
    if (paginatingRef.current) return;
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
      const sheet = sheetRefs.current[pageIndex];
      const tasks = sheet?.querySelector<HTMLElement>(".new-sheet__tasks");
      if (!tasks) continue;
      const contentMax = pageIndex === 0 ? SHEET_CONTENT_MAX : SHEET_CONTENT_MAX_CONTINUED;
      if (tasks.scrollHeight <= contentMax + 1) continue;
      const page = pages[pageIndex];
      if (page.blocks.length < 2) continue;

      let overflowId: string | null = null;
      let used = 0;
      for (const block of page.blocks) {
        const node = tasks.querySelector<HTMLElement>(`[data-block-id="${block.id}"]`);
        const height = node?.offsetHeight ?? 0;
        if (used > 0 && used + height > contentMax) {
          overflowId = block.id;
          break;
        }
        used += height;
      }
      if (!overflowId) {
        overflowId = page.blocks[page.blocks.length - 1]?.id ?? null;
      }
      if (!overflowId || overflowId === page.blocks[0]?.id) continue;

      const next = resolvePageOverflow(blocks, pageIndex, overflowId);
      if (!next) continue;
      paginatingRef.current = true;
      onBlocksChange(next);
      window.requestAnimationFrame(() => {
        paginatingRef.current = false;
      });
      return;
    }
  }, [blocks, pages, onBlocksChange, editing, showAnswers, showDifficulty]);

  useEffect(() => {
    const canvas = document.querySelector(".new-workspace__canvas");
    if (!canvas) return;
    const syncActive = () => {
      const mid = canvas.getBoundingClientRect().top + 120;
      let best = 0;
      sheetRefs.current.forEach((sheet, index) => {
        if (!sheet) return;
        if (sheet.getBoundingClientRect().top <= mid) best = index;
      });
      if (best !== activePage) onActivePageChange(best);
    };
    canvas.addEventListener("scroll", syncActive, { passive: true });
    return () => canvas.removeEventListener("scroll", syncActive);
  }, [activePage, onActivePageChange, pages.length]);

  return (
    <div className="new-sheets" id="printable-worksheet">
      {pages.map((page, pageIndex) => {
        const dropStartIndex = pageDropStartIndex(blocks, pages, pageIndex);

        return (
          <article
            key={`page-${pageIndex}`}
            id={`worksheet-page-${pageIndex + 1}`}
            ref={(node) => {
              sheetRefs.current[pageIndex] = node;
            }}
            className={[
              editing ? "new-sheet is-editable" : "new-sheet",
              pageIndex === 0 ? "" : "new-sheet--continued",
              pageIndex === activePage ? "is-active-page" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => onActivePageChange(pageIndex)}
          >
            {pageIndex === 0 ? (
              <header className="new-sheet__header">
                <div className="new-sheet__student"><span>Ученик:</span><i /></div>
                <h1 contentEditable={editing} suppressContentEditableWarning>
                  Линейное уравнение с двумя переменными и его график
                </h1>
              </header>
            ) : null}
            <div
              className={page.blocks.length ? "new-sheet__tasks" : "new-sheet__tasks is-empty"}
              onDragOver={editing ? (event) => event.preventDefault() : undefined}
              onDrop={editing ? (event) => {
                event.preventDefault();
                const elements = Array.from(
                  event.currentTarget.querySelectorAll<HTMLElement>(":scope > div > .canvas-block"),
                );
                const local = elements.findIndex(
                  (element) => event.clientY < element.getBoundingClientRect().top + element.offsetHeight / 2,
                );
                if (local < 0) {
                  const end = page.indices.at(-1);
                  onDropAt(end === undefined ? dropStartIndex : end + 1);
                  return;
                }
                onDropAt(page.indices[local] ?? dropStartIndex);
              } : undefined}
            >
              {editing ? (
                <CanvasDropZone
                  active={dragActive || page.blocks.length === 0}
                  onDrop={() => onDropAt(dropStartIndex)}
                />
              ) : null}
              {page.blocks.map((block, localIndex) => {
                const index = page.indices[localIndex];
                return (
                  <div key={block.id} data-block-id={block.id}>
                    <CanvasBlockView
                      block={block}
                      number={taskNumberAt(blocks, index)}
                      editing={editing}
                      selected={block.id === selectedBlockId}
                      showAnswers={showAnswers}
                      showDifficulty={showDifficulty}
                      onSelect={() => {
                        onActivePageChange(pageIndex);
                        onSelectedBlockChange(block.id);
                      }}
                      onEnterEdit={onEnterEdit}
                      onChange={updateBlock}
                      onMove={(direction) => moveBlock(index, direction)}
                      onDuplicate={() => {
                        const duplicate = { ...block, id: createCanvasBlock(block.kind).id };
                        const baseId = duplicate.id;
                        let suffix = 1;
                        while (blocks.some((item) => item.id === duplicate.id)) {
                          duplicate.id = `${baseId}-${suffix++}`;
                        }
                        const next = [...blocks];
                        next.splice(index + 1, 0, duplicate);
                        onBlocksChange(next);
                        onSelectedBlockChange(duplicate.id);
                      }}
                      onDelete={() => {
                        onBlocksChange(blocks.filter((item) => item.id !== block.id));
                        onSelectedBlockChange(null);
                      }}
                      onDragStart={() => onBlockDragStart(block.id)}
                    />
                    {editing ? (
                      <CanvasDropZone
                        active={dragActive}
                        onDrop={() => onDropAt(index + 1)}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            {showPageNumbers ? (
              <span className="new-sheet__page-number">{pageIndex + 1}</span>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
