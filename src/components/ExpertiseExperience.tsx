import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERTISE_CATEGORIES } from '../data';
import './expertise-experience.css';

gsap.registerPlugin(ScrollTrigger);

const photos = import.meta.glob('/src/assets/images/products/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const destination: Record<string, string> = {
  '01': '/services/epc-projects',
  '02': '/services/solar-ev-station',
  '03': '/services/gis-erection-supervision',
  '06': '/services/substation-testing-commissioning',
  '07': '/services/export',
};
const connections = [
  'M 235 70 H 365 L 470 155', 'M 1165 70 H 1040 L 930 155',
  'M 230 235 H 370 L 470 240', 'M 1170 235 H 1030 L 930 240',
  'M 255 385 H 365 L 470 330', 'M 1145 385 H 1040 L 930 330',
  'M 700 458 V 395 L 700 350',
];
const glowPositions = [[-160, -90], [160, -90], [-180, 0], [180, 0], [-140, 90], [140, 90], [0, 130]];

export function ExpertiseExperience() {
  const [active, setActive] = useState(0);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pointerReading, setPointerReading] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const activeRef = useRef(0);
  const visibleRef = useRef(false);
  const manualUntilRef = useRef(0);
  const item = EXPERTISE_CATEGORIES[active];
  const choose = useCallback((index: number, source: 'manual' | 'scroll' | 'automatic' = 'manual') => {
    const next = (index + EXPERTISE_CATEGORIES.length) % EXPERTISE_CATEGORIES.length;
    if (source === 'manual') manualUntilRef.current = Date.now() + 6500;
    activeRef.current = next;
    setActive(next);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => {
      visibleRef.current = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .25);
    }, { threshold: [0, .25, .5] });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || focusWithin || pointerReading) return;
    const timer = setInterval(() => {
      if (visibleRef.current && !document.hidden && Date.now() >= manualUntilRef.current) {
        choose(activeRef.current + 1, 'automatic');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [choose, reduced, focusWithin, pointerReading]);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 1199px), (hover: none), (pointer: coarse)').matches) return;
    const track = tabsRef.current;
    const tab = buttonRefs.current[active];
    if (!track || !tab) return;
    const left = tab.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - (track.clientWidth - tab.offsetWidth) / 2;
    track.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' });
  }, [active, reduced]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const arena = arenaRef.current;
    const visual = visualRef.current;
    if (!root || !arena || !visual) return;
    const media = gsap.matchMedia();
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      wide: '(min-width: 1200px) and (min-height: 850px) and (hover: hover) and (pointer: fine)',
      pointer: '(hover: hover) and (pointer: fine)',
    }, match => {
      if (!match.conditions?.motion) return;
      const context = gsap.context(() => {
        gsap.fromTo(root.querySelectorAll('.expertise-heading-line>span'), { yPercent: 115 }, {
          yPercent: 0, duration: 1, stagger: .12, ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 82%', once: true },
        });
        ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top',
          onToggle: self => { root.dataset.inview = String(self.isActive); } });
        if (match.conditions?.wide) {
          let lastScrollIndex = -1;
          ScrollTrigger.create({
            trigger: root.querySelector('.expertise-console'), start: 'top 88px',
            end: () => '+=' + Math.min(840, window.innerHeight), pin: true,
            anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => {
              const next = Math.min(EXPERTISE_CATEGORIES.length - 1, Math.round(self.progress * (EXPERTISE_CATEGORIES.length - 1)));
              if (next !== lastScrollIndex && self.isActive) { lastScrollIndex = next; choose(next, 'scroll'); }
            },
          });
        }
      }, root);
      let resetTilt = () => {};
      let moveTilt = (_event: PointerEvent) => {};
      if (match.conditions?.pointer) {
        context.add(() => {
          const rx = gsap.quickTo(visual, 'rotationX', { duration: .8, ease: 'power3.out' });
          const ry = gsap.quickTo(visual, 'rotationY', { duration: .8, ease: 'power3.out' });
          moveTilt = event => {
            if (event.pointerType !== 'mouse') return;
            const rect = arena.getBoundingClientRect();
            rx(gsap.utils.clamp(-3, 3, ((event.clientY - rect.top) / rect.height - .5) * -6));
            ry(gsap.utils.clamp(-4, 4, ((event.clientX - rect.left) / rect.width - .5) * 8));
          };
          resetTilt = () => { rx(0); ry(0); };
        });
        arena.addEventListener('pointermove', moveTilt);
        arena.addEventListener('pointerleave', resetTilt);
      }
      return () => {
        arena.removeEventListener('pointermove', moveTilt);
        arena.removeEventListener('pointerleave', resetTilt);
        delete root.dataset.inview;
        context.revert();
      };
    });
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    };
    refresh();
    window.addEventListener('accumax:ready', refresh);
    const images = imageRefs.current.filter(Boolean) as HTMLImageElement[];
    images.forEach(image => image.addEventListener('load', refresh));
    const settle = setTimeout(refresh, 0);
    return () => { clearTimeout(settle); cancelAnimationFrame(frame); window.removeEventListener('accumax:ready', refresh); images.forEach(image => image.removeEventListener('load', refresh)); media.revert(); };
  }, [choose]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const incoming = imageRefs.current[active];
    if (!root || !incoming) return;
    transitionRef.current?.kill();
    const timeline = gsap.timeline();
    transitionRef.current = timeline;
    const others = imageRefs.current.filter((image, i) => image && i !== active);
    if (reduced) {
      timeline.set(others, { opacity: 0 }).set(incoming, { opacity: 1, scale: 1 });
      timeline.set(root.querySelector('.expertise-description-inner'), { yPercent: 0, opacity: 1 });
      timeline.set(root.querySelector('.expertise-explore'), { y: 0, opacity: 1 });
    } else {
      timeline.to(others, { opacity: 0, duration: .6, ease: 'power2.inOut' }, 0)
        .fromTo(incoming, { opacity: 0, scale: 1.055 }, { opacity: 1, scale: 1, duration: .8, ease: 'power2.inOut' }, 0)
        .fromTo(root.querySelector('.expertise-description-inner'), { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out' }, .08)
        .fromTo(root.querySelector('.expertise-explore'), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power2.out' }, .25)
        .to(root.querySelector('.expertise-ambient'), { x: glowPositions[active][0], y: glowPositions[active][1], duration: .9, ease: 'power2.out' }, 0);
    }
    return () => { timeline.kill(); };
  }, [active, reduced]);

  const keyNavigate = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = EXPERTISE_CATEGORIES.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    const bounded = (next + EXPERTISE_CATEGORIES.length) % EXPERTISE_CATEGORIES.length;
    choose(bounded);
    buttonRefs.current[bounded]?.focus({ preventScroll: true });
  };

  return <section id="expertise" className="expertise-experience expertise-section" ref={rootRef} aria-labelledby="expertise-heading" onFocusCapture={() => setFocusWithin(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false); }}>
    <div className="expertise-atmosphere" aria-hidden="true"><div className="expertise-ambient"/>{[0,1,2,3,4,5].map(i => <span className={`expertise-particle particle-${i}`} key={i}/>)}</div>
    <div className="expertise-inner">
      <header className="expertise-heading"><span className="eyebrow">02 / OUR EXPERTISE</span><h2 id="expertise-heading" className="section-title"><span className="expertise-heading-line"><span>Engineering</span></span><br /><span className="expertise-heading-line heading-muted"><span>Every Possibility</span></span></h2></header>
      <div className="expertise-console">
        <div className="expertise-arena" ref={arenaRef}>
          <svg className="expertise-connections" viewBox="0 0 1400 490" preserveAspectRatio="none" aria-hidden="true">{connections.map((path, i) => <path key={path} d={path} pathLength="1" className={active === i ? 'is-active' : ''}/>)}</svg>
          <div className="expertise-visual" ref={visualRef} onPointerDown={event => { swipeStart.current = { x: event.clientX, y: event.clientY }; }} onPointerCancel={() => { swipeStart.current = null; }} onPointerUp={event => {
            const start = swipeStart.current; swipeStart.current = null;
            if (!start) return;
            const dx = event.clientX - start.x; const dy = event.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) choose(activeRef.current + (dx < 0 ? 1 : -1));
          }}>
            <div className="expertise-depth-layer depth-back" aria-hidden="true"/><div className="expertise-depth-layer depth-mid" aria-hidden="true"/>
            <div className="expertise-image-window">{EXPERTISE_CATEGORIES.map((category, i) => <img key={category.num} ref={element => { imageRefs.current[i] = element; }} src={photos['/src/assets' + category.image] ?? category.image} alt={category.title} aria-hidden={active !== i} loading="lazy" decoding="async" width="960" height="600" style={{ opacity: i === 0 ? 1 : 0 }}/>) }<div className="expertise-photo-shade"/></div>
          </div>
          <div className="expertise-hotspots" role="tablist" aria-label="Engineering expertise" ref={tabsRef}>{EXPERTISE_CATEGORIES.map((category, i) => <button type="button" role="tab" id={`expertise-tab-${category.num}`} aria-controls="expertise-selected" aria-selected={active === i} tabIndex={active === i ? 0 : -1} className={`expertise-hotspot hotspot-${i}${active === i ? ' is-active' : ''}`} key={category.num} ref={element => { buttonRefs.current[i] = element; }} onClick={() => choose(i)} onPointerEnter={event => { if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches) choose(i); }} onFocus={() => choose(i)} onKeyDown={event => keyNavigate(event, i)}><span className="expertise-node" aria-hidden="true"/><span className="expertise-hotspot-label">{category.title}</span></button>)}</div>
        </div>
        <div className="expertise-selected" id="expertise-selected" role="tabpanel" aria-labelledby={`expertise-tab-${item.num}`} tabIndex={0} onPointerEnter={event => { if (event.pointerType === 'mouse') setPointerReading(true); }} onPointerLeave={() => setPointerReading(false)}>
          <div className="expertise-selected-heading"><h3>{item.title}</h3><div className="expertise-step-controls"><button type="button" aria-label="Previous expertise" onClick={() => choose(active - 1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next expertise" onClick={() => choose(active + 1)}><ArrowRight size={18}/></button></div></div>
          <div className="expertise-description-mask"><p className="expertise-description-inner">{item.short}</p></div>
          <Link className="expertise-explore" to={destination[item.num] ?? '/contact?service=' + encodeURIComponent(item.title)}>Explore Expertise <ArrowUpRight size={18}/></Link>
        </div>
      </div>
    </div>
  </section>;
}
