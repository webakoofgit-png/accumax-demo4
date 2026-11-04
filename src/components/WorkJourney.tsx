import { Heading } from './Heading';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './work-journey.css';

gsap.registerPlugin(ScrollTrigger);
const photographs = import.meta.glob('/src/assets/images/**/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Stage names and primary descriptions are the existing six-stage Accumax process.
// The supporting messages and links are retained from the former section 03.
export const WORK_MILESTONES = [
  { title: 'Understand', label: 'REQUIREMENTS', description: 'Define scope, interfaces and operating requirements.', messageTitle: 'Better together.', message: 'Clear communication, coordinated interfaces and long-term client relationships.', image: '/images/gallery/3.jpg', alt: 'Engineering planning and project coordination', caption: 'Engineering planning', node: 44 },
  { title: 'Plan', label: 'COORDINATION', description: 'Coordinate resources, procurement and site activities.', messageTitle: 'Local understanding. Global connections.', message: '', image: '/images/gallery/12.jpg', alt: 'Substation site works and installation infrastructure', caption: 'Coordinating site activities', node: 54, link: { to: '/services/export', label: 'Explore exports' } },
  { title: 'Engineer', label: 'PROTECTION & CONTROL', description: 'Develop the engineering approach and protection requirements.', messageTitle: 'Small details. System-wide confidence.', message: 'Relay programming. Protection setting calculations. System audits.', image: '/images/gallery/13.jpg', alt: 'Electrical protection relay testing equipment', caption: 'Protection & control', node: 47 },
  { title: 'Execute', label: 'FROM DRAWING TO DELIVERY', description: 'Bring equipment, civil works and electrical systems together.', messageTitle: 'Execution. With intention.', message: 'Civil, electrical and testing disciplines working toward one handover.', image: '/images/gallery/9.jpg', alt: 'Gas insulated switchgear installation inside a substation', caption: 'Substation installation', node: 62 },
  { title: 'Test', label: 'QUALITY & SAFETY', description: 'Check installation, control logic and system performance.', messageTitle: 'Quality is a process.', message: 'Customer specifications, documented checks and a focus on safe working conditions.', image: '/images/hero-testing.jpg', alt: 'Engineer testing electrical protection equipment', caption: 'Testing & commissioning', node: 49, link: { to: '/quality-safety', label: 'Quality & safety' } },
  { title: 'Deliver', label: 'HANDOVER', description: 'Review documentation and prepare the handover.', messageTitle: '', message: '', image: '/images/about-01.jpg', alt: 'Electrical substation infrastructure', caption: 'From requirements to handover', node: 57 },
] as const;

type Point = { x: number; y: number };

export function WorkJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const svg = routeRef.current;
    const line = progressRef.current;
    const base = baseRef.current;
    const end = endRef.current;
    if (!root || !track || !svg || !line || !base || !end) return;
    const rows = Array.from(track.querySelectorAll<HTMLElement>('.journey-milestone'));
    let fractions: number[] = [];
    let geometryFrame = 0;
    let refreshFrame = 0;
    let disposed = false;
    let redrawProgress: (() => void) | undefined;

    const measureRoute = () => {
      if (disposed) return;
      const bounds = track.getBoundingClientRect();
      const width = track.clientWidth;
      const height = track.clientHeight;
      if (!width || !height) return;
      const compact = window.matchMedia('(max-width: 900px)').matches;
      const points: Point[] = [{ x: compact ? 15 : width * .48, y: 0 }];
      rows.forEach(row => {
        const dot = row.querySelector<HTMLElement>('.journey-node')!.getBoundingClientRect();
        points.push({ x: dot.left + dot.width / 2 - bounds.left, y: dot.top + dot.height / 2 - bounds.top });
      });
      const ring = end.querySelector('.journey-completion-ring')!.getBoundingClientRect();
      points.push({ x: ring.left + ring.width / 2 - bounds.left, y: ring.top - bounds.top + 1 });
      let d = `M ${points[0].x} ${points[0].y}`;
      const prefixes: string[] = [];
      points.slice(1).forEach((point, i) => {
        const previous = points[i];
        const distance = point.y - previous.y;
        const bend = (compact ? 10 : Math.min(width * .13, 165)) * (i % 2 ? 1 : -1);
        d += ` C ${previous.x + bend} ${previous.y + distance * .4}, ${point.x - bend} ${point.y - distance * .4}, ${point.x} ${point.y}`;
        prefixes.push(d);
      });
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      base.setAttribute('d', d);
      line.setAttribute('d', d);
      const length = line.getTotalLength();
      const ruler = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ruler.style.visibility = 'hidden';
      svg.appendChild(ruler);
      fractions = prefixes.slice(0, rows.length).map(prefix => {
        ruler.setAttribute('d', prefix);
        return ruler.getTotalLength() / length;
      });
      ruler.remove();
      redrawProgress?.();
    };
    measureRoute();

    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', compact: '(max-width: 900px)' }, match => {
      if (!match.conditions?.motion) {
        rows.forEach(row => { row.dataset.phase = 'active'; });
        root.dataset.motion = 'reduced';
        return () => { rows.forEach(row => { delete row.dataset.phase; }); delete root.dataset.motion; };
      }
      const context = gsap.context(() => {
        const compact = Boolean(match.conditions?.compact);
        const glowY = gsap.quickTo(root.querySelector('.journey-ambient'), 'y', { duration: 1.2, ease: 'power2.out' });
        const glowX = gsap.quickTo(root.querySelector('.journey-ambient'), 'x', { duration: 1.2, ease: 'power2.out' });
        let current = -1;
        let completed = false;
        rows.forEach((row, i) => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top bottom+=120', once: true } });
          timeline.fromTo(row.querySelector('.journey-image-mask'),
            { clipPath: compact ? 'inset(0 0 100% 0)' : i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0 0 0)', duration: .45, ease: 'power2.out' })
            .fromTo(row.querySelector('.journey-title-line>span'), { yPercent: 110 }, { yPercent: 0, duration: .4, ease: 'power3.out' }, 0)
            .fromTo(row.querySelectorAll('.journey-kicker,.journey-primary,.journey-message,.journey-link,figcaption'),
              { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, stagger: .025, ease: 'power2.out' }, 0);
          if (!compact) gsap.fromTo(row.querySelector('img'), { yPercent: -3, scale: 1.045 }, {
            yPercent: 3, scale: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
        const finish = gsap.timeline({ paused: true });
        finish.fromTo(end.querySelector('.journey-ring-progress'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, duration: .9, ease: 'power2.out' })
          .fromTo(end.querySelector('.journey-result-line>span'), { yPercent: 110 }, { yPercent: 0, duration: .9, ease: 'power3.out' }, .2)
          .fromTo(end.querySelectorAll('.journey-result-copy,.journey-result-cta'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .7, stagger: .1 }, .4);
        const sync = (progress: number) => {
          if (!fractions.length) return;
          let next = -1;
          fractions.forEach((fraction, i) => {
            if (progress >= fraction - .012) {
              next = i;
            }
          });
          if (next !== current) {
            current = next;
            rows.forEach((row, i) => { row.dataset.phase = i === next ? 'active' : i < next ? 'past' : 'upcoming'; });
            if (next >= 0) { glowY(rows[next].offsetTop - 80); glowX(next % 2 ? 120 : -120); }
          }
          if (progress >= .985 && !completed) { completed = true; finish.play(); }
        };
        const drawing = gsap.fromTo(line, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, autoRound: false, ease: 'none',
          onUpdate: function(this: gsap.core.Tween) { sync(this.progress()); },
          scrollTrigger: { trigger: track, start: 'top 78%', endTrigger: end.querySelector('.journey-completion-ring'), end: 'top 72%', scrub: .35, invalidateOnRefresh: true, onRefresh: self => sync(self.progress) },
        });
        redrawProgress = () => sync(drawing.progress());
        gsap.fromTo(root.querySelectorAll('.journey-heading-line>span'), { yPercent: 110 }, {
          yPercent: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });
        gsap.fromTo(root.querySelector('.journey-intro-copy'), { opacity: 0, y: 18 }, {
          opacity: 1, y: 0, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });
      }, root);
      return () => { redrawProgress = undefined; rows.forEach(row => { delete row.dataset.phase; }); context.revert(); };
    });

    const refresh = () => {
      cancelAnimationFrame(geometryFrame);
      geometryFrame = requestAnimationFrame(() => {
        if (disposed) return;
        measureRoute();
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => { if (!disposed) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } });
      });
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(track);
    const images = Array.from(track.querySelectorAll('img'));
    images.forEach(image => image.addEventListener('load', refresh));
    window.addEventListener('accumax:ready', refresh);
    let settled = false;
    document.fonts.ready.then(() => { if (!settled) refresh(); });
    refresh();
    return () => {
      disposed = true; settled = true;
      observer.disconnect();
      cancelAnimationFrame(geometryFrame); cancelAnimationFrame(refreshFrame);
      images.forEach(image => image.removeEventListener('load', refresh));
      window.removeEventListener('accumax:ready', refresh);
      media.revert();
    };
  }, []);

  return <section id="work-journey" className="work-journey" ref={rootRef} aria-labelledby="work-journey-heading">
    <div className="journey-inner">
      <header className="journey-intro"><div><span className="eyebrow">03 / THE WAY WE WORK</span><Heading as="h2" id="work-journey-heading"><span className="journey-heading-line"><span>From Vision</span></span>{' '}<span className="journey-heading-line"><span>to Execution.</span></span></Heading></div><p className="journey-intro-copy">Every project begins with understanding and moves forward through engineering precision, coordinated execution and dependable delivery.</p></header>
      <div className="journey-track" ref={trackRef}>
        <div className="journey-ambient" aria-hidden="true"/>
        <svg className="journey-route" ref={routeRef} aria-hidden="true"><defs><linearGradient id="journey-orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c86532"/><stop offset="100%" stopColor="#e69059"/></linearGradient></defs><path ref={baseRef} className="journey-route-base"/><path ref={progressRef} pathLength="1" className="journey-route-progress"/></svg>
        {WORK_MILESTONES.map((stage, i) => <article className={`journey-milestone milestone-${i}`} key={stage.title} aria-labelledby={`journey-title-${i}`} style={{ '--node-x': `${stage.node}%` } as React.CSSProperties}>
          <span className="journey-node" aria-hidden="true"/>
          <div className="journey-copy"><span className="journey-kicker"><span>{String(i + 1).padStart(2, '0')}</span>{stage.label}</span><Heading as="h3" id={`journey-title-${i}`} className="journey-title-line"><span>{stage.title}<span className="journey-title-dot">.</span></span></Heading><p className="journey-primary">{stage.description}</p>{stage.messageTitle && <div className="journey-message"><h4>{stage.messageTitle}</h4>{stage.message && <p>{stage.message}</p>}</div>}{'link' in stage && <Link className="journey-link" to={stage.link.to}>{stage.link.label}<ArrowUpRight size={17}/></Link>}</div>
          <figure className="journey-figure"><div className="journey-image-mask"><img src={photographs['/src/assets' + stage.image] ?? stage.image} alt={stage.alt} width="960" height="640" loading="lazy" decoding="async"/></div><figcaption><span>{stage.caption}</span><span aria-hidden="true">ACCUMAX / {String(i + 1).padStart(2, '0')}</span></figcaption></figure>
        </article>)}
        <div className="journey-completion" ref={endRef}><div className="journey-completion-ring" aria-hidden="true"><svg viewBox="0 0 72 72"><circle className="journey-ring-base" cx="36" cy="36" r="32"/><circle className="journey-ring-progress" cx="36" cy="36" r="32" pathLength="1" transform="rotate(-90 36 36)"/><circle className="journey-ring-dot" cx="36" cy="36" r="3"/></svg></div><span className="journey-end-label">FROM INTENT TO INFRASTRUCTURE</span><Heading as="h3" className="journey-result-line"><span>Engineered for Results.</span></Heading><p className="journey-result-copy">A coordinated path from requirements to handover.</p><Link className="journey-result-cta" to="/services">Explore our capabilities <ArrowUpRight size={18}/></Link></div>
      </div>
    </div>
  </section>;
}
