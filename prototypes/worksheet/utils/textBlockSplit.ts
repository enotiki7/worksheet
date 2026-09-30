import { createCanvasBlock, type CanvasBlock } from "../components/CanvasBlocks";
import {
  TEXT_BLOCK_CHAR_LIMIT,
  createTextSegment,
  getTextGroupId,
  getTextGroupSegments,
  pageIndexForBlockIndex,
} from "./textBlockGroups";

export const TEXT_CONTENT_WIDTH = 736;

type SheetPage = {
  blocks: CanvasBlock[];
  indices: number[];
};

export type TextRebalanceContext = {
  pages: SheetPage[];
  getTasksElement: (pageIndex: number) => HTMLElement | null;
  contentMaxForPage: (pageIndex: number) => number;
};

let measureRoot: HTMLDivElement | null = null;

function getMeasureRoot(): HTMLDivElement {
  if (measureRoot) return measureRoot;
  measureRoot = document.createElement("div");
  measureRoot.style.position = "fixed";
  measureRoot.style.left = "-10000px";
  measureRoot.style.top = "0";
  measureRoot.style.visibility = "hidden";
  measureRoot.style.pointerEvents = "none";
  document.body.appendChild(measureRoot);
  return measureRoot;
}

export function measureTextBlockHeight(
  text: string,
  width = TEXT_CONTENT_WIDTH,
): number {
  const root = getMeasureRoot();
  root.innerHTML = "";
  const block = document.createElement("section");
  block.className = "canvas-block canvas-block--text is-text-widget-only";
  const content = document.createElement("p");
  content.className = "editable-text canvas-text-block is-filled";
  content.style.width = `${width}px`;
  content.style.whiteSpace = "pre-wrap";
  content.style.wordBreak = "break-word";
  content.textContent = text || "\u00a0";
  block.appendChild(content);
  root.appendChild(block);
  return block.offsetHeight;
}

function preferWordBoundary(text: string, splitAt: number): number {
  if (splitAt >= text.length) return splitAt;
  if (splitAt <= 0) return splitAt;
  const slice = text.slice(0, splitAt);
  const lastNewline = slice.lastIndexOf("\n");
  if (lastNewline > splitAt * 0.5) return lastNewline + 1;
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > splitAt * 0.5) return lastSpace + 1;
  return splitAt;
}

export function findTextSplitIndex(
  text: string,
  maxHeight: number,
  width = TEXT_CONTENT_WIDTH,
): number {
  if (!text.length) return 0;
  if (measureTextBlockHeight(text, width) <= maxHeight) return text.length;

  let low = 1;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const height = measureTextBlockHeight(text.slice(0, mid), width);
    if (height <= maxHeight) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return preferWordBoundary(text, best);
}

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

function measureBlockHeight(
  block: CanvasBlock,
  tasks: HTMLElement | null,
  groupId: string,
): number {
  if (block.kind === "text" && getTextGroupId(block) === groupId) {
    return measureTextBlockHeight(block.text ?? "");
  }
  const node = tasks?.querySelector<HTMLElement>(`[data-block-id="${block.id}"]`);
  if (node) return node.offsetHeight;
  if (block.kind === "text") return measureTextBlockHeight(block.text ?? "");
  return 120;
}

function getAvailableForSegment(
  prefix: CanvasBlock[],
  pageIndex: number,
  ctx: TextRebalanceContext,
  groupId: string,
): number {
  const pages = splitBlocksIntoPages(prefix);
  const page = pages[pageIndex];
  const tasks = ctx.getTasksElement(pageIndex);
  const contentMax = ctx.contentMaxForPage(pageIndex);
  if (!page) return contentMax;

  let used = 0;
  for (const block of page.blocks) {
    used += measureBlockHeight(block, tasks, groupId);
  }
  return Math.max(0, contentMax - used);
}

function distributeTextAcrossPages(
  fullText: string,
  template: CanvasBlock,
  groupId: string,
  startPageIndex: number,
  blocksBefore: CanvasBlock[],
  ctx: TextRebalanceContext,
): { segments: CanvasBlock[]; segmentPages: number[] } {
  const segments: CanvasBlock[] = [];
  const segmentPages: number[] = [];
  let remaining = fullText;
  let pageIndex = startPageIndex;
  let segmentIndex = 0;

  while (remaining.length > 0) {
    const prefix = [...blocksBefore, ...segments];
    const available = getAvailableForSegment(prefix, pageIndex, ctx, groupId);
    let splitAt = findTextSplitIndex(remaining, available);

    if (splitAt <= 0) {
      if (segments.length > 0) {
        pageIndex += 1;
        continue;
      }
      splitAt = findTextSplitIndex(remaining, ctx.contentMaxForPage(pageIndex));
      if (splitAt <= 0) splitAt = 1;
    }

    segments.push(createTextSegment(template, remaining.slice(0, splitAt), segmentIndex, groupId));
    segmentPages.push(pageIndex);
    remaining = remaining.slice(splitAt);
    segmentIndex += 1;

    if (remaining.length > 0) {
      const afterPrefix = [...blocksBefore, ...segments];
      const availableAfter = getAvailableForSegment(afterPrefix, pageIndex, ctx, groupId);
      if (findTextSplitIndex(remaining, availableAfter) <= 0) {
        pageIndex += 1;
      }
    }
  }

  if (!segments.length) {
    segments.push(createTextSegment(template, "", 0, groupId));
    segmentPages.push(startPageIndex);
  }

  return { segments, segmentPages };
}

function insertSegmentsWithPagebreaks(
  before: CanvasBlock[],
  segments: CanvasBlock[],
  segmentPages: number[],
  after: CanvasBlock[],
): CanvasBlock[] {
  if (!segments.length) return [...before, ...after];

  const middle: CanvasBlock[] = [];
  segments.forEach((segment, index) => {
    if (index > 0 && segmentPages[index] > segmentPages[index - 1]) {
      middle.push({ ...createCanvasBlock("pagebreak"), pagebreakSource: "auto" });
    }
    middle.push(segment);
  });

  return [...before, ...middle, ...after];
}

function segmentsMatch(
  current: CanvasBlock[],
  next: CanvasBlock[],
): boolean {
  if (current.length !== next.length) return false;
  return current.every((segment, index) => {
    const other = next[index];
    return segment.text === other.text
      && segment.textSegmentIndex === other.textSegmentIndex;
  });
}

export function rebalanceTextGroup(
  blocks: CanvasBlock[],
  groupId: string,
  ctx: TextRebalanceContext,
): CanvasBlock[] | null {
  const segments = getTextGroupSegments(blocks, groupId);
  if (!segments.length) return null;

  const fullText = segments.map((segment) => segment.text ?? "").join("").slice(0, TEXT_BLOCK_CHAR_LIMIT);
  const template = segments[0];
  const indices = segments.map((segment) => blocks.findIndex((block) => block.id === segment.id));
  const firstIndex = Math.min(...indices);
  const lastIndex = Math.max(...indices);

  const before = blocks.slice(0, firstIndex);
  const after = blocks.slice(lastIndex + 1);
  const startPageIndex = pageIndexForBlockIndex(blocks, firstIndex);

  const { segments: newSegments, segmentPages } = distributeTextAcrossPages(
    fullText,
    template,
    groupId,
    startPageIndex,
    before,
    ctx,
  );

  if (segmentsMatch(segments, newSegments)) return null;

  return insertSegmentsWithPagebreaks(before, newSegments, segmentPages, after);
}

export function rebalanceAllTextGroups(
  blocks: CanvasBlock[],
  ctx: TextRebalanceContext,
): CanvasBlock[] | null {
  const groupIds = [...new Set(
    blocks
      .filter((block) => block.kind === "text")
      .map((block) => getTextGroupId(block))
      .filter((groupId): groupId is string => Boolean(groupId)),
  )];

  let current = blocks;
  let changed = false;

  for (const groupId of groupIds) {
    const next = rebalanceTextGroup(current, groupId, ctx);
    if (next) {
      current = next;
      changed = true;
    }
  }

  return changed ? current : null;
}
