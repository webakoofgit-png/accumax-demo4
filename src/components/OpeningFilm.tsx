import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import installation from '../assets/images/gallery/9.jpg';
import testing from '../assets/images/hero-testing.jpg';
import solar from '../assets/images/products/solar-and-ev-station.jpg';

// Add the approved 10–15 second film here without changing the opening layout.
const films = import.meta.glob('/src/assets/opening/*.{mp4,webm}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const film = Object.values(films)[0];

export function OpeningFilm({ poster }: { poster: string }) {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const frames = [poster, installation, testing, solar];
  const useFilm = Boolean(film) && !failed;

  useEffect(() => {
    if (reduced) { setPlaying(false); return; }
    const start = () => setPlaying(true);
    if (document.querySelector('.site-preloader')) window.addEventListener('accumax:ready', start, { once: true });
    else start();
    return () => window.removeEventListener('accumax:ready', start);
  }, [reduced]);
  useEffect(() => {
    if (!playing || useFilm || reduced) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % frames.length), 3000);
    return () => window.clearInterval(timer);
  }, [playing, useFilm, reduced, frames.length]);
  useEffect(() => {
    const element = video.current;
    if (!element || !useFilm) return;
    if (playing && !reduced) void element.play().catch(() => setPlaying(false));
    else element.pause();
  }, [playing, reduced, useFilm]);

  return <>
    {useFilm ? <video className="hero-banner-image opening-video" ref={video} src={reduced ? undefined : film} poster={poster} muted playsInline loop preload="metadata" aria-label="Accumax engineering, installation and testing opening film" onError={() => setFailed(true)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} /> : <div className="opening-montage" data-paused={!playing} aria-label="Accumax engineering and infrastructure">{frames.map((source, i) => <img key={source} src={source} alt={i === 0 ? 'Power infrastructure and substation engineering' : ''} aria-hidden={i !== active} className={`hero-banner-image opening-frame${i === active ? ' is-active' : ''}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />)}</div>}
    {!reduced && <button className="opening-playback" type="button" aria-label={playing ? 'Pause opening film' : 'Play opening film'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={18} /> : <Play size={18} />}<span>{playing ? 'Pause' : 'Play'}</span></button>}
  </>;
}
