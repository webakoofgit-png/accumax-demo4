# Demo 4 — Industrial Motion Studio

Independent React + Vite project. The original demo is untouched.

## Run

    # Run these commands from the repository root
    npm install
    npm run dev

## Build

    npm run build
    npm run preview

Deploy the `dist` directory on a static host with SPA fallback to `index.html`. A Vercel rewrite and Netlify `_redirects` are included.

## Content and launch review

- Logo, company photographs and client logo archive copied from the existing workspace. Company scope, industry names and contact information checked against https://www.accumaxcontrols.com/ on 28 October 2026.
- No numerical achievements, certifications or awards are asserted.
- Project profiles are explicitly illustrative, with client and location awaiting verification.
- Process stages and detailed service scope require company approval before public launch.
- Videos have an honest unpublished state; no fake play control. Supply authorised MP4s to publish films.
- Catalogue download is a clearly labelled text overview; request the official catalogue by email.
- Contact and careers prepare a mailto draft. Nothing is stored or submitted. Configure a real delivery service separately if server-side submission is required.
- Original website image reuse and client logo permissions should be confirmed for public publication.
- The three previous demo URLs were inaccessible to the research tool, so visual differentiation against them could not be independently checked.

## SEO and redirects

Demo defaults to noindex, avoiding a false production canonical. Set VITE_SITE_URL to the final HTTPS origin before production. Run `npm run build` to generate sitemap.xml and robots.txt for that origin. Demo sitemap is omitted until an origin is configured.

Before replacing an existing website, inventory its actual URLs and approve a redirect mapping to /about, /services/:slug, /industries, /projects, /quality-safety, /gallery, /videos, /catalogue, /careers and /contact. Do not redirect unknown pages indiscriminately. No old-domain redirects have been activated.

## Motion and accessibility

GSAP desktop-only pinned narrative and project movement, native mobile project swipe, reduced-motion fallbacks, keyboard-accessible service links, mobile-menu focus containment, labelled fields and a skip link.

## Verification completed

- `npm run build`: passed (TypeScript and production bundle).
- `npx playwright test`: 3 passed. Covers all 25 routes and referenced image responses, desktop service navigation, gallery filtering/lightbox, email draft generation, mobile navigation and accordion, reduced-motion layout and mobile horizontal overflow.
- Screenshots: tests/home-desktop.png and tests/home-mobile.png.
- Browser checks run in installed local Chromium. No public deployment created.

