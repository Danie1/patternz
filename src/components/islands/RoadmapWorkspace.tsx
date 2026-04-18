import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import mermaid from 'mermaid';
import SaveScenarioButton from '@/components/islands/SaveScenarioButton';
import { loadProgress, setNodeReviewed, trackView, type ProgressState } from '@/lib/progress';
import type { RoadmapGraph, RoadmapNode } from '@/lib/content';

type Props = {
  graph: RoadmapGraph;
};

function getTopicFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('topic');
}

function setTopicInUrl(topic: string | null) {
  const url = new URL(window.location.href);
  if (topic) {
    url.searchParams.set('topic', topic);
  } else {
    url.searchParams.delete('topic');
  }
  window.history.pushState({}, '', url);
}

function getNodeSlug(node: RoadmapNode) {
  if (!node.href) {
    return node.id;
  }

  const [, query = ''] = node.href.split('?');
  const topic = new URLSearchParams(query).get('topic');
  return topic ?? node.id;
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((node) => !node.hasAttribute('disabled'));
}

function formatRelativeTime(value: string | undefined) {
  if (!value) return 'No study activity yet';

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'No study activity yet';

  const diffMs = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `Last studied ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `Last studied ${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.max(1, Math.round(diffMs / day));
  return `Last studied ${days} day${days === 1 ? '' : 's'} ago`;
}

function rankForSession(id: string, seed: number) {
  let hash = Math.floor(seed * 1000003);
  for (const char of id) {
    hash = (hash * 33 + char.charCodeAt(0)) % 2147483647;
  }
  return hash;
}

export default function RoadmapWorkspace({ graph }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const [progressState, setProgressState] = useState<ProgressState>(() => loadProgress());
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [sessionSeed] = useState(() => Math.random());
  const drawerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedNodeRef = useRef<HTMLElement | null>(null);
  const previousCompletedRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const updateWidth = () => {
      setStageWidth(node.clientWidth - 24);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const nodeById = useMemo(() => {
    const map = new Map<string, RoadmapNode>();
    graph.nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [graph.nodes]);

  const nodeByTopic = useMemo(() => {
    const map = new Map<string, RoadmapNode>();
    graph.nodes.forEach((node) => {
      if (node.role !== 'item') return;
      map.set(node.id, node);
      map.set(getNodeSlug(node), node);
    });
    return map;
  }, [graph.nodes]);

  const selectedNode = selectedId ? nodeById.get(selectedId) ?? null : null;
  const selectedContextId = selectedNode?.role === 'item' ? selectedId : null;
  const hoveredNode = hoveredId ? nodeById.get(hoveredId) ?? null : null;
  const hoveredContextId = hoveredNode?.role === 'item' ? hoveredId : null;
  const activeContextId = selectedContextId ?? hoveredContextId;

  const connectedNodeIds = useMemo(() => {
    if (!activeContextId) return new Set<string>();
    const ids = new Set<string>([activeContextId]);
    graph.edges.forEach((edge) => {
      if (edge.source === activeContextId || edge.target === activeContextId) {
        ids.add(edge.source);
        ids.add(edge.target);
      }
    });
    return ids;
  }, [activeContextId, graph.edges]);

  const connectionTypeById = useMemo(() => {
    const map = new Map<string, 'related' | 'dependency'>();
    if (!activeContextId) return map;

    graph.edges.forEach((edge) => {
      if (edge.source !== activeContextId && edge.target !== activeContextId) {
        return;
      }

      const otherId = edge.source === activeContextId ? edge.target : edge.source;
      const current = map.get(otherId);

      if (edge.kind === 'dependency') {
        map.set(otherId, 'dependency');
      } else if (!current) {
        map.set(otherId, 'related');
      }
    });

    return map;
  }, [activeContextId, graph.edges]);

  const maxY = useMemo(() => Math.max(...graph.nodes.map((node) => node.y), 0), [graph.nodes]);
  const canvasWidth = Math.max(stageWidth, 560);
  const canvasHeight = maxY + 240;
  const columnSidePadding = 16;
  const minColumnGap = 12;
  const nodeWidth = useMemo(() => {
    const usableWidth = canvasWidth - columnSidePadding * 2 - minColumnGap * 2;
    const widthPerColumn = Math.floor(usableWidth / 3);
    return Math.min(220, Math.max(130, widthPerColumn));
  }, [canvasWidth]);

  const columnGap = useMemo(() => {
    const remaining = canvasWidth - columnSidePadding * 2 - nodeWidth * 3;
    return Math.max(minColumnGap, remaining / 2);
  }, [canvasWidth, nodeWidth]);

  const columnCenterByType = useMemo(() => {
    const left = columnSidePadding + nodeWidth / 2;
    const gap = nodeWidth + columnGap;
    return {
      scenario: left,
      pattern: left + gap,
      concept: left + gap * 2
    };
  }, [columnGap, nodeWidth]);

  const separatorXs = useMemo(() => {
    const first = (columnCenterByType.scenario + columnCenterByType.pattern) / 2;
    const second = (columnCenterByType.pattern + columnCenterByType.concept) / 2;
    return [first, second];
  }, [columnCenterByType]);

  const reviewedSet = useMemo(() => new Set(progressState.reviewedNodeIds), [progressState.reviewedNodeIds]);

  const itemNodes = useMemo(() => graph.nodes.filter((node) => node.role === 'item'), [graph.nodes]);

  const totalsByType = useMemo(
    () => ({
      concept: itemNodes.filter((node) => node.type === 'concept').length,
      pattern: itemNodes.filter((node) => node.type === 'pattern').length,
      scenario: itemNodes.filter((node) => node.type === 'scenario').length
    }),
    [itemNodes]
  );

  const completedByType = useMemo(
    () => ({
      concept: itemNodes.filter((node) => node.type === 'concept' && reviewedSet.has(node.id)).length,
      pattern: itemNodes.filter((node) => node.type === 'pattern' && reviewedSet.has(node.id)).length,
      scenario: itemNodes.filter((node) => node.type === 'scenario' && reviewedSet.has(node.id)).length
    }),
    [itemNodes, reviewedSet]
  );

  const overallTotal = totalsByType.concept + totalsByType.pattern + totalsByType.scenario;
  const overallCompleted = completedByType.concept + completedByType.pattern + completedByType.scenario;

  const recentEntries = useMemo(() => progressState.recentlyViewed.slice(0, 3), [progressState.recentlyViewed]);

  const uncheckedNextUp = useMemo(() => {
    return itemNodes
      .filter((node) => !reviewedSet.has(node.id))
      .sort((left, right) => rankForSession(left.id, sessionSeed) - rankForSession(right.id, sessionSeed))
      .slice(0, 3);
  }, [itemNodes, reviewedSet, sessionSeed]);

  const lastStudiedAt = recentEntries[0]?.viewedAt ?? progressState.lastActiveDate;

  const markReviewed = (nodeId: string, reviewed: boolean) => {
    const nextState = setNodeReviewed(nodeId, reviewed);
    setProgressState(nextState);
  };

  const openNode = (nodeId: string, trigger?: HTMLElement | null) => {
    const node = nodeById.get(nodeId);
    if (!node) return;
    if (selectedId === nodeId) {
      closeDrawer();
      return;
    }
    if (trigger) {
      lastFocusedNodeRef.current = trigger;
    }
    setSelectedId(nodeId);
    if (node.role === 'item') {
      setTopicInUrl(nodeId);
    } else {
      setTopicInUrl(null);
    }
  };

  const closeDrawer = () => {
    setSelectedId(null);
    setHoveredId(null);
    setTopicInUrl(null);
  };

  useEffect(() => {
    const initialTopic = getTopicFromUrl();
    const initialNode = initialTopic ? nodeByTopic.get(initialTopic) : null;
    if (initialNode?.role === 'item') {
      setSelectedId(initialNode.id);
    }

    const onPopState = () => {
      const topic = getTopicFromUrl();
      const nextNode = topic ? nodeByTopic.get(topic) : null;
      if (nextNode?.role === 'item') {
        setSelectedId(nextNode.id);
      } else {
        setSelectedId(null);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [nodeByTopic]);

  useEffect(() => {
    const isOverlayOpen = Boolean(selectedNode && !isDesktop);
    document.body.classList.toggle('roadmap-drawer-open', isOverlayOpen);

    if (!selectedNode) {
      if (lastFocusedNodeRef.current) {
        lastFocusedNodeRef.current.focus();
      }
      return;
    }

    const closeButton = drawerRef.current?.querySelector<HTMLButtonElement>('[data-drawer-close="true"]');
    closeButton?.focus();
  }, [isDesktop, selectedNode]);

  useEffect(() => {
    if (!selectedNode || selectedNode.role !== 'item') return;
    if (!selectedNode.diagrams.length) return;

    const w = window as Window & { __patternzMermaidInitialized?: boolean };
    if (!w.__patternzMermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default'
      });
      w.__patternzMermaidInitialized = true;
    }

    const nodes = drawerRef.current?.querySelectorAll<HTMLElement>('pre.mermaid:not([data-mermaid-rendered="true"])') ?? [];
    for (const node of nodes) {
      node.setAttribute('data-mermaid-rendered', 'true');
      mermaid.run({ nodes: [node] });
    }
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNode || selectedNode.role !== 'item') return;
    if (selectedNode.type === 'concept') return;

    const nextState = trackView({
      id: selectedNode.id,
      type: selectedNode.type,
      title: selectedNode.title,
      slug: getNodeSlug(selectedNode)
    });
    setProgressState(nextState);
  }, [selectedNode]);

  useEffect(() => {
    if (overallCompleted > previousCompletedRef.current) {
      setIsCelebrating(true);
      const timeout = window.setTimeout(() => setIsCelebrating(false), 1100);
      previousCompletedRef.current = overallCompleted;
      return () => window.clearTimeout(timeout);
    }

    previousCompletedRef.current = overallCompleted;
    return undefined;
  }, [overallCompleted]);

  useEffect(() => {
    if (!selectedNode) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable(drawerRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNode]);

  const typeLabel = (nodeType: RoadmapNode['type']) => {
    if (nodeType === 'concept') return 'Concept';
    if (nodeType === 'pattern') return 'Pattern';
    return 'Scenario';
  };

  const drawerSections = selectedNode?.sections ?? [];
  const overviewIndex = drawerSections.findIndex((section) => section.title.toLowerCase() === 'overview');
  const splitIndex = overviewIndex >= 0 ? overviewIndex + 1 : 0;
  const preDiagramSections = drawerSections.slice(0, splitIndex);
  const postDiagramSections = drawerSections.slice(splitIndex);

  return (
    <section class="roadmap-app" aria-label="Architecture roadmap workspace">
      <header class="roadmap-header card">
        <div>
          <p class="kicker">Roadmap workspace</p>
          <h1 class="roadmap-title">Explore the architecture knowledge map</h1>
        </div>
        <div class={`roadmap-progress-summary ${isCelebrating ? 'is-celebrating' : ''}`} aria-label="Roadmap progress summary">
          <span class="roadmap-progress-label">Your progress</span>
          <div class="roadmap-progress-bar" role="img" aria-label={`Progress ${overallCompleted} of ${overallTotal}`}>
            <span
              class="roadmap-progress-fill roadmap-progress-fill-scenario"
              style={{ width: `${overallTotal ? (completedByType.scenario / overallTotal) * 100 : 0}%` }}
            />
            <span
              class="roadmap-progress-fill roadmap-progress-fill-pattern"
              style={{ width: `${overallTotal ? (completedByType.pattern / overallTotal) * 100 : 0}%` }}
            />
            <span
              class="roadmap-progress-fill roadmap-progress-fill-concept"
              style={{ width: `${overallTotal ? (completedByType.concept / overallTotal) * 100 : 0}%` }}
            />
          </div>
          <span class="roadmap-progress-count">({overallCompleted}/{overallTotal})</span>
          <div class="roadmap-progress-meta">
            <span class="roadmap-progress-streak">Streak: {progressState.streakDays} day{progressState.streakDays === 1 ? '' : 's'}</span>
            <span class="roadmap-progress-last">{formatRelativeTime(lastStudiedAt)}</span>
          </div>
        </div>
      </header>

      <div class="roadmap-workspace">
        <div class="roadmap-stage card" aria-label="Knowledge map canvas" ref={stageRef}>
          <div class="roadmap-canvas" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
            <div class="roadmap-separator roadmap-separator-horizontal" style={{ top: '128px' }} />
            {separatorXs.map((separatorX, index) => (
              <div
                key={`separator-${index}`}
                class="roadmap-separator roadmap-separator-vertical"
                style={{ left: `${separatorX}px`, top: '0px', height: `${canvasHeight}px` }}
              />
            ))}
            {graph.nodes.map((node) => {
              const active = selectedId === node.id;
              const connected = activeContextId ? connectedNodeIds.has(node.id) : true;
              const connectionType = connectionTypeById.get(node.id);
              const resolvedLeft = columnCenterByType[node.type];
              const reviewed = node.role === 'item' && reviewedSet.has(node.id);
              const nodeTitle =
                node.role === 'group'
                  ? `${node.title} (${completedByType[node.type]}/${totalsByType[node.type]})`
                  : node.title;
              return (
                <div
                  key={node.id}
                  class={`roadmap-node ${node.role === 'group' ? 'roadmap-group-node' : ''} ${node.type} ${active ? 'is-active' : ''} ${connected ? 'is-connected' : 'is-muted'} ${connectionType === 'dependency' ? 'is-dependency' : ''} ${connectionType === 'related' ? 'is-related' : ''} ${reviewed ? 'is-reviewed' : ''}`}
                  style={{ left: `${resolvedLeft}px`, top: `${node.y}px`, width: `${nodeWidth}px` }}
                >
                  {node.role === 'item' ? (
                    <label class="roadmap-node-checkbox" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={reviewed}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => markReviewed(node.id, (event.target as HTMLInputElement).checked)}
                        aria-label={`Mark ${node.title} as reviewed`}
                      />
                    </label>
                  ) : null}

                  <button
                    type="button"
                    class="roadmap-node-trigger"
                    onClick={(event) => openNode(node.id, event.currentTarget as HTMLElement)}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId((current) => (current === node.id ? null : current))}
                    onFocus={() => setHoveredId(node.id)}
                    onBlur={() => setHoveredId((current) => (current === node.id ? null : current))}
                    aria-haspopup="dialog"
                    aria-expanded={active}
                    aria-controls="roadmap-drawer"
                    data-node-id={node.id}
                  >
                    <span class="roadmap-node-type">{typeLabel(node.type)}</span>
                    <strong>{nodeTitle}</strong>
                  </button>
                </div>
              );
            })}
          </div>
        </div>


        <aside
          id="roadmap-drawer"
          ref={drawerRef}
          class={`roadmap-drawer ${selectedNode ? 'is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-drawer-title"
          aria-hidden={selectedNode ? 'false' : 'true'}
        >
          {selectedNode ? (
            <div class="roadmap-drawer-content">
              <div class="roadmap-drawer-head">
                <p class="kicker" style={{ margin: 0 }}>{typeLabel(selectedNode.type)}</p>
                <button
                  type="button"
                  class="button"
                  onClick={closeDrawer}
                  data-drawer-close="true"
                  aria-label="Close details"
                >
                  Close
                </button>
              </div>
              <h2 id="roadmap-drawer-title">{selectedNode.title}</h2>
              <p class="muted">{selectedNode.summary}</p>

              {selectedNode.role === 'item' && selectedNode.type === 'scenario' ? (
                <SaveScenarioButton
                  id={selectedNode.id}
                  title={selectedNode.title}
                  slug={getNodeSlug(selectedNode)}
                />
              ) : null}

              {preDiagramSections.map((section) => (
                <section class="roadmap-drawer-section" key={`${selectedNode.id}-${section.title}`}>
                  <h3>{section.title}</h3>
                  {section.paragraphs?.map((paragraph) => <p>{paragraph}</p>)}
                  {section.bullets?.length ? (
                    <ul>
                      {section.bullets.map((item) => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {selectedNode.diagrams.length ? (
                <section class="roadmap-drawer-section">
                  <h3>Diagrams</h3>
                  {selectedNode.diagrams.map((code, index) => (
                    <pre class="mermaid" key={`${selectedNode.id}-diagram-${index}`} style="white-space:pre-wrap; margin:0;">{code}</pre>
                  ))}
                </section>
              ) : null}

              {postDiagramSections.map((section) => (
                <section class="roadmap-drawer-section" key={`${selectedNode.id}-${section.title}`}>
                  <h3>{section.title}</h3>
                  {section.paragraphs?.map((paragraph) => <p>{paragraph}</p>)}
                  {section.bullets?.length ? (
                    <ul>
                      {section.bullets.map((item) => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          ) : (
            <div class="roadmap-drawer-content">
              <div class="roadmap-drawer-head">
                <p class="kicker" style={{ margin: 0 }}>Inspection panel</p>
              </div>
              <h2 id="roadmap-drawer-title">Select a node</h2>
              <p class="muted">Pick up where you left off or jump into an unchecked topic.</p>

              <section class="roadmap-drawer-section">
                <h3>Recently Viewed</h3>
                {recentEntries.length ? (
                  <ul>
                    {recentEntries.map((entry) => {
                      const node = itemNodes.find((item) => item.id === entry.id) ?? itemNodes.find((item) => getNodeSlug(item) === entry.slug);
                      if (!node) {
                        return null;
                      }

                      return (
                        <li>
                          <button type="button" class="roadmap-drawer-link" onClick={(event) => openNode(node.id, event.currentTarget as HTMLElement)}>
                            {node.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p class="muted">No recent activity yet. Open any pattern or scenario to start building history.</p>
                )}
              </section>

              <section class="roadmap-drawer-section">
                <h3>Next Up</h3>
                {uncheckedNextUp.length ? (
                  <ul>
                    {uncheckedNextUp.map((node) => (
                      <li>
                        <button type="button" class="roadmap-drawer-link" onClick={(event) => openNode(node.id, event.currentTarget as HTMLElement)}>
                          {node.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p class="muted">Everything is checked off. Revisit a favorite topic or review your recent history.</p>
                )}
              </section>
            </div>
          )}
        </aside>
      </div>

      <div
        class={`roadmap-scrim ${selectedNode && !isDesktop ? 'is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden={selectedNode && !isDesktop ? 'false' : 'true'}
      />
    </section>
  );
}
