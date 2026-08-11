# assets/

Image and video files referenced by the site.

## Needed before launch

| File | Used by | Notes |
|---|---|---|
| `logo.svg` | Footer | The full lockup — owl mark plus the LATOKOSERO / FILMS wordmark. |
| `logo-mark.svg` | Masthead, hero, empty states | The owl mark on its own, no type. Should read at 24px. |
| `ai-before.jpg` | Homepage AI section | The plate as shot on location. |
| `ai-after.jpg` | Homepage AI section | The same shot after comp and grade. Must be the same dimensions as `ai-before.jpg`. |

### The logo

**Neither logo file is in this repository yet.** Every placement is already
wired to these two paths, so dropping the files in switches all of them on at
once — no code change, no rebuild needed for the CSS/JS side (though
`node build.js` is still needed if you change any copy).

Where the mark ends up:

- **Masthead** — the mark sits left of the wordmark at 2rem.
- **Footer** — the full lockup replaces the text wordmark at 3rem.
- **Hero** — the mark again at up to 620px, at 6% opacity behind the
  headline. The eyes in the logo are drawn as apertures, which is worth
  seeing at size; held right back so it reads as texture rather than a
  sticker.
- **Empty states** — playlist rows and the player panel for projects with no
  video yet show the mark instead of a blank grey box.

Until the files exist, each slot falls back: the masthead and footer show the
text wordmark, and the hero watermark removes itself. Nothing renders broken.

SVG is strongly preferred — the mark is used from 24px to 620px, and the hero
placement is desaturated and brightened in CSS, which needs clean vector edges.
A transparent-background PNG at 2x works but will soften at the hero size.

Until both exist, the before/after slider renders a labelled placeholder saying
what's missing rather than an empty frame. The AI section does not work without
these two files — one real before/after is worth more than the whole page of
copy around it.

## Optional per project

Set on entries in `content/site.js`:

- `poster` — a 16:9 still for the work tile.
- `loop` — a 3-second muted MP4, 16:9, no audio track. Plays on tile hover and
  is `preload="none"`, so it costs nothing until someone hovers. Keep these
  under ~1 MB each.

Tiles with neither fall back to a typographic card, so nothing breaks while
these are being cut.
