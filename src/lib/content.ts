import { getCollection } from 'astro:content';

export function entrySlug(entryId: string) {
  return entryId.replace(/\.(md|mdx)$/, '');
}

export function roadmapTopicHref(topic: string) {
  return `/?topic=${encodeURIComponent(topic)}`;
}

export async function getPatterns() {
  const patterns = await getCollection('patterns');
  return patterns.sort((a, b) => a.data.order - b.data.order);
}

export async function getScenarios() {
  const scenarios = await getCollection('scenarios');
  return scenarios.sort((a, b) => a.data.title.localeCompare(b.data.title));
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

export type RoadmapNodeType = 'concept' | 'pattern' | 'scenario';
export type RoadmapEdgeKind = 'dependency' | 'related';

export interface RoadmapNodeSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface RoadmapNode {
  id: string;
  role: 'group' | 'item';
  type: RoadmapNodeType;
  title: string;
  summary: string;
  href: string | null;
  x: number;
  y: number;
  sections: RoadmapNodeSection[];
  diagrams: string[];
}

export interface RoadmapEdge {
  id: string;
  kind: RoadmapEdgeKind;
  source: string;
  target: string;
}

export interface RoadmapGraph {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

function pushUniqueEdge(
  edges: RoadmapEdge[],
  seen: Set<string>,
  edge: Omit<RoadmapEdge, 'id'>
) {
  const key = `${edge.kind}:${edge.source}->${edge.target}`;
  if (seen.has(key)) return;
  seen.add(key);
  edges.push({ id: key, ...edge });
}

function toList(value: string[] | undefined) {
  return value ?? [];
}

function cleanMarkdown(markdownBody: string | undefined) {
  if (!markdownBody) return '';
  return markdownBody
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstParagraph(markdownBody: string | undefined) {
  const cleaned = cleanMarkdown(markdownBody);
  if (!cleaned) return null;
  const paragraph = cleaned.split('\n\n')[0]?.trim();
  return paragraph || null;
}

function extractMermaidBlocks(markdownBody: string | undefined) {
  if (!markdownBody) return [] as string[];

  const matches = markdownBody.matchAll(/```mermaid\s*([\s\S]*?)```/gi);
  const blocks: string[] = [];
  for (const match of matches) {
    const code = match[1]?.trim();
    if (code) {
      blocks.push(code);
    }
  }
  return blocks;
}

export async function getRoadmapGraph(): Promise<RoadmapGraph> {
  const [concepts, patterns, scenarios] = await Promise.all([
    getConcepts(),
    getPatterns(),
    getScenarios()
  ]);

  const nodes: RoadmapNode[] = [];
  const edges: RoadmapEdge[] = [];
  const seenEdges = new Set<string>();
  const nodeIds = new Set<string>();

  const pushNode = (node: RoadmapNode) => {
    nodes.push(node);
    nodeIds.add(node.id);
  };

  pushNode({
    id: 'group_patterns',
    role: 'group',
    type: 'pattern',
    title: 'Patterns',
    summary: 'Reusable architecture solutions and their tradeoffs.',
    href: null,
    x: 560,
    y: 72,
    sections: [
      {
        title: 'Definition',
        paragraphs: ['Patterns are reusable design approaches for recurring architecture problems.']
      },
      {
        title: 'How Patterns Differ',
        bullets: [
          'Unlike concepts, patterns are implementation choices you apply to a concrete problem.',
          'Unlike scenarios, patterns are not full systems; they are building blocks used inside systems.'
        ]
      },
      {
        title: 'Relationship To Concepts And Scenarios',
        bullets: [
          'Concepts explain why a pattern helps or hurts under specific constraints.',
          'Scenarios combine multiple patterns to satisfy end-to-end requirements.'
        ]
      }
    ],
    diagrams: []
  });

  pushNode({
    id: 'group_scenarios',
    role: 'group',
    type: 'scenario',
    title: 'Scenarios',
    summary: 'End-to-end design exercises and system walkthroughs.',
    href: null,
    x: 950,
    y: 72,
    sections: [
      {
        title: 'Definition',
        paragraphs: ['Scenarios are realistic system-design contexts where multiple tradeoffs must be balanced.']
      },
      {
        title: 'How Scenarios Differ',
        bullets: [
          'Unlike concepts, scenarios are not abstract principles; they are practical design situations.',
          'Unlike patterns, scenarios require combining many techniques, not choosing a single solution.'
        ]
      },
      {
        title: 'Relationship To Concepts And Patterns',
        bullets: [
          'Concepts provide the reasoning model for each design decision inside a scenario.',
          'Patterns provide the concrete mechanisms used to realize the scenario architecture.'
        ]
      }
    ],
    diagrams: []
  });

  pushNode({
    id: 'group_concepts',
    role: 'group',
    type: 'concept',
    title: 'Concepts',
    summary: 'Foundational mental models and system properties.',
    href: null,
    x: 170,
    y: 72,
    sections: [
      {
        title: 'Definition',
        paragraphs: ['Concepts are core principles that describe system behavior and design constraints.']
      },
      {
        title: 'How Concepts Differ',
        bullets: [
          'Unlike patterns, concepts do not prescribe one implementation; they frame the tradeoffs.',
          'Unlike scenarios, concepts are not full designs; they are reusable mental models.'
        ]
      },
      {
        title: 'Relationship To Patterns And Scenarios',
        bullets: [
          'Patterns operationalize concepts into architecture techniques.',
          'Scenarios test concepts by applying them under real system requirements.'
        ]
      }
    ],
    diagrams: []
  });

  concepts.forEach((entry, index) => {
    const notes = firstParagraph(entry.body);
    const diagrams = extractMermaidBlocks(entry.body);
    pushNode({
      id: entry.data.id,
      role: 'item',
      type: 'concept',
      title: entry.data.title,
      summary: entry.data.summary,
      href: roadmapTopicHref(entrySlug(entry.id)),
      x: 950,
      y: 188 + index * 98,
      sections: [
        { title: 'Definition', paragraphs: [entry.data.definition] },
        { title: 'Why It Matters', bullets: entry.data.why_it_matters },
        { title: 'Tradeoffs', bullets: entry.data.tradeoffs },
        { title: 'Examples', bullets: entry.data.examples },
        ...(notes ? [{ title: 'Notes', paragraphs: [notes] }] : [])
      ],
      diagrams
    });
  });

  patterns.forEach((entry, index) => {
    const notes = firstParagraph(entry.body);
    const diagrams = extractMermaidBlocks(entry.body);
    pushNode({
      id: entry.data.id,
      role: 'item',
      type: 'pattern',
      title: entry.data.title,
      summary: entry.data.summary,
      href: roadmapTopicHref(entrySlug(entry.id)),
      x: 560,
      y: 188 + index * 98,
      sections: [
        { title: 'Overview', paragraphs: [entry.data.why_it_exists] },
        { title: 'Problem', paragraphs: [entry.data.problem] },
        { title: 'When To Use', bullets: entry.data.when_to_use },
        { title: 'When Not To Use', bullets: entry.data.when_not_to_use },
        { title: 'Tradeoffs', bullets: entry.data.tradeoffs },
        { title: 'Examples', bullets: entry.data.examples },
        { title: 'Common Mistakes', bullets: entry.data.common_mistakes },
        ...(notes ? [{ title: 'Notes', paragraphs: [notes] }] : [])
      ],
      diagrams
    });
  });

  scenarios.forEach((entry, index) => {
    const notes = firstParagraph(entry.body);
    const diagrams = extractMermaidBlocks(entry.body);
    pushNode({
      id: entry.data.id,
      role: 'item',
      type: 'scenario',
      title: entry.data.title,
      summary: entry.data.summary,
      href: roadmapTopicHref(entrySlug(entry.id)),
      x: 170,
      y: 188 + index * 120,
      sections: [
        { title: 'Core Problem', paragraphs: [entry.data.core_problem] },
        { title: 'Functional Requirements', bullets: entry.data.functional_requirements },
        { title: 'Non-Functional Requirements', bullets: entry.data.non_functional_requirements },
        { title: 'Initial Design', paragraphs: [entry.data.initial_design] },
        { title: 'Design Steps', bullets: entry.data.design_steps },
        { title: 'Architecture Variants', bullets: entry.data.architecture_variants },
        ...(notes ? [{ title: 'Notes', paragraphs: [notes] }] : [])
      ],
      diagrams
    });
  });

  const addDependency = (source: string, target: string) => {
    if (!nodeIds.has(source)) {
      throw new Error(`Roadmap dependency source not found: ${source}`);
    }
    if (!nodeIds.has(target)) {
      throw new Error(`Roadmap dependency target not found: ${target}`);
    }
    pushUniqueEdge(edges, seenEdges, { kind: 'dependency', source, target });
  };

  const addRelated = (source: string, target: string) => {
    if (!nodeIds.has(source) || !nodeIds.has(target)) {
      return;
    }
    pushUniqueEdge(edges, seenEdges, { kind: 'related', source, target });
  };

  concepts.forEach((entry) => {
    const id = entry.data.id;
    toList(entry.data.depends_on_concepts).forEach((dependencyId) => addDependency(dependencyId, id));

    const relatedConcepts = [
      ...toList(entry.data.related_to_concepts),
      ...toList(entry.data.related_concepts)
    ];
    relatedConcepts.forEach((relatedId) => addRelated(id, relatedId));

    const relatedPatterns = [
      ...toList(entry.data.related_to_patterns),
      ...toList(entry.data.related_patterns)
    ];
    relatedPatterns.forEach((relatedId) => addRelated(id, relatedId));

    toList(entry.data.related_to_scenarios).forEach((relatedId) => addRelated(id, relatedId));
  });

  patterns.forEach((entry) => {
    const id = entry.data.id;

    toList(entry.data.depends_on_concepts).forEach((dependencyId) => addDependency(dependencyId, id));
    toList(entry.data.depends_on_patterns).forEach((dependencyId) => addDependency(dependencyId, id));

    const relatedConcepts = [
      ...toList(entry.data.related_to_concepts),
      ...toList(entry.data.related_concepts)
    ];
    relatedConcepts.forEach((relatedId) => addRelated(id, relatedId));

    const relatedPatterns = [
      ...toList(entry.data.related_to_patterns),
      ...toList(entry.data.related_patterns)
    ];
    relatedPatterns.forEach((relatedId) => addRelated(id, relatedId));

    const relatedScenarios = [
      ...toList(entry.data.related_to_scenarios),
      ...toList(entry.data.related_scenarios)
    ];
    relatedScenarios.forEach((relatedId) => addRelated(id, relatedId));
  });

  scenarios.forEach((entry) => {
    const id = entry.data.id;

    toList(entry.data.depends_on_concepts).forEach((dependencyId) => addDependency(dependencyId, id));
    toList(entry.data.depends_on_patterns).forEach((dependencyId) => addDependency(dependencyId, id));

    const relatedConcepts = [
      ...toList(entry.data.related_to_concepts),
      ...toList(entry.data.concept_links)
    ];
    relatedConcepts.forEach((relatedId) => addRelated(id, relatedId));

    const relatedPatterns = [
      ...toList(entry.data.related_to_patterns),
      ...toList(entry.data.related_patterns)
    ];
    relatedPatterns.forEach((relatedId) => addRelated(id, relatedId));

    toList(entry.data.related_to_scenarios).forEach((relatedId) => addRelated(id, relatedId));
  });

  return { nodes, edges };
}
