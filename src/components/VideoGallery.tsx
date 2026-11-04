import { useRef, useState } from 'react';

export const COMPANY_VIDEOS = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Accumax Controls video ${String(index + 1).padStart(2, '0')}`,
  src: `https://www.accumaxcontrols.com/${index + 1}.mp4`,
  poster: `/videos/posters/accumax-video-${index + 1}.jpg`,
}));

export function VideoGallery() {
  const root = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState<number[]>([]);
  return <div className="gallery-video-grid" ref={root}>
    {COMPANY_VIDEOS.map(video => failed.includes(video.id) ? (
      <div className="gallery-video-error" key={video.id} role="status">
        <strong>{video.title}</strong>
        <p>This video could not load. You can open it directly below.</p>
        <a className="site-cta" href={video.src} target="_blank" rel="noreferrer">Open video</a>
      </div>
    ) : (
      <video key={video.id} src={video.src} poster={video.poster} controls playsInline preload="none" aria-label={video.title}
        onPlay={event => { root.current?.querySelectorAll('video').forEach(other => { if (other !== event.currentTarget) other.pause(); }); }}
        onError={() => setFailed(previous => [...previous, video.id])}
      />
    ))}
  </div>;
}
