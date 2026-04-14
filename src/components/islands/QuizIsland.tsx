import { useMemo, useState } from 'preact/hooks';
import { completeQuiz } from '@/lib/progress';

type Question = {
  id: string;
  prompt: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'scenario_step';
  options: string[];
  correct_answer: string | string[];
  explanation: string;
  related_pattern_ids: string[];
  hint: string;
  difficulty: string;
};

type Props = {
  id: string;
  title: string;
  slug: string;
  questions: Question[];
};

export default function QuizIsland({ id, title, slug, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[index];
  const correctAnswers = useMemo(
    () => (Array.isArray(current.correct_answer) ? current.correct_answer : [current.correct_answer]),
    [current.correct_answer]
  );

  const isCorrect =
    submitted &&
    selected.length === correctAnswers.length &&
    selected.every((value) => correctAnswers.includes(value));

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    if (
      selected.length === correctAnswers.length &&
      selected.every((value) => correctAnswers.includes(value))
    ) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const finalScore = submitted && isCorrect ? score : score;
      completeQuiz({ id, title, slug, score: Math.round((finalScore / questions.length) * 100) });
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setSubmitted(false);
  };

  const toggleOption = (value: string) => {
    if (submitted) return;
    if (current.type === 'multiple_choice') {
      setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    } else {
      setSelected([value]);
    }
  };

  return (
    <section class="card" style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p class="kicker">Question {index + 1} of {questions.length}</p>
        <h2 style={{ margin: 0 }}>{current.prompt}</h2>
      </div>

      <div style={{ display: 'grid', gap: '0.6rem' }}>
        {current.options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              type="button"
              class="button"
              style={{ textAlign: 'left', background: active ? 'var(--accent-soft)' : undefined }}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button class="button primary" type="button" disabled={selected.length === 0} onClick={submit}>
          Check answer
        </button>
        <button class="button" type="button" onClick={next}>
          {index + 1 === questions.length ? 'Finish' : 'Next question'}
        </button>
      </div>

      {!submitted ? <p class="muted">Hint: {current.hint}</p> : null}
      {submitted ? (
        <article class="card" style={{ boxShadow: 'none', borderStyle: isCorrect ? 'solid' : 'dashed' }}>
          <p style={{ marginTop: 0, fontWeight: 700 }}>{isCorrect ? 'Correct' : 'Not quite yet'}</p>
          <p>{current.explanation}</p>
          <p class="muted" style={{ marginBottom: 0 }}>
            Related patterns: {current.related_pattern_ids.join(', ')}
          </p>
        </article>
      ) : null}
    </section>
  );
}
