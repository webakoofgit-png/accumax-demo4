import { FIELD_SERVICE_IMAGES } from '../field-images';
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
  return <section className="section service-perspectives" aria-labelledby="service-perspectives-heading">
    <header className="section-heading">
      <div><span className="eyebrow">03 / PROJECT PERSPECTIVES</span><Heading as="h2" id="service-perspectives-heading" className="section-title">Expertise in <em>perspective.</em></Heading></div>
    </header>
    <div className="service-perspectives-grid">
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
