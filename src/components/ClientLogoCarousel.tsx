import type { CSSProperties } from 'react';
import { CLIENT_LOGOS } from '../data';
import './client-logo-carousel.css';

const midpoint = Math.ceil(CLIENT_LOGOS.length / 2);
const columns = CLIENT_LOGOS.slice(0, midpoint).map((top, index) => ({
  top,
  bottom: CLIENT_LOGOS[midpoint + index] ?? CLIENT_LOGOS[midpoint] ?? top,
  repeated: midpoint + index >= CLIENT_LOGOS.length,
}));

export function ClientLogoCarousel() {
  return <div className="client-logo-carousel">
    <div className="client-logo-track" style={{ '--logo-duration': Math.max(35, midpoint * 4) + 's' } as CSSProperties}>
      {[false, true].map(duplicate => <div className="client-logo-group" key={String(duplicate)} role={duplicate ? undefined : 'list'} aria-label={duplicate ? undefined : 'Our clients'} aria-hidden={duplicate || undefined}>
        {columns.map((column, index) => <div className="client-logo-column" key={column.top} role="presentation">
          <span className="client-logo-item" role="listitem"><img src={column.top} alt={duplicate ? '' : 'Company client logo ' + (index + 1)} loading="lazy" decoding="async" /></span>
          <span className="client-logo-item" role="listitem" aria-hidden={column.repeated || undefined}><img src={column.bottom} alt={duplicate || column.repeated ? '' : 'Company client logo ' + (midpoint + index + 1)} loading="lazy" decoding="async" /></span>
        </div>)}
      </div>)}
    </div>
  </div>;
}
