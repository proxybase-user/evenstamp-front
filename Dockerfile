# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS builder
WORKDIR /src

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone

COPY package.json package-lock.json ./
COPY frontend-sdk/package.json ./frontend-sdk/
COPY nextjs-web/package.json ./nextjs-web/
RUN npm ci

COPY frontend-sdk ./frontend-sdk
COPY nextjs-web ./nextjs-web
RUN npm --workspace @evenstamp/web run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 10001 evenstamp \
    && useradd --system --uid 10001 --gid evenstamp --home /app evenstamp

COPY --from=builder --chown=evenstamp:evenstamp /src/nextjs-web/.next/standalone ./
COPY --from=builder --chown=evenstamp:evenstamp /src/nextjs-web/.next/static ./nextjs-web/.next/static
COPY --from=builder --chown=evenstamp:evenstamp /src/nextjs-web/public ./nextjs-web/public

USER evenstamp
EXPOSE 3000
CMD ["node", "nextjs-web/server.js"]
