import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, FileText, Mail, Upload, X } from 'lucide-react';
import { Heading } from './Heading';
import { COMPANY } from '../data';
import teamPhoto from '../assets/images/team1.jpg';
import { applicationEmail, CAREER_AREAS, CAREER_EXPERIENCE, resumeError, type CareerApplication } from '../careers/application';
import './careers.css';

const Required = () => <span className="career-required" aria-hidden="true">*</span>;

export function Careers() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState('');
  useEffect(() => () => { if (draft) URL.revokeObjectURL(draft); }, [draft]);
  useEffect(() => { if (draft) statusRef.current?.focus(); }, [draft]);

  const prepare = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resume || fileError || busy) return;
    const values = new FormData(event.currentTarget);
    const data = Object.fromEntries(['name', 'email', 'phone', 'city', 'education', 'interest', 'experience', 'notice', 'message'].map(key => [key, String(values.get(key) ?? '').trim()])) as CareerApplication;
    setBusy(true); setError('');
    try { setDraft(URL.createObjectURL(await applicationEmail(data, resume, COMPANY.emails[0]))); }
    catch (problem) { setError(problem instanceof Error ? problem.message : 'We could not prepare your email. Please try again.'); }
    finally { setBusy(false); }
  };

  return <div className="careers-page">
    <section className="section careers-hero" aria-labelledby="careers-title">
      <div className="careers-hero-copy">
        <span className="eyebrow">WORK WITH ACCUMAX</span>
        <Heading as="h1" id="careers-title">Build your next chapter with us.</Heading>
        <p>Bring your skills to the systems that power industry. Introduce yourself to Accumax Controls and tell us where you want to make an impact.</p>
        <a className="site-cta" href="#career-application">Introduce yourself</a>
      </div>
      <figure className="careers-team-image"><img src={teamPhoto} alt="The Accumax Controls team" loading="eager" /><figcaption>PEOPLE. PRACTICAL THINKING. SHARED PROGRESS.</figcaption></figure>
    </section>

    <section className="section careers-application-layout" aria-label="Career opportunities and application">
      <aside className="careers-introduction">
        <span className="eyebrow">YOUR NEXT STEP</span>
        <Heading as="h2">Put your expertise into practice.</Heading>
        <p>Our work connects engineering, equipment and execution across substations, automation, renewable energy and electrical infrastructure.</p>
        <p>Whether you are starting out or bringing site experience, share your background and the discipline you would like to work in.</p>
        <Heading as="h3">Areas you can contribute</Heading>
        <ul className="career-disciplines">{CAREER_AREAS.filter(area => area !== 'Other').map(area => <li key={area}><Check size={16} aria-hidden="true" />{area}</li>)}</ul>
        <div className="career-direct-contact"><Mail size={20} aria-hidden="true" /><div><strong>Prefer to email us?</strong><a href={`mailto:${COMPANY.emails[0]}?subject=Career%20application`}>{COMPANY.emails[0]}</a><small>Include your introduction and attach your resume.</small></div></div>
      </aside>

      <form id="career-application" className="career-form" ref={formRef} onSubmit={prepare} onChange={() => { setDraft(''); setError(''); }} aria-labelledby="career-form-title">
        <div className="career-form-heading"><span className="eyebrow">CAREER APPLICATION</span><Heading as="h2" id="career-form-title">Tell us about yourself.</Heading><small><Required /> Required fields</small></div>
        <fieldset disabled={busy}>
          <legend><span>01</span> Personal details</legend>
          <div className="career-field-grid">
            <label htmlFor="career-name">Full name <Required /><input id="career-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} /></label>
            <label htmlFor="career-email">Email address <Required /><input id="career-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
            <label htmlFor="career-phone">Phone number <Required /><input id="career-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required minLength={7} maxLength={25} pattern={String.raw`[+0-9\s\(\)\.\-]{7,25}`} /></label>
            <label htmlFor="career-city">Current location <Required /><input id="career-city" name="city" autoComplete="address-level2" placeholder="City, state" required maxLength={120} /></label>
          </div>
        </fieldset>
        <fieldset disabled={busy}>
          <legend><span>02</span> Your background</legend>
          <div className="career-field-grid">
            <label htmlFor="career-education">Education / qualification <Required /><input id="career-education" name="education" placeholder="e.g. Diploma / BE in Electrical Engineering" required maxLength={160} /></label>
            <label htmlFor="career-interest">Area of interest <Required /><select id="career-interest" name="interest" required defaultValue=""><option value="" disabled>Select a discipline</option>{CAREER_AREAS.map(area => <option key={area}>{area}</option>)}</select></label>
            <label htmlFor="career-experience">Total experience <Required /><select id="career-experience" name="experience" required defaultValue=""><option value="" disabled>Select your experience</option>{CAREER_EXPERIENCE.map(value => <option key={value}>{value}</option>)}</select></label>
            <label htmlFor="career-notice">Availability / notice period <span className="career-optional">(optional)</span><select id="career-notice" name="notice" defaultValue=""><option value="">Select availability</option>{['Immediate', 'Within 15 days', 'Within 30 days', 'Within 60 days', 'Within 90 days', 'To be discussed'].map(value => <option key={value}>{value}</option>)}</select></label>
          </div>
        </fieldset>
        <fieldset disabled={busy}>
          <legend><span>03</span> Your introduction &amp; resume</legend>
          <label htmlFor="career-message">Tell us about your skills and interests <Required /><textarea id="career-message" name="message" rows={4} required maxLength={2000} placeholder="Share your relevant skills, project or site experience, and the kind of work you are looking for." /></label>
          <label className="career-resume-label" htmlFor="career-resume">Resume / CV <Required /></label>
          <div className={`career-upload${fileError ? ' has-error' : ''}`}>
            {resume ? <FileText size={26} aria-hidden="true" /> : <Upload size={26} aria-hidden="true" />}
            <div><strong>{resume ? resume.name : 'Choose your resume'}</strong><span>{resume ? `${(resume.size / 1024).toFixed(0)} KB · Ready to attach` : 'PDF, DOC or DOCX · Maximum 2 MB'}</span></div>
            <input ref={fileRef} id="career-resume" name="resume" type="file" accept=".pdf,.doc,.docx" required aria-describedby="career-file-help" aria-invalid={Boolean(fileError)} onChange={event => {
              const file = event.target.files?.[0] ?? null;
              const problem = file ? resumeError(file) : '';
              setFileError(problem ?? ''); setResume(problem ? null : file);
              if (problem) event.target.value = '';
            }} />
          </div>
          <div id="career-file-help" className="career-file-help">{fileError ? <span role="alert">{fileError}</span> : 'Your resume will be included as an attachment in your application email.'}</div>
          {resume && <button className="career-remove-file" type="button" onClick={() => { setResume(null); setFileError(''); setDraft(''); if (fileRef.current) fileRef.current.value = ''; }}><X size={14} aria-hidden="true" />Remove file</button>}
        </fieldset>
        <label className="career-consent"><input type="checkbox" name="consent" required disabled={busy} /><span>I agree to share my details and resume with Accumax Controls for recruitment. <Required /></span></label>
        {error && <p className="career-error" role="alert">{error}</p>}
        <div className="career-form-footer"><button className="button" type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Preparing your email…' : 'Prepare application email'}</button></div>
        {draft && <div className="career-draft-status" role="status" ref={statusRef} tabIndex={-1}>
          <strong>Your application email is ready.</strong><p>Download the draft, open it in your email app, and review and send it to {COMPANY.emails[0]}. Your resume is attached.</p>
          <a className="site-cta" href={draft} download="Accumax-career-application.eml">Download application email</a>
        </div>}
      </form>
    </section>
  </div>;
}
