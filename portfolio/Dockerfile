FROM node:20-alpine AS build
WORKDIR /app

# Kopiuj workspace config
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY portfolio/package.json ./portfolio/

# Install dependencies - USUŃ --filter
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

# Kopiuj source code
COPY portfolio ./portfolio

# Build portfolio
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