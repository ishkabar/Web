# Web Stack: Portfolio (Astro) + ogur.dev (Next.js) + Traefik

Minimal monorepo for two frontends behind Traefik on a single VPS.

## 🚀 Stack
- **Portfolio**: [Astro](https://astro.build) (+ islands for React/Svelte if needed)
- **ogur.dev**: [Next.js](https://nextjs.org) (App Router, TypeScript, TailwindCSS)
- **Proxy/SSL**: [Traefik v3](https://traefik.io) with Let’s Encrypt
- **Package Manager**: [pnpm](https://pnpm.io)
- **Node**: 20 LTS (via nvm/Volta)

## 📂 Repository layout
```
.
├─ docker-compose.local.yml
├─ docker-compose.prod.yml
├─ traefik/
│  ├─ traefik.yml
│  ├─ traefik_dynamic.yml
│  └─ acme/            # cert cache (ignored; .gitkeep kept)
├─ portfolio-astro/    # Astro app (static build -> Nginx)
└─ ogur-next/          # Next.js app (standalone server)
```

## 🛠 Prerequisites
- Node 20.x
- pnpm (`npm i -g pnpm`)
- Docker Engine + Compose (for VPS deployment)

## 💻 Local development
```bash
# portfolio (Astro)
cd portfolio-astro
pnpm install
pnpm approve-builds   # if prompted
pnpm dev              # http://localhost:4321

# ogur.dev (Next.js)
cd ../ogur-next
pnpm install
pnpm approve-builds   # if prompted
pnpm dev              # http://localhost:3000
```

## 🏗 Build
```bash
# Astro (static build)
pnpm --prefix portfolio-astro build   # outputs to portfolio-astro/dist

# Next (standalone build)
pnpm --prefix ogur-next build
```

## 📦 Docker (production)
1. Point DNS:
   - `dkarczewski.com` → VPS IP
   - `ogur.dev` → VPS IP
2. On VPS:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
3. Traefik will request SSL certs (ACME). Files are stored in `traefik/acme/`.

## 🔑 Environment
- Secrets **must not** be committed.
- Keep `.env` files local.
- Add `*.env.example` to document required variables.

## ⚡ Handy commands
```bash
# run dev from repo root
pnpm -C portfolio-astro dev
pnpm -C ogur-next dev

# build both
pnpm -C portfolio-astro build
pnpm -C ogur-next build

# production up
docker compose -f docker-compose.prod.yml up -d --build
```

## 🌐 Routing
- `dkarczewski.com` → Portfolio (Astro)
- `ogur.dev` → Next.js

For local Docker without domains, use `docker-compose.local.yml` with path-based routes (e.g., `/astro`, `/ogur`).

## 📄 License
MIT (or your choice).
