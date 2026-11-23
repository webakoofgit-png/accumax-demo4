import type { CSSProperties } from 'react';
import { CLIENT_LOGOS } from '../data';
import './client-logo-carousel.css';

const midpoint = Math.ceil(CLIENT_LOGOS.length / 2);
const rows = [
  { logos: CLIENT_LOGOS.slice(0, midpoint), startIndex: 0 },
  { logos: CLIENT_LOGOS.slice(midpoint), startIndex: midpoint },
];

export function ClientLogoCarousel() {
  return <div className="client-logo-carousel" role="list" aria-label="Our clients">
    {rows.map(({ logos, startIndex }) => <div className="client-logo-track" key={startIndex} role="presentation" style={{ '--logo-duration': `${logos.length * 2}s` } as CSSProperties}>
      {[false, true].map(duplicate => <div className="client-logo-group" key={String(duplicate)} role="presentation" aria-hidden={duplicate || undefined}>
        {logos.map((logo, index) => <span className="client-logo-item" key={logo} role="listitem">
          <img src={logo} alt={duplicate ? '' : 'Company client logo ' + (startIndex + index + 1)} loading="lazy" decoding="async" />
        </span>)}
      </div>)}
    </div>)}
  </div>;
}
