FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]