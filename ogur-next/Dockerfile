FROM node:20-alpine AS build
WORKDIR /app

# Kopiuj workspace files z parent (dla monorepo)
COPY ../pnpm-workspace.yaml ../package.json ../pnpm-lock.yaml ./
COPY package.json ./ogur-next/

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

COPY . ./ogur-next

WORKDIR /app/ogur-next
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/ogur-next/.next/standalone ./
COPY --from=build /app/ogur-next/.next/static ./.next/static
COPY --from=build /app/ogur-next/public ./public

EXPOSE 3000
CMD ["node", "server.js"]