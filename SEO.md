# SEO Instructions — The Software Base (Muse Spark)

> **Rule zero: `lib/site.js` is the ONLY source of truth.** No string literal that is content/data may be hardcoded in any `app/**`, `components/**`, `public/**`. Every title/desc/label/cta/stat/image/src must be imported from `lib/site.js`. Edit `lib/site.js` → every page updates. If a new label is needed, add it to `lib/site.js` first.

## 1. Metadata (100% required)

**`app/layout.jsx` is canonical:**
```js
export const viewport = { width:'device-width', initialScale:1, themeColor:[{media:'(prefers-color-scheme: light)',color:'#020F40'}], colorScheme:'light dark' }
export const metadata = {
  metadataBase: new URL(site.url), // site.url must exist in lib/site.js
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: site.authors, creator: site.creator, publisher: site.publisher,
  alternates: { canonical:'/', languages:{'en-US':'/'} },
  openGraph: { type:'website', locale:site.locale, url:site.url, title:site.title, description:site.description, siteName:site.name, images:[{url:'/home-hero.png',width:1200,height:630,alt:`${site.name} — ${site.description}`}] },
  twitter: { card:'summary_large_image', title:site.title, description:site.description, images:['/home-hero.png'] },
  robots: { index:true, follow:true, googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1} },
  icons:{icon:[{url:'/favicon.ico'},{url:'/favicon.svg',type:'image/svg+xml'}],apple:[{url:'/apple-touch-icon.png',sizes:'180x180'}]}, manifest:'/site.webmanifest'
}
```
**`app/page.jsx` (home) must export `metadata` + JSON-LD:**
- `metadata.alternates.canonical = site.url`
- `openGraph`/`twitter` from `hero` + `site`
- JSON-LD `BreadcrumbList`, `FAQPage` (`faq` → `Question/Answer`), `ItemList` (`services.filter(selected)` → `Service`)

**Every `app/**/page.jsx` must export `metadata = { title, description, alternates:{canonical}, openGraph:{...} }` using `pages.*` + `site.url`.**

## 2. Crawlability

- `app/sitemap.js` → `import {site} from '@/lib/site'` → `routes = ['','/services','/work','/process','/why-us','/contact','/privacy','/terms']` → `url: base+route`, `lastModified: new Date()`, `priority: 1 for /`
- `app/robots.js` → `rules:[{userAgent:'*',allow:'/',disallow:['/dashboard','/api/']}]`, `sitemap: site.url+'/sitemap.xml'`, `host: site.url`
- `public/site.webmanifest` must match `site.name/shortName/theme_color`

## 3. Semantic HTML (Lighthouse Accessibility + SEO)

- One `h1` per page — `home-hero.jsx` `h1#hero-heading` contains `site.name` + `hero.title`. All other sections use `h2` with `id` + `aria-labelledby`.
- Every home section: `<section id="{kebab}" aria-labelledby="{id}-heading">` + `<h2 id="{id}-heading">` + `<p>` desc. Never skip heading level (`h1→h2→h3`).
- Landmarks: `header[role=banner]` (`navbar.jsx`), `main#main-content` (`app/page.jsx`), `footer` (`footer.jsx`), `nav[aria-label]`
- Lists: `workCases`/`services`/`faq` must be `<ul>/<li>` or semantic `dl/dt/dd` for FAQ (we use `button[aria-expanded]` + `div[hidden]` is acceptable but `dl` preferred)
- Links: `Link` text must be descriptive (`site.cta.label`, `pages.*.primaryCta.label`), never `Click here`. Add `aria-label` for icon-only buttons (`ThemeToggle`, hamburger)
- FAQ accordion: `button[aria-expanded={open===i}][aria-controls]` + content `id`, keyboard `Enter/Space`

## 4. Images & Media (Performance + SEO)

- Every `next/image` **must** have `alt` (from `lib/site.js` `title/desc`), `sizes` (e.g. `sizes="(max-width:1024px) 100vw, 44vw"`), `priority` only for LCP (hero `priority` on first 2 process cards, logo `priority`), `fill` + `object-cover` + `imagePos` from `lib`
- `video` in hero: `poster="/home-hero.png"`, `aria-label`, `title`, `preload="metadata"`, `playsInline`, `muted`, `loop`
- No `width/height` layout shift — use `fill` + parent `aspect-[16/9]` or `h-[100dvh]`

## 5. Structured Data (Rich Results)

- `app/layout.jsx` → global `Organization` + `WebSite` JSON-LD (`@id: site.url/#organization`, `logo: site.url/thesoftwarebase.png`)
- `app/page.jsx` → `FAQPage` (`faq`), `BreadcrumbList`, `ItemList` (services)
- Any list page (`/work`, `/services`) should add `ItemList`/`CollectionPage`
- Validate at https://validator.schema.org/

## 6. Content Rules (Brutal Voice + SEO)

- Titles: `site.title` ≤60 chars, descriptions ≤155 chars, from `lib/site.js`
- Keywords: `site.keywords` 10-12 terms, no stuffing
- Copy stays brutal (hard borders, flat fills, 0–4px) but must answer **actual business need** (whyUs reasons = revenue/handoff/AI/ownership, not UI). Never focus only on UI.
- All stats (`whyUs.stats`, `hero.stats`) must have `v/k` from `lib`, rendered as `text-[22px] font-black` with `aria-label`

## 7. Performance (Core Web Vitals)

- `next/font/google` `Space_Grotesk` with `display:swap`, `variable`
- `darkMode: class`, no CLS: reserve `aspect-*` for images, `h-[100dvh]` for sticky decks
- No `head` or `build` in dev loops — use `prettier --check` for syntax, not `next build` unless deploying

## 8. Checklist Before Commit

- [ ] `grep -r "\"[A-Z][a-z]" components/home/` returns 0 content literals (only UI chrome `VS`/`+` allowed)
- [ ] `lib/site.js` updated, `import {site/pages/hero/services/workCases/processSteps/whyUs/faq/footer}` in every component
- [ ] `metadataBase` + `openGraph` + `twitter` + `robots` + `sitemap` + `viewport` present
- [ ] `h1` count =1, `h2` per section with `id`, `section[id][aria-labelledby]`
- [ ] Every `Image` has `alt` + `sizes`, every `video` has `poster` + `aria-label`
- [ ] JSON-LD `FAQPage`/`BreadcrumbList`/`Organization` valid
- [ ] `site.url` is `https://thesoftwarebase.com` (no trailing slash), `canonical` matches
- [ ] No `npm run build` in CI without `prettier --check` first

> Follow this file for every future `home-*`, `navbar`, `footer` edit. If you break it, Lighthouse SEO drops below 100.
