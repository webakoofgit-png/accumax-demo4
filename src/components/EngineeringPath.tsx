import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './engineering-path.css';

gsap.registerPlugin(ScrollTrigger);

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
  const stage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = root.current, surface = stage.current;
    if (!section || !surface) return;
    const scenes = Array.from(section.querySelectorAll<HTMLElement>('.ke-scene'));
    const counter = section.querySelector<HTMLElement>('.ke-counter-track')!;
    const counterWindow = section.querySelector<HTMLElement>('.ke-counter-window')!;
    const media = gsap.matchMedia();
    let active = -1;
    const accessibility = (index: number) => {
      if (active === index) return;
      active = index;
      section.dataset.active = String(index);
      scenes.forEach((scene, i) => {
        scene.setAttribute('aria-hidden', String(i !== index));
        scene.inert = i !== index;
      });
    };
    const restore = () => {
      active = -1;
      delete section.dataset.enhanced;
      delete section.dataset.active;
      scenes.forEach(scene => { scene.removeAttribute('aria-hidden'); scene.inert = false; });
    };

    media.add({ motion: '(prefers-reduced-motion: no-preference)', pointer: '(hover: hover) and (pointer: fine)', compact: '(max-width: 900px)' }, match => {
      if (!match.conditions?.motion) return;

      section.dataset.enhanced = 'true';
      const context = gsap.context(() => {
        const compact = Boolean(match.conditions?.compact);
        if (compact) {
          // Keep mobile headings intact and reserve a full reading interval per stage.
          const sequence = gsap.timeline();
          gsap.set(scenes, { autoAlpha: 0, y: 0 });
          gsap.set(scenes[0], { autoAlpha: 1 });
          accessibility(0);
          sequence.to({}, { duration: 1.2 });
          scenes.slice(1).forEach((scene, offset) => {
            const previous = scenes[offset];
            sequence.to(previous, { autoAlpha: 0, y: -12, duration: .22, ease: 'power1.in' })
              .fromTo(scene, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .32, ease: 'power2.out' })
              .to({}, { duration: 1.2 });
          });
          const syncStage = () => {
            const index = Math.min(6, Math.max(0, Math.floor((sequence.time() + .01) / 1.74)));
            accessibility(index);
            gsap.set(counter, { y: -Math.min(index, 5) * counterWindow.clientHeight });
          };
          sequence.eventCallback('onUpdate', syncStage);
          ScrollTrigger.create({
            id: 'kinetic-engineering', trigger: surface, animation: sequence,
            start: () => `top ${parseFloat(getComputedStyle(section).getPropertyValue('--ke-pin-top')) || 64}px`,
            end: () => '+=' + Math.max(2800, window.innerHeight * 3.5),
            pin: true, pinSpacing: true, scrub: .45, anticipatePin: 1, invalidateOnRefresh: true,
            onRefresh: self => { sequence.progress(self.progress); syncStage(); },
            onUpdate: syncStage,
          });
          return;
        }
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[0], { autoAlpha: 1 });
        scenes.slice(1, 6).forEach(scene => gsap.set(scene.querySelectorAll('.ke-glyph'), { yPercent: letter => letter % 2 ? -115 : 115 }));
        gsap.set(scenes[6].querySelectorAll('.ke-final-line>span'), { yPercent: 110 });
        accessibility(0);
        const entries = [0];
        const transitions: number[] = [];
        const readingPositions = [.7];
        const sequence = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        for (let index = 1; index <= 6; index++) {
          const at = index * 2.2 - .35;
          transitions.push(at);
          readingPositions.push(at + 1.3);
          entries.push(at + .42);
          const outgoing = scenes[index - 1];
          const incoming = scenes[index];
          sequence.to(outgoing.querySelectorAll('.ke-glyph'), {
            yPercent: letter => letter % 2 ? 120 : -120, xPercent: 0, rotation: 0,
            duration: .45, stagger: .012, ease: 'power2.in',
          }, at)
            .to(outgoing.querySelector('.ke-description'), { opacity: 0, y: -5, duration: .25 }, at)
            .set(outgoing, { autoAlpha: 0 }, at + .58)
            .set(incoming, { autoAlpha: 1 }, at + .42)
            .to(counter, { y: () => -Math.min(index, 5) * counterWindow.clientHeight, duration: .65 }, at + .18);
          if (index < 6) {
            sequence.to(incoming.querySelectorAll('.ke-glyph'), { yPercent: 0, xPercent: 0, rotation: 0, duration: .65, stagger: .018, ease: 'power2.out' }, at + .42)
              .fromTo(incoming.querySelector('.ke-description'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .45 }, at + .68);
          } else {
            sequence.to(incoming.querySelectorAll('.ke-final-line>span'), { yPercent: 0, duration: .75, stagger: .1, ease: 'power2.out' }, at + .42)
              .fromTo(incoming.querySelector('.ke-description'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .45 }, at + .78);
          }
        }
        sequence.to({}, { duration: .9 });
        const duration = sequence.duration();
        sequence.eventCallback('onUpdate', () => {
          let index = 0;
          entries.forEach((entry, i) => { if (sequence.time() >= entry) index = i; });
          accessibility(index);
        });
        ScrollTrigger.create({
          id: 'kinetic-engineering', trigger: surface, animation: sequence,
          start: () => `top ${parseFloat(getComputedStyle(section).getPropertyValue('--ke-pin-top')) || 76}px`,
          end: () => '+=' + Math.max(2400, window.innerHeight * 3.4),
          pin: true, pinSpacing: true, scrub: .65, anticipatePin: 1, invalidateOnRefresh: true,
          snap: {
            // Only settle unfinished letter transitions. Readable holds never pull the scroll back.
            snapTo: (value, self) => {
              const time = value * duration;
              const transition = transitions.findIndex((start, index) => time > start && time < readingPositions[index + 1]);
              if (transition < 0) return value;
              return readingPositions[transition + (self?.direction === -1 ? 0 : 1)] / duration;
            },
            inertia: false, directional: false, delay: .18,
            duration: { min: .25, max: .5 }, ease: 'power2.inOut',
          },
        });
      }, section);

      const cleanups: Array<() => void> = [];
      if (match.conditions.pointer) {
        const plane = section.querySelector<HTMLElement>('.ke-type-plane')!;
        const cursor = section.querySelector<HTMLElement>('.ke-crosshair')!;
        let moveX: ReturnType<typeof gsap.quickTo>, moveY: ReturnType<typeof gsap.quickTo>;
        let cursorX: ReturnType<typeof gsap.quickTo>, cursorY: ReturnType<typeof gsap.quickTo>;
        context.add(() => {
          moveX = gsap.quickTo(plane, 'x', { duration: .9, ease: 'power2.out' });
          moveY = gsap.quickTo(plane, 'y', { duration: .9, ease: 'power2.out' });
          cursorX = gsap.quickTo(cursor, 'x', { duration: .2, ease: 'power2.out' });
          cursorY = gsap.quickTo(cursor, 'y', { duration: .2, ease: 'power2.out' });
        });
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return;
          const bounds = surface.getBoundingClientRect();
          const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
          moveX((x / bounds.width - .5) * 4);
          moveY((y / bounds.height - .5) * 3);
          cursorX(x); cursorY(y);
          cursor.style.opacity = '1';
        };
        const leave = () => { moveX(0); moveY(0); cursor.style.opacity = '0'; };
        surface.addEventListener('pointermove', move);
        surface.addEventListener('pointerleave', leave);
        cleanups.push(() => { surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave); });
      }
      return () => { cleanups.forEach(cleanup => cleanup()); context.revert(); restore(); };
    });
    let alive = true;
    let refreshFrame = 0;
    const refresh = () => {
      if (!alive) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (!alive) return;
        // Earlier sections can resize after fonts, images or responsive card styles settle.
        // Refresh upstream pins first so this section never pins over Industries.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    };
    const layout = new ResizeObserver(refresh);
    for (const sibling of Array.from(section.parentElement?.children ?? [])) {
      if (sibling === section) break;
      if (sibling instanceof HTMLElement && !sibling.classList.contains('pin-spacer')) layout.observe(sibling);
    }
    document.fonts.ready.then(refresh);
    window.addEventListener('accumax:ready', refresh);
    return () => { alive = false; cancelAnimationFrame(refreshFrame); layout.disconnect(); window.removeEventListener('accumax:ready', refresh); media.revert(); restore(); };
  }, []);

  return <section id="engineering-path" className="kinetic-engineering" ref={root} aria-labelledby="kinetic-engineering-title">
    <h2 id="kinetic-engineering-title" className="ke-sr-only">Kinetic engineering — six stages, one continuous motion.</h2>
    <div className="ke-surface" ref={stage}>

      <header className="ke-header"><span className="eyebrow">06 / FROM INTENT TO INFRASTRUCTURE</span></header>
      <div className="ke-topline" aria-hidden="true"><span className="ke-counter-label"><span className="ke-counter-window"><span className="ke-counter-track">{ENGINEERING_STAGES.map((_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}</span></span><span className="ke-counter-total">/ 06</span></span></div>
      <div className="ke-composition">
        <div className="ke-type-plane">{ENGINEERING_STAGES.map((item, index) => <article className="ke-scene ke-process" key={item.title}>
          <span className="ke-mobile-index" aria-hidden="true">{String(index + 1).padStart(2, '0')} / 06</span>
          <h3 className="ke-word" aria-label={item.title}>{Array.from(item.title).map((letter, i) => <span className="ke-letter" aria-hidden="true" key={i}><span className="ke-glyph">{letter}</span></span>)}</h3>
          <p className="ke-description">{item.description}</p>
        </article>)}
        <article className="ke-scene ke-finale"><h3><span className="ke-final-line"><span>Every connection.</span></span><span className="ke-final-line"><span>Considered<span className="ke-final-dot">.</span></span></span></h3><p className="ke-description">A coordinated path from requirements to handover.</p></article>
        </div>
      </div>
      <div className="ke-crosshair" aria-hidden="true"/>
    </div>
  </section>;
}
