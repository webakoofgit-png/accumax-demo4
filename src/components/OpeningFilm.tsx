import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import installation from '../assets/images/gallery/9.jpg';
import testing from '../assets/images/hero-testing.jpg';
import solar from '../assets/images/products/solar-and-ev-station.jpg';
import film from '../assets/home banners/home page banner video.mp4';

export function OpeningFilm({ poster }: { poster: string }) {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const frames = [poster, installation, testing, solar];
  const useFilm = Boolean(film) && !failed;

  useEffect(() => {
    if (useFilm || reduced) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % frames.length), 3000);
    return () => window.clearInterval(timer);
  }, [useFilm, reduced, frames.length]);
  useEffect(() => {
    const element = video.current;
    if (!element || !useFilm) return;
    // Set the media properties before requesting playback, including on Safari.
    element.defaultMuted = true;
    element.muted = true;
    element.playsInline = true;
    const play = () => {
      if (!document.hidden && element.paused) void element.play().catch(() => {});
    };
    play();
    element.addEventListener('loadeddata', play);
    element.addEventListener('canplay', play);
    window.addEventListener('pageshow', play);
    document.addEventListener('visibilitychange', play);
    document.addEventListener('pointerdown', play, { passive: true });
    document.addEventListener('keydown', play);
    return () => {
      element.removeEventListener('loadeddata', play);
      element.removeEventListener('canplay', play);
      window.removeEventListener('pageshow', play);
      document.removeEventListener('visibilitychange', play);
      document.removeEventListener('pointerdown', play);
      document.removeEventListener('keydown', play);
    };
  }, [useFilm]);

  return <>
    {useFilm ? <video className="hero-banner-image opening-video" ref={video} src={film} poster={poster} autoPlay muted playsInline loop preload="auto" aria-label="Accumax engineering, installation and testing opening film" onError={() => setFailed(true)} /> : <div className="opening-montage" data-paused={Boolean(reduced)} aria-label="Accumax engineering and infrastructure">{frames.map((source, i) => <img key={source} src={source} alt={i === 0 ? 'Power infrastructure and substation engineering' : ''} aria-hidden={i !== active} className={`hero-banner-image opening-frame${i === active ? ' is-active' : ''}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />)}</div>}
  </>;
}
