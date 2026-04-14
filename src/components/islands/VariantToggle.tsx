import { useState } from 'preact/hooks';

type Props = {
  variants: string[];
};

export default function VariantToggle({ variants }: Props) {
  const [index, setIndex] = useState(0);

  if (variants.length === 0) {
    return null;
  }

  return (
    <section class="card" style={{ boxShadow: 'none' }}>
      <p class="kicker">Tradeoff variant</p>
      <p style={{ marginTop: 0 }}>{variants[index]}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {variants.map((_, i) => (
          <button
            class="button"
            type="button"
            style={{ background: i === index ? 'var(--accent-soft)' : undefined }}
            onClick={() => setIndex(i)}
          >
            Option {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
