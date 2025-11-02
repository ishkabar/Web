FROM node:20-alpine AS build
WORKDIR /app

# Kopiuj workspace files z parent directory
COPY ../pnpm-workspace.yaml ../pnpm-lock.yaml ../package.json ./
COPY package.json ./portfolio/

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

# Kopiuj portfolio source
COPY . ./portfolio

WORKDIR /app/portfolio
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/portfolio/.next/standalone ./
COPY --from=build /app/portfolio/.next/static ./.next/static
COPY --from=build /app/portfolio/public ./public

EXPOSE 3000
CMD ["node", "server.js"]