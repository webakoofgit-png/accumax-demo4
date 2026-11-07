import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import './company-stats.css';

const stats = [
  { value: 501, suffix: '+', label: 'Projects Done' },
  { value: 1381, suffix: '+', label: 'Happy Clients' },
  { value: 99, suffix: '%', label: 'Inhouse Testing Team' },
  { value: 61, suffix: '+', label: 'Testing Kits' },
  { value: 11, suffix: '+', label: 'Awards Won' },
];

function Stat({ value: total, suffix, label }: typeof stats[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const display = useTransform(value, current => Math.round(current).toLocaleString('en-IN'));

  useEffect(() => {
    if (!visible) return;
    if (reduced) { value.set(total); return; }
    const controls = animate(value, total, { duration: 1.5, ease: 'easeOut' });
    return () => controls.stop();
  }, [visible, reduced, total, value]);

  return <div className="company-stat" ref={ref} aria-label={`${total.toLocaleString('en-IN')}${suffix} ${label}`}>
    <span className="company-stat-value" aria-hidden="true"><motion.span>{display}</motion.span><small>{suffix}</small></span>
    <span className="company-stat-label" aria-hidden="true">{label}</span>
  </div>;
}

export function CompanyStats() {
  return <section className="company-stats" aria-label="Accumax at a glance">{stats.map(stat => <Stat key={stat.label} {...stat} />)}</section>;
}
