import { useEffect, useState } from 'preact/hooks';
import { loadProgress } from '@/lib/progress';

export default function ContinueLearning() {
  const [items, setItems] = useState(loadProgress().recentlyViewed.slice(0, 3));

  useEffect(() => {
    setItems(loadProgress().recentlyViewed.slice(0, 3));
  }, []);

  return (
    <section class="card">
      <h2 style={{ marginTop: 0 }}>Recently viewed</h2>
      {items.length === 0 ? (
        <p class="muted">No history yet. Start with a featured pattern.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.45rem' }}>
          {items.map((entry) => (
            <li>
              <a href={`/?topic=${encodeURIComponent(entry.slug)}`}>{entry.title}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
