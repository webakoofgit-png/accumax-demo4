import { useEffect, useRef, type RefObject, type PointerEvent, type MouseEvent, type DragEvent } from 'react';

/** Horizontal mouse, pen and touch gestures; vertical gestures remain page scrolls. */
export function useSwipeNavigation(onSwipe: (direction: number) => void, root: RefObject<HTMLElement>) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const dragged = useRef(false);
  const latestSwipe = useRef(onSwipe);
  latestSwipe.current = onSwipe;

  useEffect(() => {
    const section = root.current;
    const area = section?.matches('[data-swipe-area]') ? section : section?.querySelector<HTMLElement>('[data-swipe-area]');
    if (!area) return;
    let total = 0, lastWheel = 0, direction = 0, handled = false;
    const wheel = (event: WheelEvent) => {
      // Pinch zoom, vertical page scrolling and the thumbnail rail remain native.
      if (event.ctrlKey || start.current || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.3 || !event.deltaX) return;
      if (event.target instanceof Element && event.target.closest('.ke-stage-tiles,input,textarea,select,[contenteditable="true"]')) return;
      const now = performance.now();
      const nextDirection = Math.sign(event.deltaX);
      if (now - lastWheel > 220 || nextDirection !== direction) {
        total = 0;
        handled = false;
      }
      lastWheel = now;
      direction = nextDirection;
      if (event.cancelable) event.preventDefault();
      if (handled) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? area.clientWidth : 1;
      total += event.deltaX * unit;
      if (Math.abs(total) < 55) return;
      handled = true;
      latestSwipe.current(direction);
    };
    area.addEventListener('wheel', wheel, { passive: false });
    return () => area.removeEventListener('wheel', wheel);
  }, [root]);
  const reset = (element: HTMLElement) => {
    start.current = null;
    element.removeAttribute('data-swiping');
    element.style.setProperty('--swipe-drag', '0px');
  };
  return {
    'data-swipe-area': true,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0 || start.current || !(event.target instanceof Element)) return;
      dragged.current = false;
      if (event.target.closest('a,button,input,textarea,select,[role="button"],[contenteditable="true"]')) return;
      start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
      if (event.pointerType === 'mouse') event.preventDefault();
      if (event.nativeEvent.isTrusted) event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      if (!origin || origin.id !== event.pointerId) return;
      const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.3) {
        reset(event.currentTarget);
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy) * 1.3) return;
      dragged.current = true;
      event.currentTarget.setAttribute('data-swiping', 'true');
      event.currentTarget.style.setProperty('--swipe-drag', `${Math.max(-80, Math.min(80, dx * .3))}px`);
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      if (!origin || origin.id !== event.pointerId) return;
      const dx = event.clientX - origin.x, dy = event.clientY - origin.y;
      const threshold = Math.min(65, Math.max(35, event.currentTarget.clientWidth * .06));
      reset(event.currentTarget);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.4) {
        dragged.current = true;
        onSwipe(dx < 0 ? 1 : -1);
      }
    },
    onPointerCancel(event: PointerEvent<HTMLElement>) { reset(event.currentTarget); },
    onLostPointerCapture(event: PointerEvent<HTMLElement>) { reset(event.currentTarget); },
    onDragStart(event: DragEvent<HTMLElement>) { event.preventDefault(); },
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (!dragged.current) return;
      event.preventDefault();
      event.stopPropagation();
      dragged.current = false;
    },
  };
}
