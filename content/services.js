/*
 * The five service pages.
 *
 * Every one uses the same six-block structure — H1 + definition, what's
 * included, process, featured work, what it costs, FAQ. Do not add a block to
 * one page without adding it to all five: the template renders whatever is
 * here, and consistency is what makes these pages easy to update.
 *
 * `featured` holds slugs from content/site.js. Where the archive can't fill
 * three slots yet, `featuredNote` explains what's missing instead of the page
 * rendering an empty row.
 *
 * FAQ entries here are also what generate the FAQPage schema, so the markup
 * can never drift from the visible copy.
 */

const services = [
  {
    slug: 'commercials',
    nav: 'Commercials',
    h1: 'Commercials',
    definition:
      'Brand films, campaign spots and product videos for Nepali and regional brands — written, shot and finished by one team.',
    title: 'Commercial video production in Nepal — Latokosero Films',
    description:
      'Brand films and campaign spots, scripted, shot and finished in Kathmandu. Work for Khalti, Chaa and more.',
    card:
      'Brand films and campaign spots, from script to delivery.',
    included: [
      'Concept development and scripting',
      'Storyboards and shot list',
      'Casting, location scouting, permits',
      'Direction, cinematography, crew and kit',
      'Edit, grade, sound design and mix',
      'Cutdowns for TV, YouTube, Instagram and in-app placement'
    ],
    process: [
      {
        name: 'Brief and budget',
        body: 'We start from what the campaign has to achieve, not from a shot idea.'
      },
      {
        name: 'Concept',
        body: 'Two or three routes, one page each. You pick one; we develop it.'
      },
      {
        name: 'Previz',
        body: 'Boards and a shot list. Nothing goes to camera unapproved.'
      },
      {
        name: 'Production',
        body: 'Typically one to three shoot days for a 30–60 second spot.'
      },
      {
        name: 'Post and delivery',
        body: 'First cut within a week of wrap. Two revision rounds included. Delivered in every aspect ratio your media plan needs.'
      }
    ],
    featured: ['khalti-turns-6', 'dont-be-a-dino', 'chaa-handwash'],
    cost:
      'Most commercials land between a single-day product spot and a multi-day campaign film. Tell us the media plan and we’ll give you a band on the first call. We’d rather scope down to fit a real budget than quote against one that doesn’t exist.',
    faq: [
      {
        q: 'How long from brief to delivery?',
        a: 'Three to five weeks for a standard spot. Faster is possible; it costs more.'
      },
      {
        q: 'Do you handle casting and permits?',
        a: 'Yes, both, including Kathmandu location permissions.'
      },
      {
        q: 'Can you work from an agency’s script?',
        a: 'Yes. We’re often the production partner on an agency-led campaign.'
      },
      {
        q: 'How many revisions?',
        a: 'Two rounds in the base scope. Further rounds are billed at a day rate agreed upfront.'
      },
      {
        q: 'Do we own the footage?',
        a: 'You own the delivered film and the licensed usage. Raw rushes are available as an add-on — we’ll state which at contract.'
      }
    ]
  },

  {
    slug: 'music-videos',
    nav: 'Music videos',
    h1: 'Music videos',
    definition:
      'Concept, shoot and FX for artists and labels — from a single-location performance piece to a full narrative video.',
    title: 'Music video production, Kathmandu — Latokosero Films',
    description: 'Concept, shoot and FX for Nepali artists and labels.',
    card: 'Concept, shoot and FX for Nepali artists and labels.',
    included: [
      'Concept from the track, not from a template',
      'Treatment document you can take to a label or sponsor',
      'Direction, cinematography, crew and lighting',
      'Playback and performance direction',
      'Edit, FX, grade and delivery masters',
      'Vertical and short-form cutdowns for Reels, Shorts and TikTok'
    ],
    process: [
      {
        name: 'Listen',
        body: 'We work from the finished mix. Send it before the first call.'
      },
      {
        name: 'Treatment',
        body: 'One document: the idea, the look, the locations, the budget.'
      },
      { name: 'Shoot', body: 'Usually one or two days.' },
      {
        name: 'Post',
        body: 'Edit, then FX and grade. Performance videos turn around faster than narrative ones.'
      }
    ],
    featured: ['ratri-basaima', 'lahure', 'ko-nepali-yo'],
    cost:
      'A single-location performance video is the entry point. Narrative videos with multiple locations, cast and FX scale from there. Labels and independent artists get the same process; the difference is scope, not care.',
    faq: [
      {
        q: 'Can you work to a release date?',
        a: 'Yes, if you come to us with at least four weeks. Under that, tell us immediately and we’ll say honestly whether it’s possible.'
      },
      {
        q: 'Do you shoot to a rough mix?',
        a: 'We can shoot to it, but we cut to the final master. Lock the mix before the edit.'
      },
      {
        q: 'Who handles the YouTube upload and metadata?',
        a: 'We deliver masters and thumbnails; upload is usually the label’s. We can do it if you’d rather.'
      },
      {
        q: 'Can we add FX after the shoot?',
        a: 'Some, but the good ones are planned at previz. Tell us early and it’s cheaper and better.'
      }
    ]
  },

  {
    slug: 'short-films',
    nav: 'Short films',
    h1: 'Short films',
    definition: 'Narrative shorts — independent, festival-facing, or branded.',
    title: 'Short film production, Nepal — Latokosero Films',
    description:
      'Narrative and branded shorts, from script development to festival delivery.',
    card: 'Narrative work, festival cuts, and branded shorts.',
    included: [
      'Script development or script-to-screen from your draft',
      'Casting and rehearsal',
      'Full production crew and kit',
      'Edit, sound design, score supervision, grade',
      'Festival-spec deliverables (DCP, subtitles, press stills)'
    ],
    process: [
      {
        name: 'Script',
        body: 'We read, we give notes, we agree what the film is before budgeting.'
      },
      {
        name: 'Prep',
        body: 'Casting, locations, schedule. This is the phase that decides whether the shoot works.'
      },
      { name: 'Shoot', body: 'Three to seven days depending on the script.' },
      {
        name: 'Post',
        body: 'Longer than commercial work. Sound and grade get real time.'
      }
    ],
    featured: [],
    // Deck note: this is the weakest section of the current portfolio and the
    // one worth filling first. Add slugs to `featured` and this note goes away.
    featuredNote:
      'Shorts are being added to the archive. Ask us for links to recent narrative work and we’ll send them.',
    cost:
      'Shorts are scoped case by case. Come with a script and a rough budget and we’ll tell you honestly what’s achievable at that number.',
    faq: [
      {
        q: 'Do you co-produce?',
        a: 'Sometimes, on projects we believe in. Ask.'
      },
      {
        q: 'Can you deliver festival specs?',
        a: 'Yes — DCP, subtitle files, press kit stills.'
      },
      {
        q: 'Who owns the film?',
        a: 'Negotiated per project and written into the contract before we start.'
      }
    ]
  },

  {
    slug: 'event-coverage',
    nav: 'Event coverage',
    h1: 'Event coverage',
    definition:
      'Multi-camera coverage of launches, concerts, conferences and corporate events, with a highlight cut in your hands the same week.',
    title: 'Event video coverage, Kathmandu — Latokosero Films',
    description: 'Multi-camera coverage with same-week highlight cuts.',
    card: 'Multi-camera coverage with same-week highlight cuts.',
    included: [
      'Multi-camera setup with synced audio from the desk',
      'Stills coverage on request',
      'Same-week highlight cut (60–120 seconds)',
      'Full-length recording of keynotes or sets',
      'Social cutdowns, vertical framing included',
      'Live-stream setup as an add-on'
    ],
    process: [
      {
        name: 'Recce',
        body: 'We walk the venue beforehand. This is not optional and it’s why our coverage doesn’t look like a phone recording.'
      },
      {
        name: 'Coverage',
        body: 'Camera plan agreed against the run of show.'
      },
      {
        name: 'Turnaround',
        body: 'Highlight cut within five working days. Full-length within two weeks.'
      }
    ],
    featured: [],
    featuredNote:
      'Event cuts are being added to the archive. Ask us for recent coverage and we’ll send links.',
    cost:
      'Priced per day by camera count and turnaround speed. Same-day highlight delivery is available at a premium.',
    faq: [
      {
        q: 'How fast can we get a cut?',
        a: 'Five working days as standard, next-day at a premium, same-day if agreed in advance.'
      },
      {
        q: 'Do you live-stream?',
        a: 'Yes, as an add-on, with a dedicated encode operator.'
      },
      { q: 'Can you cover multi-day events?', a: 'Yes, priced per day.' },
      {
        q: 'Who owns the raw footage?',
        a: 'You do, on request, delivered on a supplied drive.'
      }
    ]
  },

  {
    slug: 'ai-video',
    nav: 'AI video',
    h1: 'AI video',
    definition:
      'Generative shots built into a real production pipeline — planned at previz, finished by hand, and integrated so they read as part of the film.',
    title: 'AI video production, Nepal — Latokosero Films',
    description:
      'Generative shots built into a real production pipeline and finished by hand.',
    card:
      'Generative pipelines for shots that would otherwise be out of budget.',

    // The AI page swaps "What's included" and "Process" for the four blocks
    // below. Everything else — featured work, cost, FAQ — is the standard
    // template, so the page still ranks and updates like its siblings.
    helps: [
      {
        name: 'Set extension',
        body: 'a rooftop becomes a skyline, a room becomes a hall.'
      },
      {
        name: 'Crowd and background',
        body: 'a dozen extras become a stadium.'
      },
      {
        name: 'Impossible locations',
        body: 'places you can’t get a permit for, or can’t fly to.'
      },
      {
        name: 'Concept and previz',
        body: 'boards and animatics in hours instead of days, so you approve the idea earlier.'
      },
      {
        name: 'Versioning',
        body: 'one shoot, many market variants, without a reshoot.'
      }
    ],
    doesnt:
      'We won’t use it for a hero performance, a close-up on a face that has to carry emotion, or anything where a client’s product has to be reproduced exactly. Those get shot. Being clear about this is the point.',
    pipeline: [
      { name: 'Concept', body: 'Generative boards and animatics from the script.' },
      {
        name: 'Previz',
        body: 'We decide which shots are generative before the shoot, not after.'
      },
      {
        name: 'Plate',
        body: 'Where a generative element sits inside live action, we shoot the plate properly. Good comp starts on set.'
      },
      {
        name: 'Generation',
        body: 'Shots built, iterated, and reviewed against the boards.'
      },
      {
        name: 'Comp and grade',
        body: 'A compositor and colorist match grain, lens character and color so the shot sits in the cut.'
      },
      {
        name: 'Finish',
        body: 'Delivered with the rest of the film. Same masters, same specs.'
      }
    ],
    rights: [
      'You own the delivered film. Contract states it plainly.',
      'We don’t train models on your material, and we don’t reuse your footage on other clients’ work.',
      'We’ll tell you which shots are generative, and we’ll put it in writing if your broadcaster, platform or brand guidelines require disclosure.',
      'We don’t generate likenesses of real people without written consent from that person.'
    ],
    featured: [],
    featuredNote:
      'Ask us for a shot breakdown — we’ll walk you through a generative shot frame by frame, including the plate it was built on.',
    cost:
      'Generative shots are quoted per shot, inside the wider production budget. For specific shots the saving is substantial; for a whole film the value is in what you no longer have to cut from the script.',
    faq: [
      {
        q: 'Is it cheaper?',
        a: 'For specific shots, substantially. For a whole film, no — the savings are in what you no longer have to cut from the script.'
      },
      {
        q: 'Will it look like AI?',
        a: 'Not if it’s planned at previz and finished by a compositor. It looks like AI when it’s bolted on at the end.'
      },
      {
        q: 'Do you disclose it to audiences?',
        a: 'We’ll do whatever your brand, platform or regulator requires, and we’ll advise you on what that is.'
      },
      {
        q: 'Can you match an existing brand film’s look?',
        a: 'Yes — send the reference and we’ll test before you commit.'
      }
    ]
  }
];

module.exports = { services };
