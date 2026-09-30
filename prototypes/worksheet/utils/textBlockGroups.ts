import { createCanvasBlock, type CanvasBlock } from "../components/CanvasBlocks";

export const TEXT_BLOCK_CHAR_LIMIT = 10_000;

let textGroupSequence = 1;
export const nextTextGroupId = () => `text-group-${textGroupSequence++}`;

export function getTextGroupId(block: CanvasBlock): string | null {
  if (block.kind !== "text") return null;
  return block.textGroupId ?? block.id;
}

export function getTextGroupSegments(blocks: CanvasBlock[], groupId: string): CanvasBlock[] {
  return blocks
    .filter((block) => block.kind === "text" && getTextGroupId(block) === groupId)
    .sort((left, right) => {
      const leftIndex = left.textSegmentIndex ?? 0;
      const rightIndex = right.textSegmentIndex ?? 0;
      if (leftIndex !== rightIndex) return leftIndex - rightIndex;
      return blocks.findIndex((block) => block.id === left.id) - blocks.findIndex((block) => block.id === right.id);
    });
}

export function getActiveTextSegment(blocks: CanvasBlock[], groupId: string): CanvasBlock | null {
  const segments = getTextGroupSegments(blocks, groupId);
  return segments.at(-1) ?? null;
}

export function getTotalTextLength(blocks: CanvasBlock[], groupId: string): number {
  return getTextGroupSegments(blocks, groupId)
    .reduce((total, segment) => total + (segment.text?.length ?? 0), 0);
}

export function getTextGroupBlockIds(blocks: CanvasBlock[], groupId: string): string[] {
  return getTextGroupSegments(blocks, groupId).map((segment) => segment.id);
}

export function isActiveTextSegment(blocks: CanvasBlock[], block: CanvasBlock): boolean {
  const groupId = getTextGroupId(block);
  if (!groupId) return true;
  const active = getActiveTextSegment(blocks, groupId);
  return active?.id === block.id;
}

export function normalizeTextBlock(block: CanvasBlock): CanvasBlock {
  if (block.kind !== "text") return block;
  return {
    ...block,
    textGroupId: block.textGroupId ?? block.id,
    textSegmentIndex: block.textSegmentIndex ?? 0,
  };
}

export function createTextSegment(
  template: CanvasBlock,
  text: string,
  segmentIndex: number,
  groupId: string,
): CanvasBlock {
  return {
    ...template,
    id: createCanvasBlock("text").id,
    kind: "text",
    text,
    textGroupId: groupId,
    textSegmentIndex: segmentIndex,
  };
}

export function deleteTextGroup(blocks: CanvasBlock[], groupId: string): CanvasBlock[] {
  return blocks.filter((block) => !(block.kind === "text" && getTextGroupId(block) === groupId));
}

export function duplicateTextGroup(blocks: CanvasBlock[], groupId: string): CanvasBlock[] {
  const segments = getTextGroupSegments(blocks, groupId);
  if (!segments.length) return blocks;

  const lastIndex = blocks.findIndex((block) => block.id === segments.at(-1)!.id);
  const newGroupId = nextTextGroupId();
  const fullText = segments.map((segment) => segment.text ?? "").join("");
  const duplicateSegments = [
    createTextSegment(segments[0], fullText, 0, newGroupId),
  ];

  const next = [...blocks];
  next.splice(lastIndex + 1, 0, ...duplicateSegments);
  return next;
}

export function collectTextGroupIds(blocks: CanvasBlock[]): string[] {
  const ids = new Set<string>();
  blocks.forEach((block) => {
    const groupId = getTextGroupId(block);
    if (groupId) ids.add(groupId);
  });
  return [...ids];
}

export function pageIndexForBlockIndex(blocks: CanvasBlock[], blockIndex: number): number {
  let pageIndex = 0;
  for (let index = 0; index < blockIndex; index += 1) {
    if (blocks[index].kind === "pagebreak") pageIndex += 1;
  }
  return pageIndex;
}

export type TextSegmentVisualRole = {
  isFirst: boolean;
  isLast: boolean;
  continuesToNextPage: boolean;
  continuedFromPrevPage: boolean;
};

export function getTextSegmentVisualRole(
  blocks: CanvasBlock[],
  block: CanvasBlock,
): TextSegmentVisualRole | null {
  if (block.kind !== "text") return null;

  const groupId = getTextGroupId(block);
  if (!groupId) return null;

  const segments = getTextGroupSegments(blocks, groupId);
  const segmentIndex = segments.findIndex((segment) => segment.id === block.id);
  if (segmentIndex < 0) return null;

  const pageOf = (blockId: string) => pageIndexForBlockIndex(
    blocks,
    blocks.findIndex((item) => item.id === blockId),
  );

  const prevSegment = segments[segmentIndex - 1];
  const nextSegment = segments[segmentIndex + 1];

  return {
    isFirst: segmentIndex === 0,
    isLast: segmentIndex === segments.length - 1,
    continuedFromPrevPage: prevSegment
      ? pageOf(prevSegment.id) < pageOf(block.id)
      : false,
    continuesToNextPage: nextSegment
      ? pageOf(nextSegment.id) > pageOf(block.id)
      : false,
  };
}

export function isTextGroupSelected(
  blocks: CanvasBlock[],
  groupId: string,
  selectedBlockId: string | null,
): boolean {
  if (!selectedBlockId) return false;
  const selected = blocks.find((block) => block.id === selectedBlockId);
  if (!selected || selected.kind !== "text") return false;
  return getTextGroupId(selected) === groupId;
}

export function getTextGroupBlockRange(
  blocks: CanvasBlock[],
  groupId: string,
): { start: number; end: number } | null {
  const segments = getTextGroupSegments(blocks, groupId);
  if (!segments.length) return null;

  const start = blocks.findIndex((block) => block.id === segments[0].id);
  const end = blocks.findIndex((block) => block.id === segments.at(-1)!.id);
  if (start < 0 || end < 0) return null;

  return { start, end };
}

export function moveTextGroupBlockRange(
  blocks: CanvasBlock[],
  groupId: string,
  targetIndex: number,
): CanvasBlock[] | null {
  const range = getTextGroupBlockRange(blocks, groupId);
  if (!range) return null;

  const slice = blocks.slice(range.start, range.end + 1);
  const without = [...blocks.slice(0, range.start), ...blocks.slice(range.end + 1)];
  const insertAt = targetIndex > range.start ? targetIndex - slice.length : targetIndex;
  without.splice(Math.max(0, insertAt), 0, ...slice);
  return without;
}

export function moveTextGroupByStep(
  blocks: CanvasBlock[],
  groupId: string,
  direction: -1 | 1,
): CanvasBlock[] | null {
  const range = getTextGroupBlockRange(blocks, groupId);
  if (!range) return null;

  const target = direction === -1 ? range.start - 1 : range.end + 1;
  if (target < 0 || target >= blocks.length) return null;
  if (blocks[target].kind === "pagebreak" && direction === -1 && range.start === 0) return null;

  const next = [...blocks];
  const slice = next.splice(range.start, range.end - range.start + 1);
  const insertAt = direction === -1 ? range.start - 1 : range.start + 1;
  next.splice(insertAt, 0, ...slice);
  return next;
}
