export const CAREER_AREAS = [
  'Engineering & Design', 'EPC & Site Execution', 'Testing & Commissioning',
  'SCADA & Protection', 'Solar & EV Infrastructure', 'Operations & Maintenance',
  'Procurement & Exports', 'Other',
];
export const CAREER_EXPERIENCE = ['Fresher', 'Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];
export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

export type CareerApplication = {
  name: string; email: string; phone: string; city: string; education: string;
  interest: string; experience: string; notice: string; message: string;
};

export function resumeError(file: File): string | null {
  if (!/\.(pdf|doc|docx)$/i.test(file.name)) return 'Choose a PDF, DOC or DOCX file.';
  if (file.size === 0) return 'This file is empty. Please choose your resume.';
  if (file.size > MAX_RESUME_BYTES) return 'Your resume must be 2 MB or smaller.';
  return null;
}

function base64(bytes: Uint8Array): string {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 8192) binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  return btoa(binary);
}

function encodedHeader(text: string): string {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let chunk = '';
  for (const character of text.replace(/[\r\n]/g, ' ')) {
    if (encoder.encode(chunk + character).length > 36) { chunks.push(chunk); chunk = ''; }
    chunk += character;
  }
  if (chunk) chunks.push(chunk);
  return chunks.map(value => `=?UTF-8?B?${base64(encoder.encode(value))}?=`).join('\r\n ');
}

const wrap = (value: string) => value.match(/.{1,76}/g)?.join('\r\n') ?? '';

/** Creates a local, reviewable email draft with the resume attached; sends no data. */
export async function applicationEmail(data: CareerApplication, resume: File, recipient: string): Promise<Blob> {
  const error = resumeError(resume);
  if (error) throw new Error(error);
  const bytes = new Uint8Array(await resume.arrayBuffer());
  const extension = resume.name.split('.').pop()!.toLowerCase();
  const startsWith = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  const valid = extension === 'pdf' ? startsWith(0x25, 0x50, 0x44, 0x46, 0x2d)
    : extension === 'doc' ? startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1)
    : startsWith(0x50, 0x4b, 0x03, 0x04);
  if (!valid) throw new Error('This file does not match its format. Please choose a valid PDF, DOC or DOCX resume.');
  const boundary = `accumax-career-${crypto.randomUUID()}`;
  const filename = resume.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const type = extension === 'pdf' ? 'application/pdf' : extension === 'doc' ? 'application/msword' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const body = [
    'CAREER APPLICATION — ACCUMAX CONTROLS', '',
    `Full name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
    `Current location: ${data.city}`, `Education: ${data.education}`,
    `Area of interest: ${data.interest}`, `Experience: ${data.experience}`,
    `Availability / notice period: ${data.notice || 'Not specified'}`,
    '', 'Introduction:', data.message, '', 'Applicant consent: confirmed.',
  ].join('\n');
  const email = [
    'X-Unsent: 1', `To: ${recipient.replace(/[\r\n]/g, '')}`,
    `Subject: ${encodedHeader(`Career application — ${data.interest} — ${data.name}`)}`,
    'MIME-Version: 1.0', `Content-Type: multipart/mixed; boundary="${boundary}"`, '',
    `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '',
    wrap(base64(new TextEncoder().encode(body))), '',
    `--${boundary}`, `Content-Type: ${type}`,
    `Content-Disposition: attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(resume.name)}`,
    'Content-Transfer-Encoding: base64', '', wrap(base64(bytes)), '', `--${boundary}--`, '',
  ].join('\r\n');
  return new Blob([email], { type: 'message/rfc822' });
}
