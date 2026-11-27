import { useEffect, useRef } from 'react';
import cableInstallation from '../assets/all images/cable-trays.jpg';
import metroInfrastructure from '../assets/all images/industry-metro-480.webp';
import productionLine from '../assets/all images/industry-food-beverage-960.webp';
import engineeringTeam from '../assets/all images/team-group.jpg';
import './connection-collage.css';

const photos = [
  { src: cableInstallation, alt: 'Electrical cable runs at an installation site' },
  { src: metroInfrastructure, alt: 'Metro train beneath overhead power lines' },
  { src: productionLine, alt: 'Automated bottling line in a production facility' },
  { src: engineeringTeam, alt: 'Accumax Controls team members' },
];

export function ConnectionCollage() {
  const root = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const collage = root.current;
    if (!collage || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.intersectionRatio >= 0.3;
      collage.dataset.visible = String(visible);
      if (visible) collage.dataset.inView = 'true';
    }, { threshold: 0.3 });

    observer.observe(collage);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={root} className="connection-collage" aria-label="Engineering and infrastructure photos">
      {photos.map(({ src, alt }) => (
        <li key={src}>
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
}
