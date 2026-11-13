import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { Heading } from './Heading';
import './home-testimonials.css';

// Sample content only. Replace these quotes and attributions with approved client feedback.
const testimonials = [
  {
    quote: 'From planning through site execution, the team kept every step clear. Their coordinated approach helped us move forward with confidence.',
    name: 'Sample Client 01',
    role: 'Project Manager · Example Power Company',
  },
  {
    quote: 'The attention to detail during testing and commissioning stood out. We appreciated the clear communication and practical support throughout.',
    name: 'Sample Client 02',
    role: 'Operations Head · Example Manufacturing Company',
  },
  {
    quote: 'Having engineering and equipment support together made coordination easier. The team understood our requirements and stayed responsive as the work progressed.',
    name: 'Sample Client 03',
    role: 'Procurement Lead · Example Infrastructure Company',
  },
];

export function HomeTestimonials() {
  const track = useRef<HTMLDivElement>(null);
  const positions = useRef([0]);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);
  const reduced = useReducedMotion();
  const sync = () => {
    if (!track.current) return;
    const left = track.current.scrollLeft;
    setActive(positions.current.reduce((closest, position, index, values) =>
      Math.abs(position - left) < Math.abs(values[closest] - left) ? index : closest, 0));
  };
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const first = element.firstElementChild as HTMLElement | null;
      const max = element.scrollWidth - element.clientWidth;
      if (!first) return;
      const step = first.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0);
      positions.current = [0];
      for (let left = step; left < max - 2; left += step) positions.current.push(left);
      if (max > 2) positions.current.push(max);
      setPages(positions.current.length);
      sync();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = track.current;
    const section = element?.closest('section');
    if (!element || !section || reduced || pages < 2) return;
    let visible = false;
    let dragging = false;
    let nextAdvance = Date.now() + 3000;
    const postpone = () => { nextAdvance = Date.now() + 3000; };
    const start = () => { dragging = true; postpone(); };
    const release = () => { dragging = false; postpone(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      postpone();
    }, { threshold: [0, .25] });
    observer.observe(element);
    const timer = window.setInterval(() => {
      const hovering = window.matchMedia('(hover: hover) and (pointer: fine)').matches && section.matches(':hover');
      if (!visible || dragging || hovering || document.hidden || section.contains(document.activeElement) || document.querySelector('dialog[open]')) {
        postpone();
        return;
      }
      if (Date.now() < nextAdvance) return;
      const targets = positions.current;
      const current = targets.reduce((closest, position, index) =>
        Math.abs(position - element.scrollLeft) < Math.abs(targets[closest] - element.scrollLeft) ? index : closest, 0);
      postpone();
      element.scrollTo({ left: targets[(current + 1) % targets.length], behavior: 'smooth' });
    }, 250);
    element.addEventListener('scroll', postpone, { passive: true });
    section.addEventListener('pointerdown', start, { passive: true });
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      element.removeEventListener('scroll', postpone);
      section.removeEventListener('pointerdown', start);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [reduced, pages]);
  const choose = (page: number) => {
    const next = (page + pages) % pages;
    track.current?.scrollTo({ left: positions.current[next], behavior: reduced ? 'instant' : 'smooth' });
  };

  return <section className="section home-testimonials" aria-labelledby="home-testimonials-title">
    <header className="section-heading home-testimonials-heading">
      <div>
        <span className="eyebrow">09 / TESTIMONIALS</span>
        <Heading as="h2" id="home-testimonials-title" className="section-title">What our <em>clients say.</em></Heading>
      </div>
    </header>
    <div className="home-testimonials-grid" ref={track} id="home-testimonials-track" role="region" aria-label="Client testimonials carousel" tabIndex={0} onScroll={sync} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        choose(active + (event.key === 'ArrowRight' ? 1 : -1));
      }
    }}>
      {testimonials.map((item, index) => <figure className="home-testimonial" key={item.name} role="group" aria-roledescription="slide" aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}>
        <Quote size={30} strokeWidth={1.4} aria-hidden="true" />
        <blockquote><p>{item.quote}</p></blockquote>
        <figcaption>
          <span className="home-testimonial-avatar" aria-hidden="true">0{index + 1}</span>
          <div><strong>{item.name}</strong><span>{item.role}</span></div>
        </figcaption>
      </figure>)}
    </div>
    {pages > 1 && <div className="home-testimonials-controls">
      <button type="button" aria-label="Previous testimonials" aria-controls="home-testimonials-track" onClick={() => choose(active - 1)}><ArrowLeft size={20} /></button>
      <div className="home-testimonials-dots" aria-label="Choose testimonials page">{Array.from({ length: pages }, (_, index) => <button type="button" key={index} aria-label={`Show testimonials page ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => choose(index)}><span /></button>)}</div>
      <button type="button" aria-label="Next testimonials" aria-controls="home-testimonials-track" onClick={() => choose(active + 1)}><ArrowRight size={20} /></button>
      <span className="home-testimonials-status" aria-live="polite">{active + 1} / {pages}</span>
    </div>}
  </section>;
}
