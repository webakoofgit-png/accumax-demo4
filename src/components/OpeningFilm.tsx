import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useReadyImageSelection } from '../motion/useReadyImageSelection';
import installation from '../assets/images/gallery/9.jpg';
import testing from '../assets/images/hero-testing.jpg';
import solar from '../assets/images/products/solar-and-ev-station.jpg';
import film from '../assets/home banners/ACPL-23-11-26.mp4';

export function OpeningFilm({ poster }: { poster: string }) {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const montage = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const frames = useMemo(() => [poster, installation, testing, solar], [poster]);
  const useFilm = Boolean(film) && !failed;
  const { active, previous, setRequested } = useReadyImageSelection(montage, frames, !useFilm && !reduced);

  useEffect(() => {
    if (useFilm || reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setRequested(index => (index + 1) % frames.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [useFilm, reduced, frames.length, setRequested]);
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
    {useFilm ? <video className="hero-banner-image opening-video" ref={video} src={film} poster={poster} autoPlay muted playsInline loop preload="auto" aria-label="Accumax engineering, installation and testing opening film" onError={() => setFailed(true)} /> : (
      <div className="opening-montage" ref={montage} data-paused={Boolean(reduced)} aria-label="Accumax engineering and infrastructure">
        <img src={frames[active]} alt={active === 0 ? 'Power infrastructure and substation engineering' : ''} className="hero-banner-image opening-frame is-active" decoding="async" />
        {!reduced && active !== previous && <img key={active} className="hero-banner-image image-crossfade-out" src={frames[previous]} alt="" aria-hidden="true" />}
      </div>
    )}
  </>;
}
