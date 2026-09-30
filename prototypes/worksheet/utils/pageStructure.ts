import type { CanvasBlock } from "../components/CanvasBlocks";
import { createCanvasBlock } from "../components/CanvasBlocks";

type SheetPage = {
  blocks: CanvasBlock[];
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

function findPagebreakBetweenEmptyAndNext(
  blocks: CanvasBlock[],
  pages: Pick<SheetPage, "blocks">[],
): number | null {
  for (let pageIndex = 0; pageIndex < pages.length - 1; pageIndex += 1) {
    if (pages[pageIndex].blocks.length > 0) continue;

    let breaksSeen = 0;
    for (let index = 0; index < blocks.length; index += 1) {
      if (blocks[index].kind !== "pagebreak") continue;
      if (breaksSeen === pageIndex) return index;
      breaksSeen += 1;
    }
  }
  return null;
}

function collapseConsecutivePagebreaks(blocks: CanvasBlock[]): CanvasBlock[] {
  return blocks.filter((block, index, array) => (
    block.kind !== "pagebreak" || array[index - 1]?.kind !== "pagebreak"
  ));
}

function removeTrailingPagebreaks(blocks: CanvasBlock[]): CanvasBlock[] {
  const next = [...blocks];
  while (next.at(-1)?.kind === "pagebreak") {
    next.pop();
  }
  return next;
}

function normalizeOnce(blocks: CanvasBlock[]): CanvasBlock[] {
  let next = collapseConsecutivePagebreaks(blocks);
  next = removeTrailingPagebreaks(next);

  const pages = splitBlocksIntoPages(next);
  const breakIndex = findPagebreakBetweenEmptyAndNext(next, pages);
  if (breakIndex !== null) {
    next = next.filter((_, index) => index !== breakIndex);
  }

  return next;
}

export function isAutoPagebreak(block: CanvasBlock): boolean {
  return block.kind === "pagebreak" && block.pagebreakSource !== "manual";
}

export function normalizePages(blocks: CanvasBlock[]): CanvasBlock[] | null {
  let next = blocks;
  let changed = false;

  while (true) {
    const updated = normalizeOnce(next);
    if (updated.length === next.length && updated.every((block, index) => block === next[index])) {
      break;
    }
    next = updated;
    changed = true;
  }

  return changed ? next : null;
}

export type PageMergeContext = {
  getTasksElement: (pageIndex: number) => HTMLElement | null;
  contentMaxForPage: (pageIndex: number) => number;
};

function measureBlockHeight(
  block: CanvasBlock,
  getTasksElement: (pageIndex: number) => HTMLElement | null,
  pageCount: number,
): number {
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const tasks = getTasksElement(pageIndex);
    if (!tasks) continue;
    const node = tasks.querySelector<HTMLElement>(`[data-block-id="${block.id}"]`);
    if (node) return node.offsetHeight;
  }
  return 0;
}

function pageBlocksHeight(
  blocks: CanvasBlock[],
  getTasksElement: (pageIndex: number) => HTMLElement | null,
  pageCount: number,
): number {
  return blocks.reduce(
    (sum, block) => sum + measureBlockHeight(block, getTasksElement, pageCount),
    0,
  );
}

export function tryMergeAutoPages(
  blocks: CanvasBlock[],
  ctx: PageMergeContext,
): CanvasBlock[] | null {
  let next = blocks;
  let changed = false;

  while (true) {
    const pages = splitBlocksIntoPages(next);
    if (pages.length < 2) break;

    let merged = false;
    for (let pageIndex = 0; pageIndex < pages.length - 1; pageIndex += 1) {
      const page = pages[pageIndex];
      const nextPage = pages[pageIndex + 1];
      const breakGlobalIndex = page.indices.length
        ? page.indices[page.indices.length - 1] + 1
        : null;

      if (breakGlobalIndex === null) continue;
      const pagebreak = next[breakGlobalIndex];
      if (!pagebreak || pagebreak.kind !== "pagebreak") continue;
      if (pagebreak.pagebreakSource === "manual") continue;

      const contentMax = ctx.contentMaxForPage(pageIndex);
      const combinedHeight = pageBlocksHeight(
        [...page.blocks, ...nextPage.blocks],
        ctx.getTasksElement,
        pages.length,
      );

      if (combinedHeight <= contentMax + 1) {
        next = next.filter((_, index) => index !== breakGlobalIndex);
        changed = true;
        merged = true;
        break;
      }
    }

    if (!merged) break;
  }

  return changed ? next : null;
}

export function createAutoPagebreak(): CanvasBlock {
  return { ...createCanvasBlock("pagebreak"), pagebreakSource: "auto" };
}
