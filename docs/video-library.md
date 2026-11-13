# Company video library

Source page supplied by the user: https://www.accumaxcontrols.com/videos.php.

The page embeds five original MP4 files:

- https://www.accumaxcontrols.com/1.mp4
- https://www.accumaxcontrols.com/2.mp4
- https://www.accumaxcontrols.com/3.mp4
- https://www.accumaxcontrols.com/4.mp4
- https://www.accumaxcontrols.com/5.mp4

The original videos have portrait dimensions of 668 × 1080 and run approximately 193, 144, 253, 59 and 67 seconds. The Gallery's Videos filter and `/videos` now use local 40-second excerpts at `public/videos/clips/accumax-01.mp4` through `accumax-05.mp4`. Each excerpt uses the first 40 seconds of its corresponding original, copied without re-encoding and packaged with the MP4 metadata at the beginning for playback. The original portrait framing and audio are preserved.

Local preview images are extracted from the original clips by `scripts/create-gallery-video-posters.mjs`. Players display the complete portrait frame without cropping, in three columns on desktop, two on tablets and one on phones.

Players use native controls, inline playback and `preload="none"`. Starting one clip pauses the others. A direct source link is offered if a player encounters an error. The homepage banner video remains separate.

Checks confirmed all five players, no video requests before playback, successful playback of two originals, pause behavior, the standalone Videos page, and mobile horizontal overflow.
