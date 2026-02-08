# Web

[![wakatime](https://wakatime.com/badge/github/ishkabar/Web.svg?style=flat-square)](https://wakatime.com/badge/github/ishkabar/Web)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Traefik](https://img.shields.io/badge/Traefik-v3-24A1C1?style=flat-square)

Monorepo containing two Next.js frontends deployed behind Traefik reverse proxy with automatic SSL.

## Projects

### [portfolio](./portfolio)
Professional portfolio with MDX-based blog and project showcase. Includes full i18n support (18 languages), CV generation, cookie consent, and route protection.

### [ogur-next](./ogur-next)
Gaming portfolio showcasing automation projects with particle effects, view tracking, and dynamic slogans.

## Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.7
- **Styling**: Tailwind CSS 4.0, SCSS modules
- **Content**: MDX for blog posts and projects
- **Deployment**: Docker Compose + Traefik v3 with Let's Encrypt
- **Package Manager**: pnpm

## Repository Layout
```
.
├── docker-compose.local.yml   # Local development setup
├── docker-compose.prod.yml    # Production deployment
├── traefik/
│   ├── traefik.yml           # Static configuration
│   ├── traefik_dynamic.yml   # Dynamic routing rules
│   └── acme/                 # SSL certificate cache
├── portfolio/                # Professional portfolio (dkarczewski.com)
└── ogur-next/               # Gaming portfolio (ogur.dev)
```

## Prerequisites
- Node 20.x LTS
- pnpm (`npm i -g pnpm`)
- Docker Engine + Compose (production only)

## Local Development
```bash
# Portfolio
cd portfolio
pnpm install
pnpm dev              # http://localhost:3000

# ogur.dev
cd ../ogur-next
pnpm install
pnpm dev              # http://localhost:3001
```

## Build
```bash
# Build both projects
pnpm --prefix portfolio build
pnpm --prefix ogur-next build
```

## Production Deployment
1. Configure DNS:
   - `dkarczewski.com` → VPS IP
   - `ogur.dev` → VPS IP

2. Deploy on VPS:
```bash
   docker compose -f docker-compose.prod.yml up -d --build
```

3. Traefik automatically requests and renews SSL certificates via Let's Encrypt (stored in `traefik/acme/`).

## Environment Variables
- Keep `.env` files local (never commit)
- Reference `.env.example` in each project for required variables

## Routing
- **Production**:
  - `dkarczewski.com` → portfolio
  - `ogur.dev` → ogur-next
  
- **Local** (with `docker-compose.local.yml`):
  - `localhost/portfolio` → portfolio
  - `localhost/ogur` → ogur-next

## Quick Commands
```bash
# Run dev servers from repo root
pnpm -C portfolio dev
pnpm -C ogur-next dev

# Build both
pnpm -C portfolio build
pnpm -C ogur-next build

# Production deployment
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.prod.yml restart
```

## License
MIT
