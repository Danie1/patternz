export type ProgressState = {
  recentlyViewed: Array<{ id: string; type: 'pattern' | 'scenario'; title: string; slug: string; viewedAt: string }>;
  completedQuizzes: Array<{ id: string; title: string; slug: string; completedAt: string; score: number }>;
  savedScenarios: Array<{ id: string; title: string; slug: string; savedAt: string }>;
  reviewedNodeIds: string[];
  streakDays: number;
  lastActiveDate?: string;
};

const STORAGE_KEY = 'patternz.progress.v1';

export const progressStorageKey = STORAGE_KEY;

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') {
    return emptyProgress();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyProgress();
    }

    const parsed = JSON.parse(raw) as ProgressState;
    return {
      ...emptyProgress(),
      ...parsed,
      recentlyViewed: (parsed.recentlyViewed ?? []).filter((item) => item.type === 'pattern' || item.type === 'scenario'),
      completedQuizzes: parsed.completedQuizzes ?? [],
      savedScenarios: parsed.savedScenarios ?? [],
      reviewedNodeIds: Array.from(new Set(parsed.reviewedNodeIds ?? [])).filter((id) => typeof id === 'string')
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function trackView(entry: { id: string; type: 'pattern' | 'scenario'; title: string; slug: string }) {
  const state = loadProgress();
  const next = [
    {
      ...entry,
      viewedAt: new Date().toISOString()
    },
    ...state.recentlyViewed.filter((item) => !(item.id === entry.id && item.type === entry.type))
  ].slice(0, 12);

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const isConsecutive = state.lastActiveDate === yesterday;

  const nextState = {
    ...state,
    recentlyViewed: next,
    streakDays: state.lastActiveDate === today ? state.streakDays : isConsecutive ? state.streakDays + 1 : 1,
    lastActiveDate: today
  };

  saveProgress(nextState);
  return nextState;
}

export function completeQuiz(quiz: { id: string; title: string; slug: string; score: number }) {
  const state = loadProgress();
  const completed = [
    {
      ...quiz,
      completedAt: new Date().toISOString()
    },
    ...state.completedQuizzes.filter((item) => item.id !== quiz.id)
  ].slice(0, 20);

  saveProgress({
    ...state,
    completedQuizzes: completed
  });
}

export function toggleSavedScenario(scenario: { id: string; title: string; slug: string }) {
  const state = loadProgress();
  const exists = state.savedScenarios.find((item) => item.id === scenario.id);
  const savedScenarios = exists
    ? state.savedScenarios.filter((item) => item.id !== scenario.id)
    : [{ ...scenario, savedAt: new Date().toISOString() }, ...state.savedScenarios].slice(0, 20);

  saveProgress({
    ...state,
    savedScenarios
  });
}

export function setNodeReviewed(nodeId: string, reviewed: boolean) {
  const state = loadProgress();
  const current = new Set(state.reviewedNodeIds);

  if (reviewed) {
    current.add(nodeId);
  } else {
    current.delete(nodeId);
  }

  const next = {
    ...state,
    reviewedNodeIds: Array.from(current)
  };

  saveProgress(next);
  return next;
}

function emptyProgress(): ProgressState {
  return {
    recentlyViewed: [],
    completedQuizzes: [],
    savedScenarios: [],
    reviewedNodeIds: [],
    streakDays: 0
  };
}
