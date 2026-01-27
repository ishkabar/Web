FROM node:20-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

COPY package.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --no-frozen-lockfile

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