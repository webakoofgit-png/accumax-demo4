# Careers page — 04 November 2026

Reference: https://www.accumaxcontrols.com/carrer.php. The source form collects name, education, phone, email, experience, current location, message and a resume. The new `/careers` page adds an area of interest, optional availability, clear labels, consent and file validation.

The page is linked in both the main navigation and footer. Its copy invites expressions of interest without presenting unverified vacancies or employment benefits.

## Current application flow

- Applicants complete the form and select a PDF, DOC or DOCX resume up to 2 MB.
- The form validates required fields, email, telephone, file extension, size and basic file signatures.
- It creates a local email draft with the introduction and resume attachment. The applicant downloads, reviews and sends it from their email app.
- The form explicitly states that preparation does not submit the application. Personal details are not posted, stored in browser storage or forwarded to an external application service.
- The destination is the existing company email, `info@accumaxcontrols.com`.

## Direct submission is not enabled

Automatic approval review rejected adding a Resend backend that would forward applicant details and resumes to that external provider, because that data flow had not been explicitly authorized. No rejected backend file or credentials were added. The old website's third-party form action and agency recipient were not reused.

Direct application submission requires explicit approval of the email provider/data flow and its delivery configuration. The current email draft flow is functional without those credentials.

## Checks

The production build and browser checks cover required fields, file rejection, resume attachment in the generated email, no application POST requests, layout and navigation. Test applicants use synthetic details and no email is sent.
