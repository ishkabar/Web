FROM node:20-alpine AS build
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY portfolio/package.json ./portfolio/

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

COPY portfolio ./portfolio

WORKDIR /app/portfolio
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/portfolio/.next/standalone ./
COPY --from=build /app/portfolio/.next/static ./portfolio/.next/static
COPY --from=build /app/portfolio/public ./portfolio/public

EXPOSE 3000
CMD ["node", "portfolio/server.js"]