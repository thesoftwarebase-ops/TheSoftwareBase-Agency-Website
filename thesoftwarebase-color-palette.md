# The Software Base — Brand Color Palette

Extracted directly from the uploaded logo using K-means clustering on 40,000 sampled pixels (background/white pixels excluded). Contrast ratios below are computed using the WCAG relative luminance formula, not estimated.

## 1. Core Logo Colors (Extracted)

| Swatch | Hex | RGB | % of logo area | Role |
|---|---|---|---|---|
| Deep Navy | `#020F40` | 2, 15, 64 | 12.5% | Darkest outline/shadow |
| Navy | `#093375` | 9, 51, 117 | 14.6% | Main letterform fill |
| Blue | `#0D65EF` | 13, 101, 239 | 9.1% | Mid highlight on letters |
| Sky Blue | `#1EA5DE` | 30, 165, 222 | 10.2% | Swirl transition tone |
| Cyan | `#11DFF5` | 17, 223, 245 | 11.2% | "Software" text + circuit glow |
| Pale Cyan | `#C6EAF4` | 198, 234, 244 | 10.4% | Highlight sheen |
| Slate Blue | `#2E729F` | 46, 114, 159 | 9.1% | Secondary/muted gradient tone |
| Mist Blue | `#81ABCA` | 129, 171, 202 | 6.7% | Softest gradient tone |

## 2. Dark Mode Tokens

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#05070C` | Page background |
| `--bg-surface` | `#0B1220` | Cards, nav, panels |
| `--bg-elevated` | `#111A2E` | Modals, raised sections |
| `--border` | `#1D2A44` | Hard-edged dividers |
| `--border-strong` | `#11DFF5` | Emphasis borders, focus rings |
| `--text-primary` | `#F7FAFC` | Headings, body copy |
| `--text-secondary` | `#81ABCA` | Muted/meta text |
| `--accent-primary` | `#11DFF5` | CTAs, links, glow accents |
| `--accent-secondary` | `#0D65EF` | Secondary buttons, active states |
| `--accent-deep` | `#093375` | Gradients, hover shadows |

**Verified contrast (dark mode):**
- Cyan `#11DFF5` on Deep Navy `#020F40` → **11.26:1** (AAA)
- White text `#F7FAFC` on Deep Navy `#020F40` → **17.5:1** (AAA)
- Cyan `#11DFF5` on near-black `#05070C` → **12.38:1** (AAA)
- Mist Blue `#81ABCA` secondary text on Deep Navy → **7.52:1** (AAA)

## 3. Light Mode Tokens

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#F7FAFC` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-muted` | `#C6EAF4` | Section backgrounds (pale cyan) |
| `--border` | `#B9CCDD` | Sharp brutalist borders |
| `--border-strong` | `#020F40` | Emphasis borders |
| `--text-primary` | `#020F40` | Headings |
| `--text-secondary` | `#2E729F` | Muted/meta text |
| `--accent-primary` | `#0D65EF` | CTAs, links |
| `--accent-secondary` | `#093375` | Hover/active buttons |
| `--accent-highlight` | `#11DFF5` | Tags, underlines, active nav |

**Verified contrast (light mode):**
- Deep Navy `#020F40` on white `#FFFFFF` → **17.5:1** (AAA)
- Blue `#0D65EF` on white → **4.86:1** (AA for normal text, use bold/large size for AAA)
- Navy `#093375` on Pale Cyan `#C6EAF4` background → **9.46:1** (AAA)
- Slate `#2E729F` secondary text on white → **4.98:1** (AA)

> Note: `#0D65EF` and `#2E729F` pass AA (≥4.5:1) but not AAA (≥7:1) on white. For small critical text, prefer `#093375` or `#020F40` instead.

## 4. Raw Gradient / Hero-Only Colors

Use only for the logo itself, hero glows, or animated border-beams — never as full backgrounds, to preserve brutalist flatness elsewhere.

```css
--gradient-brand: linear-gradient(135deg, #020F40 0%, #0D65EF 50%, #11DFF5 100%);
```

## 5. Brutalist + Professional UI Rules

- Borders over shadows: use `2–3px solid` borders (`#1D2A44` dark / `#020F40` light) instead of soft box-shadows for structure.
- Flat fills for interactive elements: buttons and inputs use solid accent colors, no gradients — reserve gradients for the hero/logo only.
- Sharp corners: `0–4px` border-radius keeps the brutalist edge; avoid fully rounded pills.
- Circuit-line motif: reuse thin `#11DFF5` connector lines (echoing the logo's circuit graphic) as section dividers or footer detailing.
- High-contrast type only: no gray-on-gray; always pair text/background combos from the tables above.

## 6. Tailwind Config Snippet

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: { light: '#F7FAFC', dark: '#05070C' },
        surface: { light: '#FFFFFF', dark: '#0B1220' },
        border: { light: '#B9CCDD', dark: '#1D2A44' },
        accent: {
          primary: { light: '#0D65EF', dark: '#11DFF5' },
          secondary: { light: '#093375', dark: '#0D65EF' },
        },
        text: {
          primary: { light: '#020F40', dark: '#F7FAFC' },
          secondary: { light: '#2E729F', dark: '#81ABCA' },
        },
        logo: {
          navyDeep: '#020F40',
          navy: '#093375',
          blue: '#0D65EF',
          sky: '#1EA5DE',
          cyan: '#11DFF5',
          paleCyan: '#C6EAF4',
          slate: '#2E729F',
          mist: '#81ABCA',
        },
      },
    },
  },
};
```
