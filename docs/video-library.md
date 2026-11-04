# Company video library

Source page supplied by the user: https://www.accumaxcontrols.com/videos.php.

The page embeds five MP4 files, which are now used in the Gallery's Videos filter and on `/videos`:

- https://www.accumaxcontrols.com/1.mp4
- https://www.accumaxcontrols.com/2.mp4
- https://www.accumaxcontrols.com/3.mp4
- https://www.accumaxcontrols.com/4.mp4
- https://www.accumaxcontrols.com/5.mp4

All five URLs returned HTTP 200 with `video/mp4` and byte-range support. Decoded dimensions are 668 × 1080. Local preview images are extracted from each clip by `scripts/create-gallery-video-posters.mjs`. The original video files remain hosted on the source website; only the small preview images are stored in this repository.

Players use native controls, inline playback and `preload="none"`. Starting one clip pauses the others. A direct source link is offered if a player encounters an error. The homepage banner video remains separate.

Checks confirmed all five players, no video requests before playback, successful playback of two originals, pause behavior, the standalone Videos page, and mobile horizontal overflow.
