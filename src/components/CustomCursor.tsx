import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './custom-cursor.css';

const PRECISION = 'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="slider"],[data-native-cursor],video,audio,iframe,canvas,[draggable="true"]';
const CLICKABLE = 'a[href],button,summary,[role="button"],[role="link"],[role="tab"],[role="menuitem"]';
const PARTICLE_SIZES = [4, 3.5, 3, 2.5, 2, 1.5];

function isDarkSurface(element: Element) {
  for (let node: Element | null = element; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    const background = style.backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (background && background.length >= 3 && (background[3] ?? 1) > .85) {
      return background[0] * .2126 + background[1] * .7152 + background[2] * .0722 < 135;
    }
    const ink = style.color.match(/[\d.]+/g)?.map(Number);
    if (ink && Math.min(...ink.slice(0, 3)) > 220 && (ink[3] ?? 1) > .7) return true;
  }
  return false;
}

/** A precise pointer with six interpolated particles; no animation loop runs at idle. */
export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const positions = useRef(PARTICLE_SIZES.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let dispose: (() => void) | undefined;
    const configure = () => {
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      const head = host.querySelector<HTMLElement>('.ac-comet-head')!;
      const trail = host.querySelector<HTMLElement>('.ac-comet-trail')!;
      const particles = Array.from(trail.querySelectorAll<HTMLElement>('.ac-comet-particle'));
      const ripple = host.querySelector<HTMLElement>('.ac-comet-ripple')!;
      const rippleShape = host.querySelector<HTMLElement>('.ac-comet-ripple-shape')!;
      let visible = false, compact = false;
      let frame = 0, inspectFrame = 0, lastFrame = 0, lastMovement = 0;
      let target: Element | null = null;
      let rippleAnimation: Animation | undefined;
      let topLayer = typeof host.showPopover === 'function';
      if (topLayer) host.setAttribute('popover', 'manual');
      const ensureLayer = () => {
        if (topLayer && !host.matches(':popover-open')) {
          try { host.showPopover(); } catch { topLayer = false; host.removeAttribute('popover'); }
        }
      };
      const resetParticles = (x: number, y: number) => {
        positions.current.forEach((position, index) => {
          position.x = x; position.y = y;
          particles[index].style.transform = `translate3d(${x}px,${y}px,0)`;
        });
      };
      const hide = () => {
        visible = false;
        host.dataset.visible = 'false';
        host.dataset.motion = 'idle';
        trail.style.opacity = '0';
        delete document.documentElement.dataset.accumaxCursor;
        cancelAnimationFrame(frame); cancelAnimationFrame(inspectFrame);
        frame = 0; inspectFrame = 0; lastFrame = 0;
        rippleAnimation?.cancel();
      };
      const tick = (time: number) => {
        const dt = lastFrame ? Math.min(48, time - lastFrame) : 16;
        lastFrame = time;
        const idle = time - lastMovement;
        const opacity = Math.max(0, Math.min(1, (380 - idle) / 260));
        let leadX = pointer.current.x, leadY = pointer.current.y;
        positions.current.forEach((position, index) => {
          let dx = leadX - position.x, dy = leadY - position.y;
          const distance = Math.hypot(dx, dy);
          const maxGap = compact ? 10 : 19;
          // Bound the trail on fast pointer jumps so it stays a short energy signal.
          if (distance > maxGap) {
            position.x = leadX - dx / distance * maxGap;
            position.y = leadY - dy / distance * maxGap;
            dx = leadX - position.x; dy = leadY - position.y;
          }
          const ease = 1 - Math.exp(-dt / ((compact ? 24 : 42) + index * 10));
          position.x += dx * ease; position.y += dy * ease;
          particles[index].style.transform = `translate3d(${position.x}px,${position.y}px,0)`;
          leadX = position.x; leadY = position.y;
        });
        trail.style.opacity = String(opacity);
        if (visible && opacity > 0) frame = requestAnimationFrame(tick);
        else {
          frame = 0; lastFrame = 0;
          host.dataset.motion = 'idle';
          trail.style.opacity = '0';
          resetParticles(pointer.current.x, pointer.current.y);
        }
      };
      const inspect = (element: Element | null, force = false) => {
        if (!element || element.closest(PRECISION)) { target = element; hide(); return; }
        if (element === target && visible && !force) return;
        target = element;
        const control = element.closest<HTMLElement>(CLICKABLE);
        const clickable = control && !control.matches(':disabled,[aria-disabled="true"]');
        const navigation = clickable && element.closest('nav,[role="navigation"],.header,.mobile-menu');
        const image = clickable ? control.querySelector('img') : null;
        const imageBounds = image?.getBoundingClientRect();
        const imageHit = imageBounds && pointer.current.x >= imageBounds.left && pointer.current.x <= imageBounds.right && pointer.current.y >= imageBounds.top && pointer.current.y <= imageBounds.bottom;
        const mode = navigation ? 'nav' : imageHit ? 'view' : clickable ? control.matches('button,.button,summary,[role="button"],[role="tab"],[role="menuitem"]') ? 'button' : 'link' : 'default';
        host.dataset.mode = mode;
        host.dataset.tone = isDarkSurface(element) ? 'dark' : 'light';
        compact = mode !== 'default';
        ensureLayer();
        if (!topLayer && element.closest('dialog[open]')) { hide(); return; }
        if (!visible) resetParticles(pointer.current.x, pointer.current.y);
        visible = true;
        host.dataset.visible = 'true';
        document.documentElement.dataset.accumaxCursor = 'on';
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        const now = performance.now();
        const changed = Math.abs(event.clientX - pointer.current.x) + Math.abs(event.clientY - pointer.current.y) > .1;
        if (now - lastMovement > 500) resetParticles(pointer.current.x, pointer.current.y);
        pointer.current.x = event.clientX; pointer.current.y = event.clientY;
        head.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
        inspect(event.target instanceof Element ? event.target : null);
        if (visible && changed) {
          lastMovement = now;
          host.dataset.motion = 'moving';
          if (!frame) frame = requestAnimationFrame(tick);
        }
      };
      const down = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        if (!visible || event.button !== 0) return;
        rippleAnimation?.cancel();
        ripple.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
        rippleAnimation = rippleShape.animate([
          { transform: 'scale(.285714)', opacity: .4 },
          { transform: 'scale(1)', opacity: 0 },
        ], { duration: 280, easing: 'cubic-bezier(.2,.7,.3,1)' });
      };
      const scroll = () => {
        if (!visible || inspectFrame) return;
        inspectFrame = requestAnimationFrame(() => {
          inspectFrame = 0;
          inspect(document.elementFromPoint(pointer.current.x, pointer.current.y), true);
        });
      };
      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab' || event.key === 'Escape') hide(); };
      const visibility = () => { if (document.hidden) hide(); };
      // A manual, non-interactive popover also stays above native modal dialogs.
      const layers = new MutationObserver(records => {
        if (!visible || !topLayer || !records.some(record => record.target instanceof HTMLDialogElement)) return;
        if (host.matches(':popover-open')) host.hidePopover();
        ensureLayer();
        inspect(document.elementFromPoint(pointer.current.x, pointer.current.y), true);
      });
      layers.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
      document.addEventListener('pointermove', move, { passive: true, capture: true });
      document.addEventListener('pointerdown', down, { passive: true, capture: true });
      document.addEventListener('pointerout', leave, { passive: true });
      document.addEventListener('pointercancel', hide, { passive: true });
      document.addEventListener('keydown', keyboard, true);
      document.addEventListener('visibilitychange', visibility);
      window.addEventListener('scroll', scroll, { passive: true, capture: true });
      window.addEventListener('resize', hide, { passive: true });
      window.addEventListener('blur', hide);
      dispose = () => {
        hide(); layers.disconnect();
        document.removeEventListener('pointermove', move, true);
        document.removeEventListener('pointerdown', down, true);
        document.removeEventListener('pointerout', leave);
        document.removeEventListener('pointercancel', hide);
        document.removeEventListener('keydown', keyboard, true);
        document.removeEventListener('visibilitychange', visibility);
        window.removeEventListener('scroll', scroll, true);
        window.removeEventListener('resize', hide);
        window.removeEventListener('blur', hide);
        if (topLayer && host.matches(':popover-open')) host.hidePopover();
        host.removeAttribute('popover');
      };
    };
    configure();
    media.addEventListener('change', configure);
    return () => { media.removeEventListener('change', configure); dispose?.(); };
  }, []);

  return createPortal(<div className="ac-global-cursor ac-comet-cursor" ref={root} data-visible="false" data-motion="idle" data-mode="default" data-tone="light" aria-hidden="true">
    <span className="ac-comet-trail">{PARTICLE_SIZES.map((size, index) => <span className="ac-comet-particle" key={index} style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity: [.6, .46, .34, .24, .15, .08][index] }}/>)}</span>
    <span className="ac-comet-head"><span className="ac-comet-core"/><svg className="ac-comet-arrow" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 10L10 3M3 3H10V10" stroke="currentColor" strokeWidth="1.3"/></svg><span className="ac-comet-view">VIEW</span></span>
    <span className="ac-comet-ripple"><span className="ac-comet-ripple-shape"/></span>
  </div>, document.body);
}
