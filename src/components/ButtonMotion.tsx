import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Give primary actions the same pointer response on every route. */
export function ButtonMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const selector = '.button:not(.light), .enquiry-popup-submit';
    let active: HTMLElement | null = null;
    let pressed: HTMLElement | null = null;
    const release = () => { pressed?.removeAttribute('data-pressed'); pressed = null; };
    const press = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      release();
      const button = event.target instanceof Element ? event.target.closest<HTMLElement>('.button,.site-cta,.enquiry-popup-submit') : null;
      if (!button || button.matches(':disabled,[aria-disabled="true"]')) return;
      pressed = button;
      button.setAttribute('data-pressed', 'true');
    };
    let bounds: DOMRect | null = null;
    const reset = () => {
      active?.style.removeProperty('--cta-magnet-x');
      active?.style.removeProperty('--cta-magnet-y');
      active = null;
      bounds = null;
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') { reset(); return; }
      const button = event.target instanceof Element ? event.target.closest<HTMLElement>(selector) : null;
      if (!button || button.matches(':disabled,[aria-disabled="true"]')) { reset(); return; }
      if (active !== button) { reset(); active = button; bounds = button.getBoundingClientRect(); }
      if (!bounds) return;
      const x = Math.max(-10, Math.min(10, (event.clientX - bounds.left - bounds.width / 2) * .12));
      const y = Math.max(-7, Math.min(7, (event.clientY - bounds.top - bounds.height / 2) * .18));
      button.style.setProperty('--cta-magnet-x', x + 'px');
      button.style.setProperty('--cta-magnet-y', y + 'px');
    };
    const leave = (event: PointerEvent) => {
      if (active && (!(event.relatedTarget instanceof Node) || !active.contains(event.relatedTarget))) reset();
    };
    document.addEventListener('pointerdown', press, { passive: true });
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    document.addEventListener('scroll', release, { passive: true, capture: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', leave);
    document.addEventListener('scroll', reset, { passive: true, capture: true });
    window.addEventListener('blur', reset);
    media.addEventListener('change', reset);
    return () => {
      release();
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      document.removeEventListener('scroll', release, true);
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('scroll', reset, true);
      window.removeEventListener('blur', reset);
      media.removeEventListener('change', reset);
    };
  }, [pathname]);
  return null;
}
