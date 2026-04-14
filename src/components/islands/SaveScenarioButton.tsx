import { useEffect, useState } from 'preact/hooks';
import { loadProgress, toggleSavedScenario } from '@/lib/progress';

type Props = {
  id: string;
  title: string;
  slug: string;
};

export default function SaveScenarioButton({ id, title, slug }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    setSaved(progress.savedScenarios.some((item) => item.id === id));
  }, [id]);

  const onClick = () => {
    toggleSavedScenario({ id, title, slug });
    setSaved((prev) => !prev);
  };

  return (
    <button class="button" type="button" onClick={onClick}>
      {saved ? 'Saved scenario' : 'Save scenario'}
    </button>
  );
}
