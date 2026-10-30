# Homepage motion

The existing homepage content, images, section order, service destinations and enquiry functionality are retained. No animation or image-generation packages were added.

| Existing component | Motion treatment |
| --- | --- |
| `Home` hero | Image mask, 1.12-to-1 image scale, four staggered headline lines, staggered CTAs, gentle image parallax. Starts after the existing logo preloader exits. |
| `Story` | Existing pinned sequence retained, with its scroll distance reduced from 1,700px to 850px. |
| `AboutBlock` | Diagonal engineering-image reveal, independent heading lines, staggered paragraphs, scroll-based image zoom-out. |
| `ExpertiseExperience` | Engineering in Motion: seven organically positioned hotspots around layered company photography, 800ms image crossfades, masked descriptions, fine-pointer tilt and active orange connectors. Tablet/mobile use a swipeable selector and next/previous controls. All seven category names and service/enquiry destinations remain intact. |
| `ProjectsSection` | Existing eight service-perspective images and destinations remain intact. Desktop sticky layering and gentle scale transitions; standard cards on smaller screens. These are not relabelled as completed projects. |
| `HomeIndustries` | Existing six homepage industries and their images. Short desktop horizontal reel, active title/number, image parallax. Tablet/mobile and reduced-motion layouts use a normal grid/vertical flow. The full Industries page keeps its existing component. |
| Existing enquiry panels | Editorial horizontal image masks, two-line title reveals and hover arrows. The homepage has no article/Insights section, so no new articles or business information were invented. |
| Existing footer contact band | Subtle orange radial expansion, staggered heading and CTA. Applied only while the homepage is mounted. |

## Behaviour and maintenance

- Advanced effects require `prefers-reduced-motion: no-preference`. Desktop pins/stacking require at least 1,100px width and 740px height. Touch devices retain native vertical scrolling.
- The Expertise console pins only at 1,200px width and 850px height, for no more than 840px of native scrolling. Its heading remains outside the pinned visual. Reduced-motion mode has immediate image switching and no tilt, floating elements or pinning.
- The industry reel's scroll distance is capped at 95% of the viewport height. It does not consume wheel/touch events. Its links remain keyboard-operable, and focusing a link brings that industry into view.
- Small magnetic button offsets apply only to fine pointers with hover support. Touch interactions use normal buttons.
- `useHomepageMotion` owns homepage GSAP contexts, media queries and listeners. It reverts them on route changes and responsive-mode changes. Lazy image loads, font readiness and opened details refresh measurements.
- Images have reserved dimensions or aspect ratios. Transforms and masks animate inside those bounds; no per-frame React state updates or continuous layout measurements are used.
- `src/motion/homepage-motion.css` loads after the existing site stylesheet and scopes section styling under `.home-page`. Existing About-page perspective scrolling is unchanged.

## Verification

Run `npm run build` and `npx playwright test`. `tests/home-motion.spec.ts` covers desktop layering/reel behaviour, keyboard access, route cleanup, reduced motion, and 320px, 390px and 768px layouts. Screenshots are written to ignored `test-results/motion-review/`.

`tests/expertise-experience.spec.ts` separately covers all seven expertise services, keyboard and pointer selection, actual touch swipes at 320px/390px/768px/1024px, reduced motion, bounded desktop pinning, image loading, layout stability and route cleanup.

The Playwright configuration uses its normal installed Chromium. For an existing system installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to that browser's executable path.
