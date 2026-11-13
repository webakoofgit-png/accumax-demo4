import { Quote } from 'lucide-react';
import { Heading } from './Heading';
import './home-testimonials.css';

// Sample content only. Replace these quotes and attributions with approved client feedback.
const testimonials = [
  {
    quote: 'From planning through site execution, the team kept every step clear. Their coordinated approach helped us move forward with confidence.',
    name: 'Sample Client 01',
    role: 'Project Manager · Example Power Company',
  },
  {
    quote: 'The attention to detail during testing and commissioning stood out. We appreciated the clear communication and practical support throughout.',
    name: 'Sample Client 02',
    role: 'Operations Head · Example Manufacturing Company',
  },
  {
    quote: 'Having engineering and equipment support together made coordination easier. The team understood our requirements and stayed responsive as the work progressed.',
    name: 'Sample Client 03',
    role: 'Procurement Lead · Example Infrastructure Company',
  },
];

export function HomeTestimonials() {
  return <section className="section home-testimonials" aria-labelledby="home-testimonials-title">
    <header className="section-heading home-testimonials-heading">
      <div>
        <span className="eyebrow">09 / TESTIMONIALS</span>
        <Heading as="h2" id="home-testimonials-title" className="section-title">What our <em>clients say.</em></Heading>
      </div>
    </header>
    <div className="home-testimonials-grid">
      {testimonials.map((item, index) => <figure className="home-testimonial" key={item.name}>
        <Quote size={30} strokeWidth={1.4} aria-hidden="true" />
        <blockquote><p>{item.quote}</p></blockquote>
        <figcaption>
          <span className="home-testimonial-avatar" aria-hidden="true">0{index + 1}</span>
          <div><strong>{item.name}</strong><span>{item.role}</span></div>
        </figcaption>
      </figure>)}
    </div>
  </section>;
}
