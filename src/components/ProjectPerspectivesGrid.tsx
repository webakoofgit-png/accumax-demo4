import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import commissioningPhoto from '../assets/all images/gis-detail-575.webp';
import { SERVICES } from '../data';
import { Heading } from './Heading';
import './project-perspectives-grid.css';

const captions: Record<string, string> = {
  'epc-projects': 'Power infrastructure, end to end.',
  'scada-relay-testing': 'Automation, protection and relay testing.',
  export: 'Substation equipment, delivered worldwide.',
  'substation-testing-commissioning': 'Testing and commissioning across voltage levels.',
  'fabrication-civil-work': 'Civil works and structural fabrication.',
  'gis-erection-supervision': 'GIS installation, supervision and equipment supply.',
  'solar-ev-station': 'Solar power and EV charging infrastructure.',
};

const photoModifiers: Partial<Record<string, string>> = {
  'scada-relay-testing': 'service-perspective-photo--contain',
  'fabrication-civil-work': 'service-perspective-photo--fabrication',
  'solar-ev-station': 'service-perspective-photo--focus-right',
};

export function ProjectPerspectivesGrid() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = track.current;
    if (!element || reduced) return;
    const mobile = window.matchMedia('(max-width: 640px)');
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
      if (!mobile.matches || !visible || dragging || document.hidden || document.querySelector('dialog[open]') || element.contains(document.activeElement)) {
        postpone();
        return;
      }
      if (Date.now() < nextAdvance) return;
      const first = element.firstElementChild as HTMLElement | null;
      if (!first || element.scrollWidth <= element.clientWidth) return;
      const step = first.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0);
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
      const next = (Math.round(element.scrollLeft / step) + 1) * step;
      postpone();
      element.scrollTo({ left: atEnd ? 0 : next, behavior: 'smooth' });
    }, 250);
    element.addEventListener('scroll', postpone, { passive: true });
    element.addEventListener('pointerdown', start, { passive: true });
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      element.removeEventListener('scroll', postpone);
      element.removeEventListener('pointerdown', start);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [reduced]);

  return <section className="section service-perspectives" aria-labelledby="service-perspectives-heading">
    <header className="section-heading">
      <div><span className="eyebrow">03 / PROJECT PERSPECTIVES</span><Heading as="h2" id="service-perspectives-heading" className="section-title">Expertise in <em>perspective.</em></Heading></div>
    </header>
    <div className="service-perspectives-grid" ref={track}>
      {SERVICES.filter(service => service.slug !== 'trading').map(service => {
        const title = service.slug === 'gis-erection-supervision' ? 'GIS & Trading' : service.title;
        const isCommissioning = service.slug === 'substation-testing-commissioning';
        return <Link className="service-perspective-card" to={'/services/' + service.slug} key={service.slug}>
          <div className={['service-perspective-photo', photoModifiers[service.slug]].filter(Boolean).join(' ')}>
            <img src={isCommissioning ? commissioningPhoto : service.image} alt={isCommissioning ? 'Gas-insulated switchgear inside a substation' : title} loading="lazy" decoding="async" />
            <span className="service-perspective-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
            <div className="service-perspective-overlay" aria-hidden="true"><strong>{title}</strong><p>{service.short}</p></div>
          </div>
          <div className="service-perspective-caption"><Heading as="h3">{title}</Heading><p>{captions[service.slug] ?? service.short}</p></div>
        </Link>;
      })}
    </div>
    <div className="service-perspectives-bottom"><Link className="site-cta" to="/projects"><span className="button-label">See Projects in Action </span><ArrowUpRight size={18} /></Link></div>
  </section>;
}
