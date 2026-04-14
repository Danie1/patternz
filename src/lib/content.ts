import { getCollection } from 'astro:content';

export function entrySlug(entryId: string) {
  return entryId.replace(/\.(md|mdx)$/, '');
}

export async function getPatterns() {
  const patterns = await getCollection('patterns');
  return patterns.sort((a, b) => a.data.order - b.data.order);
}

export async function getScenarios() {
  const scenarios = await getCollection('scenarios');
  return scenarios.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getComparisons() {
  const comparisons = await getCollection('comparisons');
  return comparisons.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getQuizzes() {
  const quizzes = await getCollection('quizzes');
  return quizzes.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getConcepts() {
  const concepts = await getCollection('concepts');
  return concepts.sort((a, b) => a.data.order - b.data.order);
}

export function byIds<T extends { id: string }>(list: T[], ids: string[]) {
  const idSet = new Set(ids);
  return list.filter((item) => idSet.has(item.id));
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replaces concept title mentions in a plain-text string with anchor links.
 * Matches are case-insensitive and word-boundary-aware.
 * Longer concept titles are matched first to prevent partial matches.
 */
export function linkifyConcepts(
  text: string,
  conceptLinks: Array<{ label: string; href: string }>
): string {
  if (!conceptLinks.length) return text;
  const sorted = [...conceptLinks].sort((a, b) => b.label.length - a.label.length);
  let result = text;
  for (const { label, href } of sorted) {
    const pattern = escapeRegex(label);
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    result = result.replace(regex, (match) => `<a href="${href}">${match}</a>`);
  }
  return result;
}

export function extractFirstMermaidBlock(markdownBody: string | undefined) {
  if (!markdownBody) {
    return null;
  }

  const match = markdownBody.match(/```mermaid\s*([\s\S]*?)```/i);
  if (!match) {
    return null;
  }

  return match[1].trim();
}
