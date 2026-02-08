# ogur.dev

[![wakatime](https://wakatime.com/badge/github/ishkabar/Web.svg?style=flat-square)](https://wakatime.com/badge/github/ishkabar/Web)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)
![Upstash](https://img.shields.io/badge/Upstash-Redis-00E9A3?style=flat-square)

Gaming portfolio showcasing automation tools and Discord bots with particle effects, view tracking, and dynamic slogans.

**Live**: [ogur.dev](https://ogur.dev)

## Projects

### Discord Bots & Automation
- **Ogur.Fishing**: Metin2 fishing bot with auto-selling and pattern recognition
- **Ogur.Clicker**: High-precision mouse automation with global hotkeys
- **Ogur.Hub**: Discord voice client with custom RPC and audio streaming
- **Legacy Ogur Bot**: Original Discord music/moderation bot
- **Sentinel DevExpress**: WPF-based Discord bot manager
- **Sentinel API Worker**: Background service for bot coordination

### Libraries & Infrastructure
- **Ogur.Core**: Shared .NET abstractions and utilities
- **Ogur.Abstractions**: Dependency injection containers
- **Astro Hub**: Metin2 server emulator
- **Startup Controller**: Multi-application launcher
- **Terraria Manager**: Game server control panel

## Features

### UI/UX
- **Particle Effects**: Interactive mouse-following particles with Three.js
- **Dynamic Slogans**: Rotating taglines on homepage
- **View Counter**: Real-time page view tracking via Upstash Redis
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Theme**: Minimalist black aesthetic

### Technical
- **MDX Projects**: Detailed project documentation with syntax highlighting
- **SEO**: Automatic Open Graph images, sitemap, robots.txt, JSON-LD schema
- **Analytics**: Page view tracking with Redis
- **Contact Form**: Email integration
- **Cookie Consent**: GDPR-compliant banner
- **Sponsor Menu**: Support links (Ko-fi, PayPal, GitHub)

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4.0, Three.js
- **Database**: Upstash Redis (view counters)
- **Content**: MDX
- **Fonts**: Cal Sans (headers), Inter (body)
- **Deployment**: Docker + Traefik

## Project Structure
```
app/
├── page.tsx               # Homepage with particles
├── projects/
│   ├── page.tsx          # Project grid
│   └── [slug]/           # Individual project pages
│       ├── page.tsx      # MDX rendering
│       ├── view.tsx      # View counter
│       └── header.tsx    # Project header
├── contact/              # Contact form
├── legal/                # Legal/privacy page
├── components/
│   ├── particles.tsx     # Three.js particle system
│   ├── Slogan.tsx        # Rotating taglines
│   ├── nav.tsx           # Navigation bar
│   └── card.tsx          # Project cards
└── api/
    └── incr/             # View counter endpoint

content/
└── projects/             # MDX project files
    ├── OgurFishing.mdx
    ├── OgurClicker.mdx
    ├── OgurHub.mdx
    └── ...

lib/
├── redis.ts              # Upstash client
├── slogans.ts            # Tagline data
└── contact-data.tsx      # Contact links
```

## Getting Started

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev              # http://localhost:3001
```

### Build
```bash
pnpm build
pnpm start
```

## Configuration

### Upstash Redis
Create `.env.local`:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Add New Project
1. Create `content/projects/YourProject.mdx`:
```mdx
---
title: "Project Name"
description: "Short description"
repository: "username/repo"
url: "https://live-url.com"
date: "2025-01-01"
published: true
---

Project content here...
```

2. Add cover image: `public/og/YourProject.png`

### Modify Slogans
Edit `lib/slogans.ts`:
```typescript
export const slogans = [
  "gaming automation specialist",
  "discord bot developer",
  // Add more...
];
```

## Docker Deployment
```bash
# Build image
docker build -t ogur-next .

# Run container
docker run -p 3001:3000 ogur-next
```

## Environment Variables
```bash
# Upstash Redis (required for view counters)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Contact form (optional)
CONTACT_EMAIL=
```

## License
MIT
