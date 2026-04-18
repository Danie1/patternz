import { useEffect, useState } from 'preact/hooks';
import { loadProgress } from '@/lib/progress';

function roadmapHref(slug: string) {
  return `/?topic=${encodeURIComponent(slug)}`;
}

export default function ProgressTracker() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState(loadProgress());

  useEffect(() => {
    setState(loadProgress());
    setReady(true);
  }, []);

  if (!ready) {
    return <p class="muted">Loading local progress...</p>;
  }

  const recommendation = state.recentlyViewed[0];

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <article class="card">
        <h2 style={{ marginTop: 0 }}>Completion summary</h2>
        <p class="muted">Streak: {state.streakDays} day(s)</p>
        <p class="muted">Completed quizzes: {state.completedQuizzes.length}</p>
        <p class="muted" style={{ marginBottom: 0 }}>Saved scenarios: {state.savedScenarios.length}</p>
      </article>

      <article class="card">
        <h3 style={{ marginTop: 0 }}>Completed quizzes</h3>
        {state.completedQuizzes.length === 0 ? (
          <p class="muted">No completed quizzes yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.45rem' }}>
            {state.completedQuizzes.map((quiz) => (
              <li>
                <a href={`/quiz/${quiz.slug}`}>{quiz.title}</a> ({quiz.score}%)
              </li>
            ))}
          </ul>
        )}
      </article>

      <article class="card">
        <h3 style={{ marginTop: 0 }}>Saved scenarios</h3>
        {state.savedScenarios.length === 0 ? (
          <p class="muted">No saved scenarios yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.45rem' }}>
            {state.savedScenarios.map((scenario) => (
              <li>
                <a href={roadmapHref(scenario.slug)}>{scenario.title}</a>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article class="card">
        <h3 style={{ marginTop: 0 }}>Recently viewed patterns and scenarios</h3>
        {state.recentlyViewed.length === 0 ? (
          <p class="muted">No recent activity yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.45rem' }}>
            {state.recentlyViewed.map((entry) => (
              <li>
                <a href={roadmapHref(entry.slug)}>{entry.title}</a>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article class="card">
        <h3 style={{ marginTop: 0 }}>Recommended next step</h3>
        {recommendation ? (
          <a href={roadmapHref(recommendation.slug)}>
            Continue with {recommendation.title}
          </a>
        ) : (
          <a href="/">Start with the roadmap</a>
        )}
      </article>
    </section>
  );
}
