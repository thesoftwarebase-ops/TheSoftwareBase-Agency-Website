// Copy-field specs per owner page. Each dashboard section edits only its
// own slice of the `pages` key (or `workDetail`) — one card per page.

export const SERVICES_COPY = [
  { type: 'text', path: ['services', 'kicker'], label: 'Kicker' },
  { type: 'pair', path: ['services', 'title'], label: 'Hero title' },
  { type: 'text', path: ['services', 'desc'], label: 'Description', textarea: true },
  { type: 'cta', path: ['services', 'primaryCta'], label: 'Primary CTA' },
  { type: 'cta', path: ['services', 'secondaryCta'], label: 'Secondary CTA' },
  { type: 'pair', path: ['services', 'homeTitle'], label: 'Home title' },
  { type: 'text', path: ['services', 'cardCta'], label: 'Card CTA' },
  { type: 'text', path: ['services', 'exploreCta'], label: 'Explore CTA' },
  { type: 'text', path: ['services', 'countSuffix'], label: 'Count suffix' },
  { type: 'text', path: ['services', 'labKicker'], label: 'Lab kicker' },
  { type: 'pair', path: ['services', 'labTitle'], label: 'Lab title' },
  { type: 'text', path: ['services', 'labCountSuffix'], label: 'Lab count suffix' },
  { type: 'text', path: ['services', 'labDesc'], label: 'Lab description', textarea: true },
  { type: 'objlist', path: ['services', 'homeStats'], label: 'Home stats', fields: [{ key: 'v', label: 'Value' }, { key: 'k', label: 'Label' }] },
];

export const WORK_COPY = [
  { type: 'text', path: ['work', 'kicker'], label: 'Kicker' },
  { type: 'pair', path: ['work', 'title'], label: 'Hero title' },
  { type: 'text', path: ['work', 'desc'], label: 'Description', textarea: true },
  { type: 'pair', path: ['work', 'productsTitle'], label: 'Products hero title' },
  { type: 'text', path: ['work', 'productsDesc'], label: 'Products description', textarea: true },
  { type: 'text', path: ['work', 'productsShort'], label: 'Products short (SEO)' },
  { type: 'pair', path: ['work', 'clientsTitle'], label: 'Clients hero title' },
  { type: 'text', path: ['work', 'clientsDesc'], label: 'Clients description', textarea: true },
  { type: 'text', path: ['work', 'clientsShort'], label: 'Clients short (SEO)' },
  { type: 'text', path: ['work', 'homeKicker'], label: 'Home kicker' },
  { type: 'pair', path: ['work', 'homeTitle'], label: 'Home title' },
  { type: 'text', path: ['work', 'viewAllLabel'], label: 'View-all label' },
  { type: 'text', path: ['work', 'ownBadge'], label: 'Own badge' },
  { type: 'text', path: ['work', 'clientsKicker'], label: 'Clients kicker' },
  { type: 'text', path: ['work', 'scrollHint'], label: 'Scroll hint' },
  { type: 'text', path: ['work', 'clientBadge'], label: 'Client badge' },
  { type: 'text', path: ['work', 'moreWorkTitle'], label: 'More-work title' },
  { type: 'text', path: ['work', 'moreWorkCta'], label: 'More-work CTA' },
];

export const PROCESS_COPY = [
  { type: 'text', path: ['process', 'kicker'], label: 'Kicker' },
  { type: 'pair', path: ['process', 'title'], label: 'Hero title' },
  { type: 'text', path: ['process', 'desc'], label: 'Description', textarea: true },
  { type: 'text', path: ['process', 'timeline'], label: 'Timeline (e.g. 4–6 weeks)' },
  { type: 'text', path: ['process', 'timelineLabel'], label: 'Timeline label' },
  { type: 'text', path: ['process', 'timelineSuffix'], label: 'Timeline suffix' },
  { type: 'text', path: ['process', 'toProd'], label: '“…to production” fragment' },
  { type: 'text', path: ['process', 'deckMetaSuffix'], label: 'Deck meta suffix' },
  { type: 'text', path: ['process', 'headerExtra'], label: 'Header extra line', textarea: true },
  { type: 'text', path: ['process', 'badges', 'stacked'], label: 'Badge — stacked' },
  { type: 'text', path: ['process', 'badges', 'overlap'], label: 'Badge — overlap' },
  { type: 'text', path: ['process', 'hintBar', 'mobile'], label: 'Hint — mobile' },
  { type: 'text', path: ['process', 'hintBar', 'desktop'], label: 'Hint — desktop' },
  { type: 'text', path: ['process', 'hintBar', 'scrollHint'], label: 'Hint — scroll' },
  { type: 'text', path: ['process', 'card', 'phaseLabel'], label: 'Phase label' },
  { type: 'text', path: ['process', 'card', 'stepLabel'], label: 'Step label' },
  { type: 'text', path: ['process', 'card', 'yieldsLabel'], label: 'Yields label' },
  { type: 'text', path: ['process', 'card', 'productionFallback'], label: 'Last-card fallback' },
  { type: 'text', path: ['process', 'card', 'activateLabel'], label: 'Activate CTA' },
  { type: 'text', path: ['process', 'card', 'dbBadge'], label: 'DB badge' },
  { type: 'text', path: ['process', 'card', 'goLabel'], label: 'Go label' },
  { type: 'text', path: ['process', 'scalesKicker'], label: 'Scales kicker' },
  { type: 'text', path: ['process', 'ctaDesc'], label: 'CTA description', textarea: true },
  { type: 'text', path: ['process', 'ctaDescSuffix'], label: 'CTA suffix' },
  { type: 'text', path: ['process', 'primaryCta'], label: 'Primary CTA' },
  { type: 'text', path: ['process', 'secondaryCta'], label: 'Secondary CTA' },
  { type: 'text', path: ['process', 'stagesSuffix'], label: 'Stages suffix' },
];

export const WHYUS_HEADERS = [
  { type: 'text', path: ['whyUs', 'kicker'], label: 'Kicker' },
  { type: 'pair', path: ['whyUs', 'title'], label: 'Hero title' },
  { type: 'text', path: ['whyUs', 'desc'], label: 'Description', textarea: true },
  { type: 'pair', path: ['whyUs', 'homeTitle'], label: 'Home title' },
  { type: 'text', path: ['whyUs', 'homeCta'], label: 'Home CTA' },
  { type: 'text', path: ['whyUs', 'reasonsSuffix'], label: 'Reasons suffix' },
];

export const CONTACT_HERO = [
  { type: 'pair', path: ['contact', 'title'], label: 'Hero title' },
  { type: 'text', path: ['contact', 'desc'], label: 'Description', textarea: true },
];

export const HOME_COPY = [
  { type: 'section', label: 'Home CTA band' },
  { type: 'text', path: ['homeCta', 'title'], label: 'CTA title' },
  { type: 'text', path: ['homeCta', 'desc'], label: 'CTA description' },
  { type: 'section', label: 'Home FAQ headers' },
  { type: 'text', path: ['homeFaq', 'kicker'], label: 'FAQ kicker' },
  { type: 'text', path: ['homeFaq', 'title'], label: 'FAQ title' },
  { type: 'text', path: ['homeFaq', 'desc'], label: 'FAQ description' },
  { type: 'cta', path: ['homeFaq', 'cta'], label: 'FAQ CTA' },
  { type: 'text', path: ['homeFaq', 'countLabel'], label: 'Count label' },
  { type: 'text', path: ['homeFaq', 'answerLabel'], label: 'Answer label' },
];

export const DETAIL_SPEC = [
  { type: 'text', path: ['badges', 'own'], label: 'Own badge' },
  { type: 'text', path: ['badges', 'client'], label: 'Client badge' },
  { type: 'text', path: ['visitLive'], label: 'Visit-live label' },
  { type: 'text', path: ['internalUse'], label: 'Internal-use label' },
  { type: 'text', path: ['startSimilar'], label: 'Start-similar label' },
  { type: 'text', path: ['galleryKicker'], label: 'Gallery kicker' },
  { type: 'text', path: ['backToWork'], label: 'Back-to-work label' },
  { type: 'text', path: ['moreProducts'], label: 'More-products label' },
  { type: 'text', path: ['moreClients'], label: 'More-clients label' },
  { type: 'text', path: ['breadcrumb', 'work'], label: 'Crumb — work' },
  { type: 'text', path: ['breadcrumb', 'products'], label: 'Crumb — products' },
  { type: 'text', path: ['breadcrumb', 'clients'], label: 'Crumb — clients' },
  { type: 'text', path: ['kindLabel', 'own'], label: 'Kind prefix — own' },
  { type: 'text', path: ['kindLabel', 'client'], label: 'Kind prefix — client' },
  { type: 'text', path: ['ghost', 'own'], label: 'Ghost word — own' },
  { type: 'text', path: ['ghost', 'client'], label: 'Ghost word — client' },
];
