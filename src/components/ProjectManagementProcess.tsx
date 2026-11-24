import { useEffect, useRef, useState } from 'react';
import { Heading } from './Heading';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, DraftingCompass, FileCheck2, Hammer, Flag } from 'lucide-react';
import './project-management-process.css';

const stages = [
  { title: 'Initiation', icon: ClipboardCheck },
  { title: 'Planning', icon: DraftingCompass },
  { title: 'Execution', icon: Hammer },
  { title: 'Review', icon: FileCheck2 },
  { title: 'Closure', icon: Flag },
];

const steps = [
  { stage: 0, title: 'Contracts & Scope', heading: 'Contract', text: 'Agree the scope, responsibilities and timeline before work begins.' },
  { stage: 1, title: 'Design & Drawings', heading: 'Design', text: 'Prepare project designs and drawings for client review.' },
  { stage: 2, title: 'Approval', heading: 'Approval', text: 'Confirm client approval of the design before site execution.' },
  { stage: 2, title: 'Deployment', heading: 'Deployment', text: 'Deliver the approved design through procurement, installation and execution.' },
  { stage: 3, title: 'Quality Control', heading: 'Quality Control', text: 'Check progress against agreed specifications and quality requirements.' },
  { stage: 4, title: 'Lessons Learned', heading: 'Lessons Learned', text: 'Complete handover and capture lessons for future projects.' },
];

export function ProjectManagementProcess() {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { amount: 0.2 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [connectors, setConnectors] = useState({ width: 1200, paths: [] as string[], arrows: [] as number[], compact: false });

  useEffect(() => {
    const chart = root.current?.querySelector<HTMLElement>('.process-chart');
    if (!chart) return;
    const update = () => {
      const bounds = chart.getBoundingClientRect();
      const buttons = chart.querySelectorAll('.process-stages > button');
      const labels = chart.querySelectorAll('.process-detail-label');
      if (!bounds.width || buttons.length !== stages.length || labels.length !== steps.length) return;
      const paths = steps.map((step, index) => {
        const upper = buttons[step.stage].getBoundingClientRect();
        const lower = labels[index].getBoundingClientRect();
        const from = upper.left + upper.width / 2 - bounds.left;
        const to = lower.left + lower.width / 2 - bounds.left;
        return `M${from} 0V20H${to}V46.5`;
      });
      const arrows = Array.from(buttons).slice(0, -1).map((button, index) =>
        Math.max(1, buttons[index + 1].getBoundingClientRect().left - button.getBoundingClientRect().right));
      setConnectors({ width: bounds.width, paths, arrows, compact: window.matchMedia('(max-width: 760px)').matches });
    };
    const observer = new ResizeObserver(update);
    observer.observe(chart);
    update();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced || hovered || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(current => (current + 1) % stages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [visible, reduced, hovered, focused]);

  return <section id="project-management-process" className="section project-process" ref={root} aria-labelledby="project-process-title"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
    onPointerLeave={event => { if (event.pointerType !== 'touch') setHovered(false); }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="project-process-inner">
      <header className="project-process-heading">
        <span className="eyebrow">02 / HOW WE DELIVER</span>
        <Heading as="h2" id="project-process-title" className="section-title">Project <em>Management Process</em></Heading>
        <p>A clear path from the first brief to the final handover.</p>
      </header>
      <div className="process-chart-scroll" role="region" aria-label="Project management flow chart" tabIndex={0}>
      <motion.div className="process-chart"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <div className="process-stages" role="group" aria-label="Project management stages">
        {stages.map(({ title, icon: Icon }, index) => {
          const arrowWidth = connectors.arrows[index] ?? 26;
          const arrowHead = Math.min(8, arrowWidth * .45);
          return <button key={title} type="button"
          className={index === 2 ? 'process-stage-execution' : undefined}
          aria-label={title} aria-pressed={active === index} aria-controls="process-details" onClick={() => setActive(index)}
          onPointerEnter={event => { if (event.pointerType !== 'touch') setActive(index); }}
          onFocus={() => setActive(index)}>
          <span className="process-stage-number"><span className="button-label">0{index + 1}</span></span>
          <span className="process-stage-title"><span className="button-label">{title}</span></span><Icon size={28} strokeWidth={1.5} aria-hidden="true" />
          {index < stages.length - 1 && <svg className="process-stage-arrow lucide lucide-arrow-right" viewBox={`0 0 ${arrowWidth} 24`} preserveAspectRatio="none" style={{ width: arrowWidth }} height="28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path vectorEffect="non-scaling-stroke" d={`M0 12H${Math.max(0, arrowWidth - 1)}m-${arrowHead}-8 ${arrowHead} 8-${arrowHead} 8`} /></svg>}
        </button>;
        })}
      </div>
      <svg className="process-connections" viewBox={`0 0 ${connectors.width} 48`} preserveAspectRatio="none" aria-hidden="true">
        <defs>{steps.map((step, index) => <marker key={step.title} id={`process-arrow-${index}`} className={step.stage === active ? 'is-active' : undefined} viewBox="0 0 20 20" refX="18" refY="10" markerWidth={connectors.compact ? 10 : 20} markerHeight={connectors.compact ? 10 : 20} markerUnits="userSpaceOnUse" orient="auto"><path d="M10 2L18 10L10 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></marker>)}</defs>
        {connectors.paths.map((path, index) => <path key={steps[index].title} d={path} markerEnd={`url(#process-arrow-${index})`} className={steps[index].stage === active ? 'is-active' : ''} />)}
      </svg>
      <div className="process-details" id="process-details">
        {steps.map(step => <article key={step.title} className={`process-detail${active === step.stage ? ' is-active' : ''}`}>
          <div className="process-detail-label">{step.title}</div>
          <div className="process-detail-copy"><span className="process-detail-stage">0{step.stage + 1} / {stages[step.stage].title}</span><h3>{step.heading}</h3><p>{step.text}</p></div>
        </article>)}
      </div>
      </motion.div>
      </div>
    </div>
  </section>;
}
