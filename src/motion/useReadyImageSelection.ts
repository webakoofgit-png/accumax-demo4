import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject, type SetStateAction } from 'react';
import './image-crossfade.css';

/** Prepare carousel images near the viewport and commit only decoded selections. */
export function useReadyImageSelection(root: RefObject<HTMLElement>, sources: readonly string[], enabled = true) {
  const [target, setTarget] = useState({ index: 0 });
  const setRequested = useCallback((update: SetStateAction<number>) => {
    setTarget(current => ({ index: typeof update === 'function' ? update(current.index) : update }));
  }, []);
  const [selection, setSelection] = useState({ active: 0, previous: 0 });
  const images = useRef(new Map<string, { image: HTMLImageElement; ready: boolean; decoded: Promise<boolean> }>());

  const prepare = useCallback((src: string, speculative = false) => {
    const existing = images.current.get(src);
    if (existing) return existing;

    const image = new Image();
    image.decoding = 'async';
    if (speculative) image.fetchPriority = 'low';
    image.src = src;
    const entry = { image, ready: false, decoded: image.decode().then(() => {
      entry.ready = true;
      return true;
    }, () => {
      images.current.delete(src);
      return false;
    }) };
    images.current.set(src, entry);
    return entry;
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      sources.forEach(src => prepare(src, true));
    }, { rootMargin: '400px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, prepare, root, sources]);

  useLayoutEffect(() => {
    if (!enabled || target.index === selection.active) return;
    const entry = prepare(sources[target.index]);
    const commit = () => setSelection({ active: target.index, previous: selection.active });
    if (entry.ready) {
      commit();
      return;
    }
    entry.image.fetchPriority = 'auto';
    let current = true;
    void entry.decoded.then(ready => { if (current && ready) commit(); });
    return () => { current = false; };
  }, [enabled, prepare, selection.active, sources, target]);

  return { ...selection, requested: target.index, setRequested };
}
