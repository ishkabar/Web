FROM node:20-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

COPY package.json ./

RUN corepack enable && corepack prepare pnpm@10.18.2 --activate && \
    pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content

EXPOSE 3000
CMD ["node", "server.js"]