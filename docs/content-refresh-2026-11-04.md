# Content refresh — 04 November 2026

Revisited the official website supplied by the user and rewrote the copy for a modern engineering audience. The tone focuses on the customer's project, concrete scope and useful next steps.

## Sources checked

- https://www.accumaxcontrols.com/ — service range, company capabilities and quality commitments.
- https://www.accumaxcontrols.com/about-us.php — engineering, maintenance, audits and product supply.
- https://www.accumaxcontrols.com/epc-projects.php — coordinated engineering, procurement, construction and applications.
- https://www.accumaxcontrols.com/scada-relay-testing.php — monitoring, control and injection/end-to-end testing.
- https://www.accumaxcontrols.com/gis-supervision.php — installation, gas handling, connections, testing and handover.
- https://www.accumaxcontrols.com/solar-ev-station.php — generation, charging, storage options and grid interfaces.
- https://www.accumaxcontrols.com/material-fabrication-civil.php — customised steel fabrication and substation civil works.
- https://www.accumaxcontrols.com/export-projects.php — reviewed; repeats generic EPC copy. Export descriptions use the Home/About product range.
- https://www.accumaxcontrols.com/trading.php — reviewed; repeats generic EPC copy. Trading descriptions use the Home/About product range.

The substation testing page timed out again. Its summary uses the accessible company overview and related service pages. Existing address, counters, mission, vision, values and project labels are preserved; earlier source gaps remain recorded in `official-content-review.md`.

## Changes

- Centralised revised copy for all eight services in `src/service-content.ts`; existing routes and images stay the same.
- Added a distinct headline, clear scope, practical explanations and applications to each service page.
- Added service-specific enquiry checklists and a link that selects the relevant service in the contact form. These checklists are editorial guidance for prospective customers, rather than additional company capabilities.
- Refreshed the Home/About profile, Why Accumax descriptions, enquiry cards, quality statements and Services introduction.
- Updated the downloadable service index to match the revised scope.
- Preserved the compact section spacing requested in the previous edits.

No guaranteed savings, commissioning outcomes, delivery times, certifications, new project records, AI/V2G capabilities or new voltage limits were introduced. Solar storage and grid options remain subject to the site's requirements.

## Validation

- `npm run build` passed.
- Both service enquiry tests passed using installed Chrome: all eight service pages at 390px and 1440px, horizontal overflow checks, and service selection after following the new contact links.
- The existing all-routes smoke test passed, covering public pages, service pages, project details, referenced images and runtime errors.
- Playwright's bundled browser was absent, so the checks used the existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE` configuration with locally installed Chrome.
