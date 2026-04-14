import { useEffect, useState } from 'preact/hooks';

type ThemeMode = 'light' | 'dark';
const storageKey = 'patternz.theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const initial = getInitialTheme();
    setMode(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(storageKey, next);
  };

  return (
    <button class="button" type="button" onClick={toggle} aria-label="Toggle theme">
      {mode === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}
