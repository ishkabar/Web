# Portfolio

[![wakatime](https://wakatime.com/badge/github/ishkabar/Web.svg?style=flat-square)](https://wakatime.com/badge/github/ishkabar/Web)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)

Professional developer portfolio built with Next.js 15, featuring MDX-based content management, full internationalization, and downloadable CV.

**Live**: [dkarczewski.com](https://dkarczewski.com)

## Features

### Content Management
- **MDX Blog Posts**: Technical articles with syntax highlighting
  - DevExpress WPF tips and tricks
  - Firebird ↔ PostgreSQL synchronization
  - GitHub Actions CI/CD for .NET
  - Multithreaded ERP integrations
  - Comarch Hydra API callbacks
  - FTP-based database sync

- **Project Showcase**: Portfolio projects with detailed case studies
  - Autostacja Sync (document synchronization)
  - Comarch ERP XL Hydra integration
  - Comarch Kardex inventory management
  - Database FTP Sync
  - ogur.dev gaming portfolio
  - Psie Przedszkole (dog daycare website)

### Internationalization (i18n)
- 18 language support via next-intl
- Supported locales: `en, pl, de, fr, es, it, pt, ru, ua, cz, da, fi, ja, ko, nl, no, sv, zh`
- Automatic locale detection
- Locale-specific routing (`/en/blog`, `/pl/blog`)
- Generated locale configs via `scripts/gen-locales.ts`

### Advanced Features
- **CV Generation**: Downloadable PDF resume with cover letter
- **Route Protection**: Password-protected pages via middleware
- **Cookie Consent**: GDPR-compliant banner with localStorage persistence
- **SEO Optimization**:
  - Automatic Open Graph image generation
  - RSS feed (`/api/rss`)
  - Sitemap and robots.txt
  - Schema.org markup
- **Table of Contents**: Auto-generated navigation for blog posts
- **Social Sharing**: Share buttons for Twitter, LinkedIn, Facebook
- **Mailchimp Integration**: Newsletter subscription

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4.0, SCSS Modules
- **Content**: MDX with custom components
- **Styling**: [Once UI](https://once-ui.com) design system
- **i18n**: next-intl
- **Deployment**: Docker + Traefik

## Project Structure
```
src/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── about/         # CV/About page
│   │   ├── blog/          # Blog listing + posts
│   │   ├── work/          # Project showcase
│   │   └── gallery/       # Image gallery
│   └── api/
│       ├── og/            # Open Graph image generation
│       ├── rss/           # RSS feed
│       └── authenticate/  # Route protection
├── content/
│   ├── posts/             # MDX blog posts
│   └── projects/          # MDX project case studies
├── messages/              # i18n translations (18 locales)
├── components/
│   ├── blog/              # Post rendering, sharing
│   ├── work/              # Project cards
│   ├── gallery/           # Image viewer
│   ├── CVDocument.tsx     # PDF CV generator
│   ├── LocaleSwitcher.tsx # Language selector
│   └── RouteGuard.tsx     # Auth middleware
└── resources/
    ├── site.config.ts     # Site metadata
    └── ui-tokens.config.ts # Design tokens
```

## Getting Started

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev              # http://localhost:3000
```

### Build
```bash
pnpm build
pnpm start
```

### Generate Locale Configs
```bash
pnpm tsx scripts/gen-locales.ts
```

## Configuration

### Site Settings
Edit `src/resources/site.config.ts`:
```typescript
export const siteConfig = {
  name: "Dominik Karczewski",
  title: "Senior .NET Developer",
  description: "ERP integrations & automation specialist",
  // ...
}
```

### Content
- **Blog posts**: Add `.mdx` files to `src/content/posts/`
- **Projects**: Add `.mdx` files to `src/content/projects/`
- **Images**: Store in `public/images/blog/` or `public/images/projects/`

### Translations
- Add new keys to `src/messages/{locale}/` folders
- Supported languages configured in `src/i18n/routing.ts`
- Auto-generate locale types: `pnpm tsx scripts/gen-locales.ts`

## Environment Variables
Create `.env.local`:
```bash
# Route protection (optional)
NEXT_PUBLIC_PASSWORD_PROTECTED_ROUTES=

# Mailchimp (optional)
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=
```

## Docker Deployment
```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio
```

## License
CC BY-NC 4.0 - Attribution required, commercial usage not allowed.
