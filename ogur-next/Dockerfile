FROM node:20-alpine AS build
WORKDIR /app

# Kopiuj tylko ogur package files
COPY ogur-next/package.json ogur-next/pnpm-lock.yaml* ./

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --ignore-workspace

# Kopiuj source
COPY ogur-next .

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]