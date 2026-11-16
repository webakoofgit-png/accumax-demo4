import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Mirror hover feedback during a touch or pen press without moving the hit target. */
export function ButtonMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    let pressed: HTMLElement | null = null;
    const release = () => {
      pressed?.removeAttribute('data-pressed');
      pressed = null;
    };
    const press = (event: PointerEvent) => {
      release();
      if (event.pointerType === 'mouse') return;
      const button = event.target instanceof Element
        ? event.target.closest<HTMLElement>('.button, .site-cta, .enquiry-popup-submit')
        : null;
      if (!button || button.matches(':disabled, [aria-disabled="true"]')) return;
      pressed = button;
      button.setAttribute('data-pressed', 'true');
    };
    document.addEventListener('pointerdown', press, { passive: true });
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    document.addEventListener('scroll', release, { passive: true, capture: true });
    window.addEventListener('blur', release);
    return () => {
      release();
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      document.removeEventListener('scroll', release, true);
      window.removeEventListener('blur', release);
    };
  }, [pathname]);
  return null;
}
