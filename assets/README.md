# assets/

Image and video files referenced by the site.

## Needed before launch

| File | Used by | Notes |
|---|---|---|
| `ai-before.jpg` | Homepage AI section | The plate as shot on location. |
| `ai-after.jpg` | Homepage AI section | The same shot after comp and grade. Must be the same dimensions as `ai-before.jpg`. |

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
