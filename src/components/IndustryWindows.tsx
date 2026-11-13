import { Heading } from './Heading';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { INDUSTRIES } from '../data';
import powerUtilitiesPhoto from '../assets/images/transmission-wide.jpg';
import './industry-windows.css';

const industries = INDUSTRIES.slice(0, 6);
const photographs = import.meta.glob('/src/assets/images/portfolio/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const source = (index: number) => index === 0 ? powerUtilitiesPhoto : photographs['/src/assets' + industries[index].image] ?? industries[index].image;

export function IndustryWindows() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = useRef(0);
  const previous = useRef(0);
  const request = useRef(0);
  const manualUntil = useRef(0);
  const alive = useRef(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    alive.current = true;
    return () => { alive.current = false; request.current++; };
  }, []);

  const choose = useCallback(async (index: number, automatic = false) => {
    if (!automatic) manualUntil.current = Date.now() + 2500;
    const next = (index + industries.length) % industries.length;
    const token = ++request.current;
    if (next === selected.current) { setLoading(false); return; }
    setLoading(true);
    const photo = new Image();
    photo.src = source(next);
    try { await photo.decode(); } catch { /* Keep the current image if loading fails. */ }
    if (!alive.current || token !== request.current) return;
    setLoading(false);
    if (!photo.naturalWidth) return;
    selected.current = next;
    setActive(next);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || reduced || loading) return;
    let visible = false;
    let nextAdvance = Date.now() + 2500;
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .3);
      nextAdvance = Date.now() + 2500;
    }, { threshold: [0, .3] });
    observer.observe(element);
    const timer = window.setInterval(() => {
      const now = Date.now();
      const hovering = window.matchMedia('(hover:hover)').matches && element.matches(':hover');
      if (!visible || document.hidden || hovering || element.contains(document.activeElement) || now < manualUntil.current) {
        nextAdvance = now + 2500;
        return;
      }
      if (now >= nextAdvance) {
        nextAdvance = now + 2500;
        void choose(selected.current + 1, true);
      }
    }, 250);
    return () => { window.clearInterval(timer); observer.disconnect(); };
  }, [choose, reduced, loading, active]);

  useLayoutEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('.iw-layer');
      gsap.set(layers, { autoAlpha: 0, zIndex: 0, scale: 1 });
      const incoming = layers[active];
      const outgoing = layers[previous.current];
      gsap.set(outgoing, { autoAlpha: 1, zIndex: 0 });
      gsap.set(incoming, { autoAlpha: 1, zIndex: 1 });
      const changed = previous.current !== active;
      previous.current = active;
      if (reduced) {
        gsap.set(layers.filter(layer => layer !== incoming), { autoAlpha: 0 });
        return;
      }
      const timeline = gsap.timeline();
      if (changed) {
        timeline.to(outgoing, { autoAlpha: 0, duration: .6, ease: 'power2.inOut' }, 0)
          .fromTo(incoming, { opacity: 0, scale: 1.055 }, { opacity: 1, scale: 1, duration: .8, ease: 'power2.inOut' }, 0);
      }
      timeline.fromTo('.iw-title-line>span', { yPercent: 105 }, { yPercent: 0, duration: .7, stagger: .04, ease: 'power3.out' }, .08)
        .fromTo('.iw-copy p', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out' }, .08)
        .fromTo('.iw-cta', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, .25)
        .fromTo('.iw-progress>span', { scaleX: 0 }, { scaleX: 1, duration: .8, ease: 'power2.inOut' }, 0);
    }, root);
    return () => context.revert();
  }, [active, reduced]);

  useLayoutEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>('.iw-stage');
    const plane = root.current?.querySelector<HTMLElement>('.iw-plane');
    if (!stage || !plane || reduced || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const context = gsap.context(() => {}, root);
    let x: ReturnType<typeof gsap.quickTo>;
    let y: ReturnType<typeof gsap.quickTo>;
    context.add(() => {
      x = gsap.quickTo(plane, 'x', { duration: .9, ease: 'power3.out' });
      y = gsap.quickTo(plane, 'y', { duration: .9, ease: 'power3.out' });
    });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = stage.getBoundingClientRect();
      x((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14);
      y((event.clientY - bounds.top - bounds.height / 2) / bounds.height * 10);
    };
    const reset = () => { x(0); y(0); };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', reset);
    return () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', reset); context.revert(); };
  }, [reduced]);

  const industry = industries[active];
  const words = industry.name.split(' ');
  const lines = words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [industry.name];
  return <div className="industry-windows" ref={root}>
    <div className="iw-stage" id="industry-window" role="tabpanel" aria-labelledby={`industry-selector-${active}`} aria-busy={loading}
      onPointerDown={event => { swipe.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { swipe.current = null; }}
      onPointerUp={event => {
        const start = swipe.current; swipe.current = null;
        if (!start || event.pointerType === 'mouse') return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) void choose(active + (dx < 0 ? 1 : -1));
      }}>
      <div className="iw-plane" aria-hidden="true">{industries.map((item, index) => <div className="iw-layer" key={item.name} style={{ visibility: index === 0 ? 'visible' : 'hidden' }}>
        <img className="iw-photo" src={source(index)} alt="" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" width={index === 0 ? 1920 : 550} height={index === 0 ? 1088 : 400}/>
      </div>)}</div>
      <div className="iw-shade"/>
      <div className="iw-topline"><span><i /> ENGINEERING ACROSS INDUSTRIES</span><span>{String(active + 1).padStart(2, '0')} <span className="iw-total">/ 06</span></span></div>
      <div className="iw-copy" key={active}>
        <span className="iw-photo-label">BUILT AROUND YOUR WORLD</span>
        <Heading as="h3">{lines.map(line => <span className="iw-title-line" key={line}><span>{line}</span></span>)}</Heading>
        <p>{industry.applications}.</p>
      </div>
      <div className="iw-progress" aria-hidden="true"><span/></div>
    </div>
    <div className="iw-directory">
    <div className="iw-selector" role="tablist" aria-label="Industries we serve" aria-orientation="vertical">{industries.map((item, index) => <button type="button" role="tab" id={`industry-selector-${index}`} aria-controls="industry-window" aria-selected={active === index} tabIndex={active === index ? 0 : -1} key={item.name}
      onPointerEnter={event => { if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) void choose(index); }}
      onFocus={() => { void choose(index); }}
      onClick={() => { void choose(index); }}
      onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % industries.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + industries.length - 1) % industries.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = industries.length - 1;
        else return;
        event.preventDefault();
        root.current?.querySelector<HTMLButtonElement>(`#industry-selector-${next}`)?.focus({ preventScroll: true });
        void choose(next);
      }}><span className="iw-tab-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="iw-tab-copy"><span>{item.name}</span>{active === index && <small>{item.applications}</small>}</span><ArrowRight size={18}/></button>)}</div>
    <div className="iw-details"><Link className="iw-cta site-cta" to={'/contact?industry=' + encodeURIComponent(industry.name)}>Discuss your project <ArrowUpRight size={20}/></Link></div>
    </div>
    <span className="iw-accessible-status" role="status">{loading ? 'Loading industry image' : industry.name + ': ' + industry.applications}</span>
  </div>;
}
