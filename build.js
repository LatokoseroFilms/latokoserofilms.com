#!/usr/bin/env node
/*
 * Static site builder for latokoserofilms.com.
 *
 * No dependencies. Run `node build.js` and it writes the HTML that GitHub
 * Pages serves. Copy lives in content/ — edit there, not in the generated
 * HTML, or your changes are overwritten on the next build.
 */

const fs = require('fs');
const path = require('path');

const { site, work } = require('./content/site');
const { services } = require('./content/services');

const OUT = __dirname;

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const bySlug = Object.fromEntries(work.map((w) => [w.slug, w]));
const service = Object.fromEntries(services.map((s) => [s.slug, s]));

function write(relPath, contents) {
  const full = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents.trimStart() + '\n');
  console.log('  ' + relPath);
}

function jsonld(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}

/* ------------------------------------------------------------------ layout */

function layout({ title, description, canonical, schema = [], body, bodyClass = '', noindex = false }) {
  const nav = site.nav
    .map((n) => {
      const current = n.href === canonical;
      return `<li><a href="${n.href}"${current ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`;
    })
    .join('\n            ');

  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.domain}${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${site.domain}${canonical}">
<meta property="og:image" content="${site.domain}/cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0d0f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Radley:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${schema.map(jsonld).join('\n')}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>

<a class="skip" href="#main">Skip to content</a>

<header class="masthead">
  <div class="wrap masthead-inner">
    <a class="wordmark logo-slot" href="/" data-logo-slot>
      <img class="logo-mark" src="/assets/logo-mark.svg" alt="Latokosero Films" data-logo width="32" height="32">
      <span class="logo-fallback">Latokosero <span>Films</span></span>
    </a>
    <nav aria-label="Primary">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span class="nav-toggle-bar"></span>
        <span class="sr-only">Menu</span>
      </button>
      <ul id="primary-nav">
            ${nav}
        <li class="nav-cta"><a href="/brief/">Start a brief</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="footer">
  <div class="wrap footer-inner">
    <div class="footer-brand logo-slot" data-logo-slot>
      <img class="logo-mark" src="/assets/logo.svg" alt="Latokosero Films" data-logo width="180" height="48">
      <p class="footer-mark logo-fallback">Latokosero Films</p>
      <p class="muted">Commercials, music videos and short films — written, shot, and finished in-house in ${esc(site.city)}.</p>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <h2>Services</h2>
      <ul>
        ${services.map((s) => `<li><a href="/${s.slug}/">${esc(s.nav)}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <nav class="footer-nav" aria-label="More">
      <h2>Studio</h2>
      <ul>
        <li><a href="/work/">Work</a></li>
        <li><a href="/brief/">Start a brief</a></li>
        <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
      </ul>
    </nav>
  </div>
  <div class="wrap footer-legal">
    <p class="muted">© ${new Date().getFullYear()} Latokosero Films. ${esc(site.city)}, ${esc(site.country)}.</p>
  </div>
</footer>

<script src="/js/site.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------- work tiles */

function tile(item) {
  const meta = [item.client, item.category, item.year].filter(Boolean).map(esc).join(' · ');
  const media = item.loop
    ? `<video class="tile-loop" src="${item.loop}" ${item.poster ? `poster="${item.poster}"` : ''} muted loop playsinline preload="none"></video>`
    : item.poster
      ? `<img class="tile-still" src="${item.poster}" alt="" loading="lazy">`
      : `<span class="tile-fallback" aria-hidden="true">${esc(item.title)}</span>`;

  // Every archive entry has a row in the work playlist, so tiles can deep
  // link by slug whether or not the video ID is filled in yet.
  const href = `/work/#${item.slug}`;

  return `
      <a class="tile" href="${href}">
        <span class="tile-media">${media}</span>
        <span class="tile-body">
          <span class="tile-title">${esc(item.title)}</span>
          ${meta ? `<span class="tile-meta">${meta}</span>` : ''}
        </span>
      </a>`;
}

/* --------------------------------------------------------------- homepage */

function homepage() {
  const featured = work.filter((w) => w.featured).slice(0, 6);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': site.domain + '/#business',
    name: site.name,
    description:
      'Commercials, music videos and short films for Nepal’s brands and artists. Full pre-production, production and post under one roof.',
    url: site.domain,
    email: site.email,
    image: site.domain + '/cover.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressCountry: 'NP'
    },
    areaServed: site.country,
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.h1, url: `${site.domain}/${s.slug}/` }
    }))
  };

  const body = `
<section class="hero">
  <!-- The mark's eyes are drawn as apertures. Worth seeing at size, held
       right back so it reads as texture behind the headline, not a sticker
       on top of it. Removed by site.js if the file isn't there. -->
  <img class="hero-watermark" src="/assets/logo-mark.svg" alt="" aria-hidden="true" data-logo>
  <div class="wrap">
    <h1>We make the films Nepal’s brands and artists are remembered for.</h1>
    <p class="lede">Commercials, music videos and short films — written, shot, and finished in-house in Kathmandu.</p>
    <p class="actions">
      <a class="btn btn-primary" href="/work/">See the work</a>
      <a class="btn" href="/brief/">Start a brief</a>
    </p>
  </div>
</section>

<section class="trust">
  <div class="wrap">
    <h2 class="eyebrow">Trusted by</h2>
    <ul class="client-list">
      ${site.clients.map((c) => `<li>${esc(c.name)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section" id="selected-work">
  <div class="wrap">
    <div class="section-head">
      <h2>Selected work</h2>
      <p class="muted">Six recent projects. The full archive is in <a href="/work/">Work</a>.</p>
    </div>
    <div class="tiles">${featured.map(tile).join('')}
    </div>
  </div>
</section>

<section class="section section-alt" id="what-we-do">
  <div class="wrap">
    <div class="section-head"><h2>What we do</h2></div>
    <div class="cards">
      ${services
        .map(
          (s) => `<a class="card" href="/${s.slug}/">
        <h3>${esc(s.nav)}</h3>
        <p>${esc(s.card)}</p>
        <span class="card-go" aria-hidden="true">→</span>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section class="section wedge" id="ai">
  <div class="wrap wedge-inner">
    <div class="wedge-copy">
      <h2>The shots that used to be out of budget</h2>
      <p>A crowd scene, a set extension, a de-aged actor, a location you can’t fly to — these used to mean a bigger budget or a cut scene. We build generative shots into a normal production pipeline, then grade and finish them by hand so they sit inside the edit instead of standing out from it.</p>
      <p>A colorist and an editor touch every frame. Nothing ships that we can’t explain shot by shot.</p>
      <p><a class="arrow-link" href="/ai-video/#pipeline">How our AI pipeline works</a></p>
    </div>

    <!--
      Proof image. This section does not work without it: drop the plate at
      assets/ai-before.jpg and the finished shot at assets/ai-after.jpg, both
      the same dimensions, and the slider below shows the real comparison.
      Until then it renders a labelled placeholder rather than a broken image.
    -->
    <figure class="compare" data-compare>
      <div class="compare-frame">
        <!-- Not lazy-loaded: a lazy image that never enters the viewport
             stays incomplete forever, so the missing-asset check below it
             could never resolve. Two images is a fair price for that. -->
        <img class="compare-after" src="/assets/ai-after.jpg" alt="Finished shot after compositing and grade" decoding="async" fetchpriority="low">
        <div class="compare-before-clip" style="--split:50%">
          <img class="compare-before" src="/assets/ai-before.jpg" alt="The plate as shot on location" decoding="async" fetchpriority="low">
        </div>
        <input class="compare-range" type="range" min="0" max="100" value="50" aria-label="Reveal the plate as shot">
        <span class="compare-tag compare-tag-before">Plate</span>
        <span class="compare-tag compare-tag-after">Final</span>
        <p class="compare-missing">Before / after slider — add <code>assets/ai-before.jpg</code> and <code>assets/ai-after.jpg</code>.</p>
      </div>
      <figcaption class="muted">The plate as shot, and the finished shot after comp and grade.</figcaption>
    </figure>
  </div>
</section>

<section class="section section-alt" id="how-we-work">
  <div class="wrap">
    <div class="section-head"><h2>How we work</h2></div>
    <ol class="steps">
      <li><h3>Brief</h3><p>We agree the idea, the budget and the deliverables before anything is written.</p></li>
      <li><h3>Previz</h3><p>Boards, a shot list, and where relevant an animatic, so you approve the film before we shoot it.</p></li>
      <li><h3>Shoot</h3><p>Our crew and kit, or yours. One producer owns the day.</p></li>
      <li><h3>Post</h3><p>Edit, FX, grade and sound under one roof. Two rounds of revisions are standard.</p></li>
    </ol>
  </div>
</section>

<section class="section convert">
  <div class="wrap">
    <h2>Tell us what you’re making</h2>
    <p class="lede">Send a brief and you’ll hear back within two working days — with a realistic budget range, not a placeholder.</p>
    <p class="actions"><a class="btn btn-primary" href="/brief/">Start a brief</a></p>
  </div>
</section>`;

  return layout({
    title: 'Latokosero Films — commercial and music video production, Kathmandu',
    description:
      'Commercials, music videos and short films for Nepal’s brands and artists. Full pre-production, production and post under one roof.',
    canonical: '/',
    schema: [schema],
    body,
    bodyClass: 'page-home'
  });
}

/* ---------------------------------------------------------- service pages */

function servicePage(s) {
  const featured = s.featured.map((slug) => bySlug[slug]).filter(Boolean);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.h1,
    description: s.definition,
    url: `${site.domain}/${s.slug}/`,
    serviceType: s.h1,
    provider: { '@type': 'LocalBusiness', '@id': site.domain + '/#business', name: site.name },
    areaServed: { '@type': 'Country', name: site.country }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  // Block 2 and 3 differ on the AI page — it argues fit before process,
  // because "where it doesn't help" is the most useful thing on the page.
  const middle = s.slug === 'ai-video'
    ? `
<section class="section">
  <div class="wrap narrow">
    <h2>Where it actually helps</h2>
    <dl class="deflist">
      ${s.helps.map((h) => `<dt>${esc(h.name)}</dt><dd>${esc(h.body)}</dd>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap narrow">
    <h2>Where it doesn’t</h2>
    <p class="lede">${esc(s.doesnt)}</p>
  </div>
</section>

<section class="section" id="pipeline">
  <div class="wrap narrow">
    <h2>Our pipeline</h2>
    <ol class="steps steps-numbered">
      ${s.pipeline.map((p) => `<li><h3>${esc(p.name)}</h3><p>${esc(p.body)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="section section-alt" id="rights">
  <div class="wrap narrow">
    <h2>Rights and disclosure</h2>
    <ul class="checklist">
      ${s.rights.map((r) => `<li>${esc(r)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`
    : `
<section class="section">
  <div class="wrap narrow">
    <h2>What’s included</h2>
    <ul class="checklist">
      ${s.included.map((i) => `<li>${esc(i)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap narrow">
    <h2>Process</h2>
    <ol class="steps steps-numbered">
      ${s.process.map((p) => `<li><h3>${esc(p.name)}</h3><p>${esc(p.body)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

  const body = `
<section class="page-head">
  <div class="wrap narrow">
    <h1>${esc(s.h1)}</h1>
    <p class="lede">${esc(s.definition)}</p>
  </div>
</section>
${middle}

<section class="section">
  <div class="wrap">
    <div class="section-head"><h2>Featured work</h2></div>
    ${
      featured.length
        ? `<div class="tiles">${featured.map(tile).join('')}\n    </div>`
        : `<p class="muted narrow-p">${esc(s.featuredNote)}</p>`
    }
  </div>
</section>

<section class="section section-alt">
  <div class="wrap narrow">
    <h2>What it costs</h2>
    <p class="lede">${esc(s.cost)}</p>
    <p><a class="arrow-link" href="/brief/">Send a brief and get a band</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <h2>Questions</h2>
    <div class="faq">
      ${s.faq
        .map(
          (f) => `<details>
        <summary>${esc(f.q)}</summary>
        <p>${esc(f.a)}</p>
      </details>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section class="section convert">
  <div class="wrap">
    <h2>Tell us what you’re making</h2>
    <p class="lede">Send a brief and you’ll hear back within two working days — with a realistic budget range, not a placeholder.</p>
    <p class="actions"><a class="btn btn-primary" href="/brief/">Start a brief</a></p>
  </div>
</section>`;

  return layout({
    title: s.title,
    description: s.description,
    canonical: `/${s.slug}/`,
    schema: [serviceSchema, faqSchema],
    body,
    bodyClass: 'page-service'
  });
}

/* -------------------------------------------------------------- work page */

function workPage() {
  const categories = [...new Set(work.map((w) => w.category))];

  const videoSchema = work
    .filter((w) => w.youtube)
    .map((w) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: w.title,
      description:
        w.blurb || `${w.category.replace(/s$/, '')} by ${site.name}${w.client ? ` for ${w.client}` : ''}.`,
      thumbnailUrl: `https://i.ytimg.com/vi/${w.youtube}/maxresdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${w.youtube}`,
      contentUrl: `https://www.youtube.com/watch?v=${w.youtube}`,
      // TODO(fill): uploadDate is required for rich results. Add `year` in
      // content/site.js with a real release date and wire it in here.
      publisher: { '@type': 'Organization', name: site.name, url: site.domain }
    }));

  const meta = (w) => [w.client, w.category, w.year].filter(Boolean).map(esc).join(' · ');

  // The first entry with a video is what the player holds on load. If the
  // archive ever has none, the player renders its empty state instead.
  const first = work.find((w) => w.youtube) || work[0];

  /*
   * Playlist rows.
   *
   * Entries with a video are anchors pointing at the real YouTube URL, so
   * the list still works with JS off and the links mean something to a
   * crawler. Entries without one have nowhere to go, so they're buttons.
   * site.js intercepts both and swaps the player in place.
   */
  const row = (w) => {
    const isCurrent = w.slug === first.slug;
    const thumb = w.youtube
      ? `<img src="https://i.ytimg.com/vi/${w.youtube}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180">`
      : `<span class="pl-thumb-empty"><img class="logo-mark" src="/assets/logo-mark.svg" alt="" data-logo width="24" height="24">Soon</span>`;

    const attrs = [
      `class="pl-item"`,
      `id="${w.slug}"`,
      `data-slug="${w.slug}"`,
      w.youtube ? `data-youtube="${w.youtube}"` : '',
      `data-title="${esc(w.title)}"`,
      w.titleNe ? `data-title-ne="${esc(w.titleNe)}"` : '',
      `data-meta="${meta(w)}"`,
      w.blurb ? `data-blurb="${esc(w.blurb)}"` : '',
      isCurrent ? `aria-current="true"` : ''
    ]
      .filter(Boolean)
      .join(' ');

    const inner = `
            <span class="pl-thumb">${thumb}</span>
            <span class="pl-text">
              <span class="pl-title">${esc(w.title)}</span>
              <span class="pl-meta">${[w.client, w.year].filter(Boolean).map(esc).join(' · ') || esc(w.category)}</span>
            </span>`;

    return w.youtube
      ? `<li><a ${attrs} href="https://www.youtube.com/watch?v=${w.youtube}">${inner}
          </a></li>`
      : `<li><button type="button" ${attrs}>${inner}
          </button></li>`;
  };

  const playlist = categories
    .map(
      (c) => `
      <div class="playlist-group">
        <h3 class="playlist-heading" id="group-${c.toLowerCase().replace(/\s+/g, '-')}">${esc(c)}</h3>
        <ul aria-labelledby="group-${c.toLowerCase().replace(/\s+/g, '-')}">
          ${work.filter((w) => w.category === c).map(row).join('\n          ')}
        </ul>
      </div>`
    )
    .join('');

  const body = `
<section class="page-head">
  <div class="wrap narrow">
    <h1>Work</h1>
    <p class="lede">Commercials, music videos and short films made in Kathmandu. Pick anything from the list — it plays here.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="theatre">
      <div class="theatre-player">
        <div class="embed" id="player-frame">
          ${
            first.youtube
              ? `<iframe id="player" src="https://www.youtube-nocookie.com/embed/${first.youtube}" title="${esc(first.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              : `<div class="embed-empty"><img class="logo-mark" src="/assets/logo-mark.svg" alt="" data-logo width="36" height="36"><p>Links on request — email us and we’ll send them over.</p></div>`
          }
        </div>
        <div class="now-playing" aria-live="polite">
          <h2 id="np-title">${esc(first.title)}${first.titleNe ? ` <span class="entry-alt">${esc(first.titleNe)}</span>` : ''}</h2>
          <p class="entry-meta" id="np-meta">${meta(first)}</p>
          <p id="np-blurb"${first.blurb ? '' : ' hidden'}>${first.blurb ? esc(first.blurb) : ''}</p>
        </div>
      </div>

      <nav class="theatre-list" aria-label="Work archive">${playlist}
      </nav>
    </div>
  </div>
</section>

<!--
  Expanded viewer. Selecting anything from the playlist opens this and the
  page stays in this mode — prev/next walk the whole archive — until it's
  closed. site.js moves it to the end of <body> on load so the rest of the
  page can be made inert while it's open. Hidden and inert to start, so with
  JS off it never appears and the playlist links go to YouTube instead.
-->
<div class="lightbox" id="lightbox" hidden>
  <div class="lightbox-scrim" data-close></div>
  <div class="lightbox-panel" role="dialog" aria-modal="true" aria-labelledby="lb-title">
    <button class="lightbox-close" type="button" data-close aria-label="Close viewer">&times;</button>

    <div class="lightbox-stage">
      <div class="embed" id="lb-frame"></div>
    </div>

    <div class="lightbox-info">
      <div class="lightbox-text">
        <h2 id="lb-title"></h2>
        <p class="entry-meta" id="lb-meta"></p>
        <p id="lb-blurb"></p>
      </div>
      <div class="lightbox-nav">
        <button class="btn lightbox-step" type="button" id="lb-prev">
          <span aria-hidden="true">←</span> Previous
        </button>
        <p class="lightbox-count" id="lb-count" aria-live="polite"></p>
        <button class="btn lightbox-step" type="button" id="lb-next">
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </div>
</div>

<section class="section convert">
  <div class="wrap">
    <h2>Tell us what you’re making</h2>
    <p class="lede">Send a brief and you’ll hear back within two working days — with a realistic budget range, not a placeholder.</p>
    <p class="actions"><a class="btn btn-primary" href="/brief/">Start a brief</a></p>
  </div>
</section>`;

  return layout({
    title: 'Work — Latokosero Films',
    description:
      'Commercials, music videos and short films by Latokosero Films, made in Kathmandu for Nepali brands, artists and labels.',
    canonical: '/work/',
    schema: videoSchema,
    body,
    bodyClass: 'page-work'
  });
}

/* ------------------------------------------------------------- brief form */

function briefPage() {
  const projectTypes = [
    'Commercial',
    'Music video',
    'Short film',
    'Event',
    'AI video',
    'Not sure'
  ];

  // TODO(confirm): these bands are a starting point, not agreed pricing.
  // Set them to whatever actually splits your enquiries usefully — the point
  // of the field is to filter briefs, so the boundaries have to be real.
  const budgets = [
    'Under NPR 3 lakh',
    'NPR 3–10 lakh',
    'NPR 10–25 lakh',
    'NPR 25 lakh+',
    'Not sure yet'
  ];

  const timelines = ['Under 2 weeks', '2–4 weeks', '1–3 months', 'Flexible'];

  const option = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;

  const body = `
<section class="page-head">
  <div class="wrap narrow">
    <h1>Start a brief</h1>
    <p class="lede">Send this and you’ll hear back within two working days — with a realistic budget range, not a placeholder.</p>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <!--
      When you set FORM_ENDPOINT in js/site.js, put the same URL in this
      form's action= too. JS submits via fetch and swaps in the confirmation
      below; the action is what makes the form still work with JS disabled,
      posting normally and landing on /thanks/ via the _next field.
    -->
    <form class="brief" id="brief-form" method="post" action="" novalidate>
      <input type="hidden" name="_next" value="${site.domain}/thanks/">

      <div class="field">
        <label for="name">Name <span class="req">required</span></label>
        <input type="text" id="name" name="name" autocomplete="name" required>
      </div>

      <div class="field">
        <label for="organisation">Organisation</label>
        <input type="text" id="organisation" name="organisation" autocomplete="organization">
      </div>

      <div class="field">
        <label for="email">Email <span class="req">required</span></label>
        <input type="email" id="email" name="email" autocomplete="email" required>
      </div>

      <div class="field">
        <label for="phone">Phone / WhatsApp</label>
        <input type="tel" id="phone" name="phone" autocomplete="tel">
      </div>

      <div class="field">
        <label for="project_type">Project type</label>
        <select id="project_type" name="project_type">
          <option value="">Choose one</option>
          ${projectTypes.map(option).join('\n          ')}
        </select>
      </div>

      <div class="field">
        <label for="budget">Budget band <span class="req">required</span></label>
        <select id="budget" name="budget" required>
          <option value="">Choose one</option>
          ${budgets.map(option).join('\n          ')}
        </select>
        <p class="hint">A band is enough. It tells us what’s achievable before we waste your time.</p>
      </div>

      <div class="field">
        <label for="timeline">Timeline</label>
        <select id="timeline" name="timeline">
          <option value="">Choose one</option>
          ${timelines.map(option).join('\n          ')}
        </select>
      </div>

      <div class="field">
        <label for="references">Reference links</label>
        <textarea id="references" name="references" rows="3" placeholder="Anything you’ve seen that’s close to what you want"></textarea>
      </div>

      <div class="field">
        <label for="message">Tell us about it <span class="req">required</span></label>
        <textarea id="message" name="message" rows="6" required></textarea>
      </div>

      <!-- Honeypot: real people leave this empty. -->
      <div class="field hp" aria-hidden="true">
        <label for="company_website">Company website</label>
        <input type="text" id="company_website" name="company_website" tabindex="-1" autocomplete="off">
      </div>

      <p class="form-error" id="form-error" role="alert" hidden></p>

      <button class="btn btn-primary" type="submit">Send the brief</button>
      <p class="hint">Or email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    </form>

    <div class="confirmation" id="brief-confirmation" hidden tabindex="-1">
      <h2>Got it.</h2>
      <p class="lede">We’ll come back to you within two working days with a budget range and some questions.</p>
      <p><a class="arrow-link" href="/work/">See the work while you wait</a></p>
    </div>
  </div>
</section>`;

  return layout({
    title: 'Start a brief — Latokosero Films',
    description:
      'Tell us what you’re making. Send a brief and hear back within two working days with a realistic budget range.',
    canonical: '/brief/',
    body,
    bodyClass: 'page-brief'
  });
}

/* ------------------------------------------------ thanks / 404 / redirects */

function thanksPage() {
  const body = `
<section class="page-head">
  <div class="wrap narrow">
    <h1>Got it.</h1>
    <p class="lede">We’ll come back to you within two working days with a budget range and some questions.</p>
    <p class="actions"><a class="btn" href="/work/">See the work</a></p>
  </div>
</section>`;

  return layout({
    title: 'Brief received — Latokosero Films',
    description: 'Your brief is in. We’ll come back to you within two working days.',
    canonical: '/thanks/',
    noindex: true,
    body,
    bodyClass: 'page-thanks'
  });
}

function notFoundPage() {
  const body = `
<section class="page-head">
  <div class="wrap narrow">
    <h1>That page has moved.</h1>
    <p class="lede">The site was rebuilt in 2026 and some old links didn’t survive. The work is all still here.</p>
    <p class="actions">
      <a class="btn btn-primary" href="/work/">See the work</a>
      <a class="btn" href="/">Home</a>
    </p>
  </div>
</section>`;

  return layout({
    title: 'Page not found — Latokosero Films',
    description: 'That page has moved. Browse the work or start a brief.',
    canonical: '/404.html',
    noindex: true,
    body,
    bodyClass: 'page-404'
  });
}

/*
 * Redirect stub.
 *
 * GitHub Pages cannot issue a real 301, so every legacy URL gets a page that
 * canonicalises to the new location, tells crawlers where to go, and moves
 * the visitor immediately. The canonical tag is what consolidates the ranking
 * signal; the refresh is what serves the human.
 */
function redirectStub(to, label) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved — Latokosero Films</title>
<link rel="canonical" href="${site.domain}${to}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}">
<script>window.location.replace(${JSON.stringify(to)});</script>
</head>
<body>
<p>${esc(label)} has moved to <a href="${to}">${site.domain}${to}</a>.</p>
</body>
</html>`;
}

/* --------------------------------------------------------- sitemap / robots */

function sitemap() {
  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/work/', priority: '0.9' },
    ...services.map((s) => ({ loc: `/${s.slug}/`, priority: '0.9' })),
    { loc: '/brief/', priority: '0.8' }
  ];
  const today = new Date().toISOString().slice(0, 10);

  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${site.domain}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function robots() {
  return `
User-agent: *
Allow: /

Sitemap: ${site.domain}/sitemap.xml`;
}

/* -------------------------------------------------------------------- run */

console.log('Building latokoserofilms.com');

write('index.html', homepage());
write('work/index.html', workPage());
services.forEach((s) => write(`${s.slug}/index.html`, servicePage(s)));
write('brief/index.html', briefPage());
write('thanks/index.html', thanksPage());
write('404.html', notFoundPage());

// Legacy URLs. Add a line here for every path that was ever indexed.
write('portfolio.html', redirectStub('/work/', 'The portfolio page'));

write('sitemap.xml', sitemap());
write('robots.txt', robots());

console.log('Done.');
