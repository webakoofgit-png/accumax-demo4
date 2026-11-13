import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { useInView } from 'framer-motion';

export function useAutoAdvance(
  root: RefObject<HTMLElement>,
  active: number,
  count: number,
  setActive: Dispatch<SetStateAction<number>>,
  reducedMotion: boolean | null,
) {
  const visible = useInView(root, { amount: .2 });

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      const section = root.current;
      if (!section || document.hidden || document.querySelector('dialog[open]')) return;
      if (section.contains(document.activeElement)) return;
      setActive(current => (current + 1) % count);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [root, active, count, setActive, reducedMotion, visible]);
}
