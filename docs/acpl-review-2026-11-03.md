# ACPL website review implementation

Source: `ACPL_Website_Review.xlsx`, Sheet1, rows 5–18, review dated 03 November 2026.
Smooth-scrolling review reaffirmed: the approach section has no pin, scrub or scroll progression. Its original large typography and olive background are retained, with arrow/swipe navigation and a different image for each approach. The current homepage has no pinned sections.
Latest engineering control direction: the pause/play button and automatic rotation are removed. Previous/next arrows, stage dots and horizontal swipe move between stages and the finale. Page scrolling remains unpinned.
Approach section follow-up: restored its original scroll-driven Story layout and original olive background `#22291f`, replacing the side-by-side approach selector. This applies to the approach section only; engineering stages retain their optional controls and normal page scrolling.
Latest user direction: keep the original large animated engineering typography and supplied sunset background, but remove compulsory scroll progression. The stages and finale now use arrow buttons, stage selectors and horizontal swipe; page scrolling is normal, with no engineering pin, scrub or snap. Both approach and expertise sections use the requested olive background; the enlarged expertise image card is preserved.
The workbook is treated as requested website feedback; its contents do not authorise deployment or unrelated actions.

| Review item | Change / status |
| --- | --- |
| Opening video | A 12-second silent WebM film has been generated from four existing project images, with gentle zooms and crossfades. It includes pause/play and a static reduced-motion view. Source: `src/assets/opening/acpl-opening.webm`; regenerate using `node scripts/create-opening-film.mjs`. An approved corporate film can replace this locally created montage. |
| Smooth scrolling | The home page uses approach tabs, existing expertise arrows/swipe, and a six-stage engineering selector. The former pinned engineering implementation is replaced, and expertise scroll pinning is removed. |
| Colour theme | Logo red with warm neutral surfaces replaces the blue approach background and orange expertise emphasis. Exact previously shared ACPL palette remains unprovided and must be reconciled. |
| Spacing | Approach and engineering content now occupy normal document flow. Expertise and project section padding is reduced. Existing user changes to viewport and expertise CSS are preserved. |
| Approach images | Each approach selects a distinct image and description. Tabs, arrow buttons, keyboard navigation and image swipes are supported. |
| Website content | Home and About introductions explain capabilities, coordination, testing and handover. Engineering stages include practical scope details. Existing detailed service introductions and capability lists are retained. |
| Section logo | The Expertise in Action card overlay watermark is removed. |
| Repeated images | Approach panels use distinct engineering, testing, control and solar photos. About uses a separate substation photo. The execution image-break uses GIS installation rather than repeating the industry transmission image. |
| Company tagline | Shared company data, opening copy, loader and footer use “Expedite Efficiency with Excellence”. |
| Office address | Shortened address, Google Maps directions and lazy-loaded embedded maps in footer and Contact. The map uses the existing address as a search query, so the company should confirm its exact listing/pin. |
| Cursor | Existing mouse handling remains; the dot and particle trail are visually replaced with the A symbol cropped directly from the supplied logo. Native precision-field, touch and reduced-motion behaviour is retained. |
| Social icons | Larger icons and click areas with more spacing, adjusted for narrow screens. |
| About Us | Expanded company introduction, technical capabilities and delivery responsibilities. No new certifications or numerical claims are added. |
| Industry images | Home preview enlarged, and the industry directory hover/focus image enlarged, including an in-flow mobile preview. |

## Verification

The production build passed. Four new Playwright checks passed: review interactions at 390px, 1200px and 1440px, plus reduced-motion and touch-swipe behaviour. Checks include absent pin spacers, changing approach images, keyboard stage navigation, video pause, map URL, watermark removal and horizontal overflow. Desktop screenshot inspection confirmed the approach layout and A-symbol cursor.

Existing route/image-asset and mobile navigation/overflow checks passed. The desktop services/gallery/email-enquiry check also passed after correcting ambiguous test selectors to target the contact form, its message textbox and its draft status. The final production build includes the generated opening film and passed.

The terminal intermittently reports `There is not enough space on the disk`; the PTY execution path allowed build, video generation and browser verification to proceed. A combined follow-up run stalled after starting its final mobile check; the individual mobile check had passed earlier. The full legacy suite has not been asserted to pass.

Some existing tests describe the superseded scroll-pinned engineering experience and comet cursor. Their old pin/particle expectations need revision for the reviewed behaviour.
