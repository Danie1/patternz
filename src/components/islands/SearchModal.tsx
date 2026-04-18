import { useEffect, useMemo, useState } from 'preact/hooks';
import { searchShortcut } from '@/lib/site';

type Props = {
  placeholder?: string;
};

export default function SearchModal({ placeholder = 'Search patterns, scenarios, concepts...' }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === searchShortcut) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const target = useMemo(() => {
    const encoded = encodeURIComponent(query.trim());
    return query.trim() ? `/search?q=${encoded}` : '/search';
  }, [query]);

  return (
    <>
      <button class="button" type="button" onClick={() => setOpen(true)}>
        Search
      </button>
      {open ? (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.45)',
            display: 'grid',
            placeItems: 'start center',
            paddingTop: '10vh',
            zIndex: '80'
          }}
          onClick={() => setOpen(false)}
        >
          <form
            class="card"
            style={{ width: 'min(700px, 90vw)' }}
            action="/search"
            onClick={(e) => e.stopPropagation()}
          >
            <label class="kicker" for="global-search-input">
              Search handbook
            </label>
            <input
              id="global-search-input"
              class="search-input"
              placeholder={placeholder}
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              name="q"
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
              <small class="muted">Keyboard: Cmd/Ctrl + {searchShortcut.toUpperCase()}</small>
              <a class="button primary" href={target}>
                Open search
              </a>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
