import { useRef, useState } from 'react';
import './form-status.css';
import { phoneError } from './phone';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
export const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '676251c3-6762-4d09-b427-b7cc24510dd7';

/** Shared by contact, service enquiries and career applications. */
export function useWeb3Form() {
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const clear = () => { setSent(false); setError(''); };

  const send = async (data: FormData, subject: string, formName: string, validate?: () => Promise<unknown>) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);clear();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const phoneProblem = phoneError(String(data.get('phone') || ''));
      if (phoneProblem) throw new Error(phoneProblem);
      await validate?.();
      data.set('access_key', WEB3FORMS_ACCESS_KEY);
      data.set('subject', `Accumax Controls | ${subject}`);
      data.set('from_name', 'Accumax Controls Website');
      data.set('replyto', String(data.get('email') || ''));
      data.set('form_name', formName);
      data.set('page_url', window.location.href);
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',headers: { Accept: 'application/json' },body: data,signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(typeof result.message === 'string' ? result.message : 'Your submission could not be sent. Please try again.');
      }
      setSent(true);
    } catch (problem) {
      setError(problem instanceof Error && problem.name === 'AbortError'
        ? 'The request timed out. Please check your connection and try again.'
        : problem instanceof TypeError ? 'Unable to connect. Please check your connection and try again.'
        : problem instanceof Error ? problem.message : 'Your submission could not be sent. Please try again.');
    } finally {
      window.clearTimeout(timeout);pending.current = false;setBusy(false);
    }
  };
  return { busy, sent, error, clear, send };
}
