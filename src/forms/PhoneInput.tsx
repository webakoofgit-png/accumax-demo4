import { useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { phoneError } from './phone';

export function PhoneInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const errorId = useId();
  const touched = useRef(false);
  const [error, setError] = useState('');
  return <>
    <input {...props} name="phone" type="tel" inputMode="tel" autoComplete="tel" required
      minLength={undefined} maxLength={25} pattern={undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={[props['aria-describedby'], error ? errorId : ''].filter(Boolean).join(' ') || undefined}
      onChange={event => {
        const message = phoneError(event.currentTarget.value);
        event.currentTarget.setCustomValidity(message);
        if (touched.current) setError(message);
        props.onChange?.(event);
      }}
      onBlur={event => {
        touched.current = true;
        const message = phoneError(event.currentTarget.value);
        event.currentTarget.setCustomValidity(message);setError(message);
        props.onBlur?.(event);
      }}
      onInvalid={event => {
        touched.current = true;
        const message = phoneError(event.currentTarget.value);
        event.currentTarget.setCustomValidity(message);setError(message);
        props.onInvalid?.(event);
      }} />
    {error && <span id={errorId} className="phone-field-error" role="alert">{error}</span>}
  </>;
}
