import { useMemo, useState } from 'preact/hooks';

type Item = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: string;
  complexity: string;
  tags: string[];
  estimated_read_time: number;
  importance: number;
  relatedScenarioCount: number;
};

type Props = {
  items: Item[];
};

export default function FilterBar({ items }: Props) {
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [complexity, setComplexity] = useState('all');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState('importance');

  const categories = useMemo(() => ['all', ...new Set(items.map((i) => i.category))], [items]);
  const tags = useMemo(() => ['all', ...new Set(items.flatMap((i) => i.tags))], [items]);

  const results = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesQ = `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase());
      return (
        matchesQ &&
        (level === 'all' || item.level === level) &&
        (category === 'all' || item.category === category) &&
        (complexity === 'all' || item.complexity === complexity) &&
        (tag === 'all' || item.tags.includes(tag))
      );
    });

    filtered.sort((a, b) => {
      if (sort === 'read') return a.estimated_read_time - b.estimated_read_time;
      if (sort === 'beginner') return a.level.localeCompare(b.level);
      return b.importance - a.importance;
    });

    return filtered;
  }, [items, q, level, category, complexity, tag, sort]);

  return (
    <section class="card" style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.7rem', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))' }}>
        <input class="search-input" placeholder="Search patterns" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
        <select class="search-input" value={level} onChange={(e) => setLevel((e.target as HTMLSelectElement).value)}>
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select class="search-input" value={category} onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}>
          {categories.map((value) => (
            <option value={value}>{value === 'all' ? 'All categories' : value}</option>
          ))}
        </select>
        <select class="search-input" value={complexity} onChange={(e) => setComplexity((e.target as HTMLSelectElement).value)}>
          <option value="all">All complexity</option>
          <option value="low">Low complexity</option>
          <option value="medium">Medium complexity</option>
          <option value="high">High complexity</option>
        </select>
        <select class="search-input" value={tag} onChange={(e) => setTag((e.target as HTMLSelectElement).value)}>
          {tags.map((value) => (
            <option value={value}>{value === 'all' ? 'All tags' : value}</option>
          ))}
        </select>
        <select class="search-input" value={sort} onChange={(e) => setSort((e.target as HTMLSelectElement).value)}>
          <option value="importance">Most important</option>
          <option value="read">Shortest read</option>
          <option value="beginner">Beginner-friendly</option>
        </select>
      </div>

      <div class="grid-cards">
        {results.map((item) => (
          <article class="card" style={{ boxShadow: 'none' }}>
            <h3 style={{ margin: 0 }}>
              <a href={`/patterns/${item.slug}`}>{item.title}</a>
            </h3>
            <p class="muted">{item.summary}</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span class="badge">{item.category}</span>
              <span class="badge">{item.level}</span>
              <span class="badge">{item.estimated_read_time} min</span>
              <span class="badge">{item.relatedScenarioCount} scenarios</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
