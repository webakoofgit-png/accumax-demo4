import { FIELD_SERVICE_IMAGES } from '../field-images';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data';
import { Heading } from './Heading';
import './project-perspectives-grid.css';

const assets = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const images: Record<string, string> = {
  'epc-projects': '/home page img/04  PROJECT PERSPECTIVES/EPC Projects.png',
  'scada-relay-testing': '/home page img/04  PROJECT PERSPECTIVES/Scada & Relay Testing.png',
  export: '/home page img/04  PROJECT PERSPECTIVES/Export.png',
  'substation-testing-commissioning': '/home page img/04  PROJECT PERSPECTIVES/Substation - T&C.png',
  'fabrication-civil-work': '/home page img/04  PROJECT PERSPECTIVES/Fabrication & Civil Work.png',
  'gis-erection-supervision': '/home page img/04  PROJECT PERSPECTIVES/GIS Erection & Supervision.png',
  'solar-ev-station': '/home page img/04  PROJECT PERSPECTIVES/Solar & EV Station.png',
  ...FIELD_SERVICE_IMAGES,
};
const captions: Record<string, string> = {
  'epc-projects': 'Power infrastructure, end to end.',
  'scada-relay-testing': 'Automation, protection and relay testing.',
  export: 'Substation equipment, delivered worldwide.',
  'substation-testing-commissioning': 'Testing and commissioning across voltage levels.',
  'fabrication-civil-work': 'Civil works and structural fabrication.',
  'gis-erection-supervision': 'GIS installation, supervision and equipment supply.',
  'solar-ev-station': 'Solar power and EV charging infrastructure.',
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
        const source = images[service.slug] ?? service.image;
        return <Link className="service-perspective-card" to={'/services/' + service.slug} key={service.slug}>
          <div className="service-perspective-photo">
            <img src={assets['/src/assets' + source] ?? source} alt={title} loading="lazy" decoding="async" />
            <span className="service-perspective-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
            <div className="service-perspective-overlay" aria-hidden="true"><strong>{title}</strong><p>{service.short}</p></div>
          </div>
          <div className="service-perspective-caption"><Heading as="h3">{title}</Heading><p>{captions[service.slug] ?? service.short}</p></div>
        </Link>;
      })}
    </div>
    <div className="service-perspectives-bottom"><Link className="site-cta" to="/projects">Explore all projects <ArrowUpRight size={18} /></Link></div>
  </section>;
}
