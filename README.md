# latokoserofilms.com

Static site for Latokosero Films, served by GitHub Pages from the repository
root. No framework, no dependencies, no CI — `node build.js` writes the HTML
that ships.

## Build

```sh
node build.js
```

Requires Node (any current version). It writes:

```
index.html                 homepage
work/index.html            full archive, filterable
commercials/index.html     ┐
music-videos/index.html    │
short-films/index.html     ├ service pages, one shared template
event-coverage/index.html  │
ai-video/index.html        ┘
brief/index.html           brief form
thanks/index.html          confirmation page for the no-JS form path
404.html                   GitHub Pages serves this on any unmatched path
portfolio.html             redirect stub → /work/
sitemap.xml, robots.txt
```

Commit the generated files — Pages serves them directly.

## Where the copy lives

**Edit `content/`, never the generated HTML.** Anything you change in a built
`.html` file is overwritten on the next build.

- `content/site.js` — brand, contact details, navigation, the client list, and
  the work archive.
- `content/services.js` — all five service pages.

Every service page renders the same six blocks: H1 and definition, what's
included, process, featured work, what it costs, FAQ. Don't add a block to one
page without adding it to all five. The FAQ copy generates the `FAQPage` schema
from the same source, so the markup can't drift from what's on screen.

Design and behaviour live in `css/site.css` and `js/site.js`.

## Open before launch

1. **Connect the brief form.** `FORM_ENDPOINT` at the top of `js/site.js` is
   empty; until it's set, the form validates and then tells people to email
   instead. Whatever you point it at has to store the brief, notify the team,
   and send an autoresponder confirming the two-working-day promise.
   Deliberately not a `mailto:` — those lose briefs on phones and can't
   autorespond. Put the same URL in the form's `action=` (see the comment
   above the form in `build.js`) so the form still works with JS disabled,
   landing on `/thanks/`.
2. **Confirm the budget bands.** The four NPR bands in `build.js` are a
   starting point, not agreed pricing. The field exists to filter enquiries, so
   the boundaries have to be ones that actually split your inbox.
3. **Add the AI proof images.** See `assets/README.md`. The homepage AI section
   is the weakest thing on the site until a real before/after is in it.
4. **Fill the archive.** Five of eight entries in `content/site.js` have no
   YouTube ID; every entry is missing a year, and `VideoObject` schema needs a
   real `uploadDate` to earn rich results. Short films and event coverage have
   no entries at all and currently show a note instead of a featured row.
5. **Finish the redirect map.** `portfolio.html` already points at `/work/`.
   Add a `write(...)` line in `build.js` for every other legacy path, using the
   current index as the source of truth. Note that GitHub Pages cannot issue a
   real 301 — the stubs use `rel=canonical` plus a meta refresh, which
   consolidates the ranking signal and moves the visitor immediately. The
   portfolio URLs on `adigroup.com.np` are on a different host and can't be
   redirected from this repository; they need a server-side 301 configured
   wherever that domain is hosted.
6. **Real contact details.** `site.email`, `phone`, `street` and the social
   handles in `content/site.js` are placeholders and feed the `LocalBusiness`
   schema.

## House style

Confident and specific. Name clients and numbers. At least one verifiable fact
per section — a client name, a runtime, a turnaround, a piece of kit.

These words don't appear on this site, and shouldn't be reintroduced:

> cutting-edge · unparalleled · elevate your vision · seize the spotlight ·
> passion for storytelling · bring your vision to life · we don't just make
> videos · state-of-the-art · one-stop solution · think outside the box ·
> industry-leading

Replace each with a fact.
