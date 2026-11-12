import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import './engineering-path.css';
import understandImage from '../assets/Industrial Substation at Sunset.png';
import { FIELD_IMAGES } from '../field-images';
import connectionImage from '../assets/images/transmission-wide.jpg';

export const ENGINEERING_STAGE_IMAGES = [understandImage, FIELD_IMAGES.siteInstallation, FIELD_IMAGES.controlPanels, FIELD_IMAGES.gisHall, FIELD_IMAGES.testing, FIELD_IMAGES.outdoorSubstation, connectionImage] as const;

export const ENGINEERING_STAGES = [
  { title: 'Understand', description: 'Define scope, interfaces and operating requirements.' },
  { title: 'Plan', description: 'Coordinate resources, procurement and site activities.' },
  { title: 'Engineer', description: 'Develop the engineering approach and protection requirements.' },
  { title: 'Execute', description: 'Bring equipment, civil works and electrical systems together.' },
  { title: 'Test', description: 'Check installation, control logic and system performance.' },
  { title: 'Deliver', description: 'Review documentation and prepare the handover.' },
] as const;

export function EngineeringPath() {
  const root = useRef<HTMLElement>(null);
  const swipe = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const last = ENGINEERING_STAGES.length;
  const choose = (index: number) => {
    setActive(Math.max(0, Math.min(last, index)));
  };

  useLayoutEffect(() => {
    const tiles = root.current?.querySelector<HTMLElement>('.ke-stage-tiles');
    const selected = tiles?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!tiles || !selected) return;
    const bounds = tiles.getBoundingClientRect();
    const tile = selected.getBoundingClientRect();
    if (tile.left < bounds.left) tiles.scrollLeft += tile.left - bounds.left - 4;
    else if (tile.right > bounds.right) tiles.scrollLeft += tile.right - bounds.right + 4;
  }, [active]);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const context = gsap.context(() => {
      const scenes = Array.from(section.querySelectorAll<HTMLElement>('.ke-scene'));
      gsap.set(scenes, { autoAlpha: 0 });
      const incoming = scenes[active];
      gsap.set(incoming, { autoAlpha: 1 });
      if (reduced) return;
      const letters = incoming.querySelectorAll('.ke-glyph, .ke-final-line>span');
      gsap.fromTo(letters, { yPercent: index => index % 2 ? -115 : 115 }, {
        yPercent: 0, duration: .6, stagger: .018, ease: 'power2.out',
      });
      gsap.fromTo(incoming.querySelector('.ke-description'), { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: .4, delay: .15, ease: 'power2.out',
      });
    }, section);
    return () => context.revert();
  }, [active, reduced]);

  return <section id="engineering-path" className="kinetic-engineering" ref={root} data-enhanced="true" data-active={active} aria-labelledby="kinetic-engineering-title">
    <h2 id="kinetic-engineering-title" className="ke-sr-only">Kinetic engineering — six stages, one continuous motion.</h2>
    <div className="ke-surface" style={{ backgroundImage: `linear-gradient(90deg,#0b172bd9,#0b172b73 65%,#0b172b40),url("${ENGINEERING_STAGE_IMAGES[active]}")` }}>
      <header className="ke-header"><span className="eyebrow">04 / FROM INTENT TO INFRASTRUCTURE</span></header>
      <div className="ke-topline" aria-hidden="true"><span className="ke-counter-label"><span className="ke-counter-window"><span className="ke-counter-track"><span>{String(Math.min(active + 1, last)).padStart(2, '0')}</span></span></span><span className="ke-counter-total">/ 06</span></span></div>
      <div className="ke-composition" onPointerDown={event => {
        if (event.button !== 0 || swipe.current) return;
        swipe.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
        if (event.nativeEvent.isTrusted) event.currentTarget.setPointerCapture(event.pointerId);
      }} onPointerCancel={() => { swipe.current = null; }} onLostPointerCapture={() => { swipe.current = null; }} onPointerUp={event => {
        if (swipe.current?.pointerId !== event.pointerId) return;
        const start = swipe.current; swipe.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (!start) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) setActive(current => Math.max(0, Math.min(last, current + (dx < 0 ? 1 : -1))));
      }}>
        <div className="ke-type-plane">{ENGINEERING_STAGES.map((item, index) => <article className="ke-scene ke-process" key={item.title} aria-hidden={active !== index}>
          <span className="ke-mobile-index" aria-hidden="true">{String(index + 1).padStart(2, '0')} / 06</span>
          <h3 className="ke-word" aria-label={item.title}>{Array.from(item.title).map((letter, i) => <span className="ke-letter" aria-hidden="true" key={i}><span className="ke-glyph">{letter}</span></span>)}</h3>
          <p className="ke-description">{item.description}</p>
        </article>)}
        <article className="ke-scene ke-finale" aria-hidden={active !== last}><h3><span className="ke-final-line"><span>Every connection.</span></span><span className="ke-final-line"><span>Considered<span className="ke-final-dot">.</span></span></span></h3><p className="ke-description">A coordinated path from requirements to handover.</p></article>
        </div>
      </div>
      <div className="ke-controls"><button type="button" aria-label="Previous engineering stage" disabled={active === 0} onClick={() => choose(active - 1)}><ArrowLeft size={20} /></button><button type="button" aria-label="Next engineering stage" disabled={active === last} onClick={() => choose(active + 1)}><ArrowRight size={20} /></button><div className="ke-stage-tiles" role="group" aria-label="Choose an engineering stage">{[...ENGINEERING_STAGES.map(item => item.title), 'Every connection'].map((title, index) => <button type="button" key={title} aria-label={`Show ${title}`} aria-pressed={active === index} style={{ '--step-thumbnail': `url("${ENGINEERING_STAGE_IMAGES[index]}")` } as CSSProperties} onPointerEnter={event => { if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (min-width: 901px)').matches) choose(index); }} onClick={() => choose(index)}><span className="ke-tile-number" aria-hidden="true">{index < last ? String(index + 1).padStart(2, '0') : '✓'}</span><span>{title}</span></button>)}</div></div>
      <span className="ke-sr-only" role="status" aria-live="polite" aria-atomic="true">{active < last ? `${active + 1} of ${last}: ${ENGINEERING_STAGES[active].title}. ${ENGINEERING_STAGES[active].description}` : 'Every connection. Considered. A coordinated path from requirements to handover.'}</span>
    </div>
  </section>;
}
