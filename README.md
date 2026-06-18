# Mijozlar Portali — Build Co.

Uy qurilish kompaniyasi mijozlar uchun premium veb-portal.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (dark mode, design tokens)
- **Framer Motion** (mikroanim, stories, transitions)
- **TanStack Query** + **Axios** (data layer)
- **Zustand** (client state)
- **React Router v6**
- **Recharts** (chartlar)
- **Lucide React** (ikonkalar)

## Modullar

| Sahifa | Tarkib |
|--------|--------|
| `/` Landing | Sticky header, hero, news strip, features, gallery, stats, testimonials, CTA |
| `/login` | Telefon + OTP, rotating fact strip, Telegram QR, biometric placeholder |
| `/dashboard` | Stories, hero, mening kvartiram timeline, payment spotlight, upcoming events, ob-havo, e'lonlar, activity, quick actions |
| `/construction` | 5 tab: Umumiy, Mening kvartiram, Hisobotlar, Materiallar, Sertifikatlar |
| `/payments` | Gradient hero (UZS/USD toggle), next payment spotlight, year timeline, Recharts grafik, saqlangan kartalar, filtrli list |
| `/lottery` | Live efir, 3D flippable chiptalar, O'zbekiston g'oliblar xaritasi, gamification, transparency |
| `/booking` | 10 facility (sport/dam olish/ish), kalendar, loyalty widget |
| `/profile` | Header, kvartira, financial, schedule, documents, referral, notifications, support, security, audit log |

## Boshlash

```bash
npm install
npm run dev
```

- Brauzerda: http://localhost:5173
- Test login: telefon **ixtiyoriy**, OTP kod **1234**

## Build & Deploy

```bash
npm run build   # → dist/
```

Deploy variantlari:
- **Netlify Drop** — https://app.netlify.com/drop (dist/ ni drag-drop)
- **Vercel CLI** — `npx vercel`
- **Netlify CLI** — `npx netlify-cli deploy --dir=dist --prod`

SPA routing config'lari tayyor: `vercel.json`, `netlify.toml`, `public/_redirects`.

## Environment

`.env` faylida:
```
VITE_API_BASE_URL=https://api.company.uz/v1
VITE_WS_BASE_URL=wss://api.company.uz/v1
VITE_USE_MOCK=true   # production'da false
```

## Loyiha tuzilmasi

```
src/
├── api/           # API client, mock adapter, React Query hooks
├── components/    # UI primitivlar (Button, Card, Input, Modal, ...)
│   ├── motion/    # FadeUp, Stagger, ScrollReveal, AnimatedNumber
│   └── layout/    # Sidebar, Topbar, BottomNav, AppLayout
├── features/      # Sahifaga xos feature komponentlar
│   ├── landing/
│   ├── dashboard/
│   ├── construction/
│   ├── payments/
│   ├── lottery/
│   ├── booking/
│   └── profile/
├── pages/         # Route sahifalari
├── store/         # Zustand store'lar (auth, theme)
├── config/        # navigation, facilities, app
├── types/         # TypeScript types
├── lib/           # utils (cn, formatUZS, formatDate, ...)
└── styles/        # globals.css
```
