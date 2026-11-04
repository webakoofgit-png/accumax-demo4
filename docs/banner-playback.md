# Banner playback — 04 November 2026

The reported live URL is https://accumax-demo4-apfi.vercel.app/.

The deployed MP4 returned valid HTTP 206 responses and played automatically in the Chrome inspection. The reported failure was not reproduced in that browser. However, the original 12-second video was 16,415,961 bytes, and its MP4 playback metadata followed the entire media payload. Live playback required additional end-of-file range requests before decoding could begin.

The banner now uses `home-banner-web.mp4`, a silent H.264 MP4 at 1440 × 600, generated from the original footage. It is 2,016,714 bytes, about 88% smaller. Its initialization metadata precedes the media fragments, allowing decoding without seeking to the end of the asset. The supplied original is retained.

Regenerate with `node scripts/optimize-banner-video.mjs` using installed Chrome or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

Validation: production build passed; the built preview played automatically without interaction at desktop and mobile sizes, including reduced-motion mode and a desktop check limited to 256 KiB/s with 100 ms latency. Checks confirmed that playback time advanced and the optimized asset was selected. Browser, device and data-saving policies can still restrict autoplay independently of the site's attributes.
