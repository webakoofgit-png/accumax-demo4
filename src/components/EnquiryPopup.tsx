import { Heading } from './Heading';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { SERVICE_OPTIONS } from '../data';
import { useWeb3Form } from '../forms/useWeb3Form';
import { PhoneInput } from '../forms/PhoneInput';
import projectPhoto from '../assets/Industrial Substation at Sunset.png';
import companyLogo from '../assets/images/logo.png';
import './enquiry-popup.css';

const EnquiryContext = createContext<(service?: string) => void>(() => {});
export const useEnquiry = () => useContext(EnquiryContext);

export function EnquiryPopup({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submission = useWeb3Form();

  const [service, setService] = useState('');
  const manuallyOpened = useRef(false);
  const openEnquiry = (selectedService = '') => {
    manuallyOpened.current = true;
    submission.clear();
    setService(selectedService);
    dialog.current?.showModal();
  };
  const panelCleaning = service === 'Live Electric Panel Cleaning';

  useEffect(() => {
    let due = false;
    let shown = false;
    const show = () => {
      if (!due || shown || manuallyOpened.current || !dialog.current || document.hidden) return;
      shown = true;
      dialog.current.showModal();
    };
    const timer = window.setTimeout(() => {
      due = true;
      show();
    }, 10000);
    document.addEventListener('visibilitychange', show);
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', show); };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    let previousOverflow: string | undefined;
    const sync = () => {
      if (element.open && previousOverflow === undefined) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else if (!element.open && previousOverflow !== undefined) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = undefined;
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(element, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
      if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow;
    };
  }, []);

  return <EnquiryContext.Provider value={openEnquiry}>{children}<dialog className="enquiry-popup" ref={dialog} aria-labelledby="enquiry-popup-title" aria-describedby="enquiry-popup-intro"
    onClick={event => { if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
    } }}>
    <div className="enquiry-popup-shell">
    <div className="enquiry-popup-header">
      <img src={companyLogo} alt="Accumax Controls Private Limited"/>
      <button type="button" className="enquiry-popup-header-close" aria-label="Close enquiry form" onClick={() => dialog.current?.close()}><X size={20}/></button>
    </div>
    <aside className="enquiry-popup-visual" aria-label="Accumax engineering">
      <img src={projectPhoto} alt="" loading="lazy"/>
      <div className="enquiry-popup-brand"><img src={companyLogo} alt="Accumax Controls Private Limited"/></div>
      <div className="enquiry-popup-visual-copy"><Heading as="h3">Your vision.<br/><em>Our expertise.</em></Heading></div>
    </aside>
    <div className="enquiry-popup-content">
      <button type="button" className="enquiry-popup-close" aria-label="Close enquiry form" onClick={() => dialog.current?.close()}><X size={22}/></button>
      <Heading as="h2" id="enquiry-popup-title">{panelCleaning ? 'Live Electric Panel Cleaning ' : 'Project '}<span>enquiry.</span></Heading>
      <p id="enquiry-popup-intro">{panelCleaning ? 'Share your panel details, site location and preferred schedule. Our team will help define the cleaning scope.' : 'Tell us about your project. Our team will help you take the next step.'}</p>
      <form aria-busy={submission.busy} onChange={submission.clear} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void submission.send(data, panelCleaning ? 'Live Electric Panel Cleaning enquiry' : 'Engineering project enquiry', 'Enquiry popup');
      }}>
        <input type="checkbox" name="botcheck" hidden tabIndex={-1} aria-hidden="true" />
        <div className="enquiry-popup-row">
          <label><span className="enquiry-popup-label-text">Full name<span aria-hidden="true">*</span></span><input name="name" autoComplete="name" required maxLength={100} placeholder="Your name"/></label>
          <label><span className="enquiry-popup-label-text">Phone number<span aria-hidden="true">*</span></span><PhoneInput placeholder="10-digit mobile number"/></label>
        </div>
        <div className="enquiry-popup-row">
          <label><span className="enquiry-popup-label-text">Email address<span aria-hidden="true">*</span></span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@company.com"/></label>
          <label>Interested in<select name="service" value={service} onChange={event => setService(event.target.value)}><option value="">Select a service</option>{SERVICE_OPTIONS.map(title => <option key={title}>{title}</option>)}</select></label>
        </div>
        <label><span className="enquiry-popup-label-text">Project requirements<span aria-hidden="true">*</span></span><textarea name="message" required rows={3} maxLength={3000} placeholder={panelCleaning ? "Panel type, quantity, site location and preferred date" : "Tell us what you are planning"}/></label>
        <button className="enquiry-popup-submit" type="submit" disabled={submission.busy || submission.sent}>{submission.busy ? 'Sending enquiry…' : submission.sent ? 'Enquiry sent' : 'Send enquiry'} <ArrowUpRight size={18}/></button>
        {submission.error && <div className="form-feedback" role="alert">{submission.error}</div>}
        {submission.sent && <div className="form-feedback" role="status">Your enquiry has been sent successfully. Our team will get in touch with you.</div>}
      </form>
    </div>
    </div>
  </dialog></EnquiryContext.Provider>;
}
