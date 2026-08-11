/*
 * Site-wide content: brand, navigation, clients, and the work archive.
 *
 * This file is the single source of truth for anything that appears on more
 * than one page. Edit here, then run `node build.js`.
 */

const site = {
  name: 'Latokosero Films',
  domain: 'https://latokoserofilms.com',
  city: 'Kathmandu',
  country: 'Nepal',

  // TODO(confirm): real contact details before launch. These are used in the
  // footer and in the LocalBusiness schema on the homepage.
  email: 'hello@latokoserofilms.com',
  phone: '',
  street: '',
  instagram: '',
  youtube: '',

  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'Commercials', href: '/commercials/' },
    { label: 'Music videos', href: '/music-videos/' },
    { label: 'Short films', href: '/short-films/' },
    { label: 'Event coverage', href: '/event-coverage/' },
    { label: 'AI video', href: '/ai-video/' }
  ],

  // Trust strip. Rendered as text wordmarks — we do not ship logo files we
  // do not have permission to use. Drop an SVG into assets/logos/ and add a
  // `logo` key here to swap any one of these to an image.
  clients: [
    { name: 'Khalti' },
    { name: 'Chaa' },
    { name: 'Sugam Pokharel' },
    { name: 'Chewang Lama' },
    { name: 'Udit Narayan Jha' },
    { name: 'Seasons Band' }
  ]
};

/*
 * The work archive.
 *
 * `youtube` is a video ID. Entries that have one get a VideoObject schema
 * block and a real embed on the work page; entries without one render as a
 * card with no player until you add the ID.
 *
 * `loop` is a path to a 3-second muted MP4 used for the hover preview on
 * tiles. Tiles without a loop fall back to the still in `poster`, and tiles
 * without either fall back to a typographic card. Nothing breaks.
 *
 * `year` is left null where we could not verify it. The renderer omits the
 * year rather than printing a guess — fill these in and they appear.
 */
const work = [
  {
    slug: 'khalti-turns-6',
    title: 'Khalti turns 6',
    client: 'Khalti',
    category: 'Commercials',
    year: null, // TODO(fill)
    youtube: null, // TODO(fill)
    loop: null,
    poster: null,
    featured: true,
    blurb: 'Anniversary campaign film for Nepal’s digital wallet.'
  },
  {
    slug: 'dont-be-a-dino',
    title: 'Don’t be a dino',
    client: 'Khalti',
    category: 'Commercials',
    year: null, // TODO(fill)
    youtube: null, // TODO(fill)
    loop: null,
    poster: null,
    featured: true,
    blurb: 'Campaign spot on paying the slow way.'
  },
  {
    slug: 'chaa-handwash',
    title: 'Chaa handwash',
    client: 'Chaa',
    category: 'Commercials',
    year: null, // TODO(fill)
    youtube: null, // TODO(fill)
    loop: null,
    poster: null,
    featured: true,
    blurb: 'Product film for the handwash range.'
  },
  {
    slug: 'ratri-basaima',
    title: 'Ratri Basaima',
    client: 'Sugam Pokharel',
    category: 'Music videos',
    year: null, // TODO(fill)
    youtube: null, // TODO(fill)
    loop: null,
    poster: null,
    featured: true
  },
  {
    slug: 'lahure',
    title: 'Lahure',
    client: 'Chewang Lama',
    category: 'Music videos',
    year: null, // TODO(fill)
    youtube: null, // TODO(fill)
    loop: null,
    poster: null,
    featured: true
  },
  {
    slug: 'ko-nepali-yo',
    title: 'Ko Nepali Yo',
    client: 'The Seasons Band',
    category: 'Music videos',
    year: null, // TODO(fill)
    youtube: 'WYyyyBy1xSk',
    loop: null,
    poster: null,
    featured: true,
    blurb:
      'A patriotic song by The Seasons Band, released on Stereo Records — written, composed and performed by the band.'
  },
  {
    slug: 'himalai-ramro-hiunle',
    title: 'Himalai Ramro Hiunle',
    titleNe: 'हिमालै राम्रो हिउँले',
    client: null,
    category: 'Music videos',
    year: null, // TODO(fill)
    youtube: 'kxDunVWRMC4',
    loop: null,
    poster: null,
    featured: false
  },
  {
    slug: 'nnp-sambridhi-paani-tank',
    title: 'NNP Sambridhi Paani Tank',
    client: 'NNP',
    category: 'Commercials',
    year: null, // TODO(fill)
    youtube: 'sNcVo9BBv-o',
    loop: null,
    poster: null,
    featured: false
  }
];

module.exports = { site, work };
