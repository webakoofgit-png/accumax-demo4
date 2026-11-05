import { useEffect, useRef, useState } from 'react';
import { Heading } from './Heading';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ClipboardCheck, DraftingCompass, FileCheck2, Hammer, Flag, ArrowRight } from 'lucide-react';
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

const connections = [
  'M120 0V22H100V48', 'M360 0V22H300V48',
  'M600 0V22H500V48', 'M600 22H700V48',
  'M840 0V22H900V48', 'M1080 0V22H1100V48',
];

export function ProjectManagementProcess() {
  const root = useRef<HTMLElement>(null);
  const visible = useInView(root, { amount: 0.2 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!visible || reduced || paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(current => (current + 1) % stages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [visible, reduced, paused]);

  return <section id="project-management-process" className="section project-process" ref={root} aria-labelledby="project-process-title"
    onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}>
    <div className="project-process-inner">
      <header className="project-process-heading">
        <span className="eyebrow">02 / HOW WE DELIVER</span>
        <Heading as="h2" id="project-process-title" className="section-title">Project <em>Management Process</em></Heading>
        <p>A clear path from the first brief to the final handover.</p>
      </header>
      <div className="process-stages" role="group" aria-label="Project management stages">
        {stages.map(({ title, icon: Icon }, index) => <motion.button key={title} type="button"
          aria-pressed={active === index} aria-controls="process-details" onClick={() => setActive(index)}
          initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: reduced ? 0 : index * 0.1 }}>
          <span className="process-stage-number">0{index + 1}</span>
          <span className="process-stage-title">{title}</span><Icon size={28} strokeWidth={1.5} aria-hidden="true" />
          {index < stages.length - 1 && <ArrowRight className="process-stage-arrow" size={20} aria-hidden="true" />}
        </motion.button>)}
      </div>
      <svg className="process-connections" viewBox="0 0 1200 48" preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="process-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#a5ada8" /></marker></defs>
        {connections.map((path, index) => <path key={path} d={path} markerEnd="url(#process-arrow)" className={steps[index].stage === active ? 'is-active' : ''} />)}
      </svg>
      <div className="process-details" id="process-details">
        {steps.map((step, index) => <motion.article key={step.title} className={`process-detail${active === step.stage ? ' is-active' : ''}`}
          initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: reduced ? 0 : index * 0.08 }}>
          <div className="process-detail-label">{step.title}</div>
          <div className="process-detail-copy"><span className="process-detail-stage">0{step.stage + 1} / {stages[step.stage].title}</span><h3>{step.heading}</h3><p>{step.text}</p></div>
        </motion.article>)}
      </div>
    </div>
  </section>;
}
