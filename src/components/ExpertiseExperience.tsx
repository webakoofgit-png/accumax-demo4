import { Heading } from './Heading';
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
const glowPositions = [[-160, -90], [160, -90], [-180, 0], [180, 0], [-140, 90], [140, 90], [0, 130]];

export function ExpertiseExperience() {
  const [active, setActive] = useState(0);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pointerReading, setPointerReading] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const connectionsRef = useRef<SVGSVGElement>(null);
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

  const measureConnections = useCallback(() => {
    const arena = arenaRef.current;
    const visual = visualRef.current;
    const svg = connectionsRef.current;
    if (!arena || !visual || !svg || getComputedStyle(svg).display === 'none') return;
    const bounds = arena.getBoundingClientRect();
    const photo = visual.getBoundingClientRect();
    const left = photo.left - bounds.left, right = photo.right - bounds.left;
    const top = photo.top - bounds.top, bottom = photo.bottom - bounds.top;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    svg.querySelectorAll('path').forEach((path, index) => {
      const button = buttonRefs.current[index];
      if (!button) return;
      const tab = button.getBoundingClientRect();
      let d: string;
      if (index === 6) {
        const x = tab.left + tab.width / 2 - bounds.left;
        const y = tab.top - bounds.top;
        const endX = clamp(x, left + 24, right - 24);
        const endY = bottom - 16;
        d = `M ${x} ${y} V ${(y + endY) / 2} L ${endX} ${endY}`;
      } else {
        const onLeft = index % 2 === 0;
        const x = (onLeft ? tab.right : tab.left) - bounds.left;
        const y = tab.top + tab.height / 2 - bounds.top;
        // End under the photograph so a slight perspective tilt never opens a gap.
        const endX = onLeft ? left + 16 : right - 16;
        const endY = clamp(y, top + 24, bottom - 24);
        d = `M ${x} ${y} H ${(x + endX) / 2} L ${endX} ${endY}`;
      }
      path.setAttribute('d', d);
    });
  }, []);

  useLayoutEffect(() => {
    let alive = true;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (alive) measureConnections(); });
    };
    const observer = new ResizeObserver(refresh);
    [arenaRef.current, visualRef.current, ...buttonRefs.current].forEach(element => {
      if (element) observer.observe(element);
    });
    measureConnections();
    document.fonts.ready.then(refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('accumax:ready', refresh);
    return () => {
      alive = false; observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('accumax:ready', refresh);
    };
  }, [measureConnections]);

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
      }, root);
      let resetTilt = () => {};
      let moveTilt = (_event: PointerEvent) => {};
      if (match.conditions?.pointer) {
        context.add(() => {
          const rx = gsap.quickTo(visual, 'rotationX', { duration: .8, ease: 'power3.out', onUpdate: measureConnections });
          const ry = gsap.quickTo(visual, 'rotationY', { duration: .8, ease: 'power3.out', onUpdate: measureConnections });
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
  }, [choose, measureConnections]);

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
      <header className="expertise-heading"><span className="eyebrow">02 / OUR EXPERTISE</span><Heading as="h2" id="expertise-heading" className="section-title"><span className="expertise-heading-line"><span>Engineering</span></span>{' '}<span className="expertise-heading-line heading-muted"><span>Every Possibility</span></span></Heading></header>
      <div className="expertise-console">
        <div className="expertise-arena" ref={arenaRef}>
          <svg className="expertise-connections" ref={connectionsRef} preserveAspectRatio="none" aria-hidden="true">{EXPERTISE_CATEGORIES.map((category, i) => <path key={category.num} pathLength="1" className={active === i ? 'is-active' : ''}/>)}</svg>
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
          <div className="expertise-selected-heading"><Heading as="h3">{item.title}</Heading><div className="expertise-step-controls"><button type="button" aria-label="Previous expertise" onClick={() => choose(active - 1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next expertise" onClick={() => choose(active + 1)}><ArrowRight size={18}/></button></div></div>
          <div className="expertise-description-mask"><p className="expertise-description-inner">{item.short}</p></div>
          <Link className="expertise-explore site-cta" to={destination[item.num] ?? '/contact?service=' + encodeURIComponent(item.title)}>Explore Expertise <ArrowUpRight size={18}/></Link>
        </div>
      </div>
    </div>
  </section>;
}
