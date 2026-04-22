# ---- deps stage ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# ---- builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl \
 && mkdir -p public \
 && npx prisma generate \
 && npm run build \
 && npx esbuild prisma/seed.ts --bundle --platform=node --packages=external --outfile=prisma/seed.js

# ---- runner stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user and persistent data directory
RUN apk add --no-cache openssl \
 && addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs \
 && mkdir -p /data \
 && chown nextjs:nodejs /data

# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public

# Prisma: schema + generated client + full CLI package + compiled seed
COPY --from=builder --chown=nextjs:nodejs /app/prisma                ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma  ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma   ./node_modules/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

ENTRYPOINT ["./docker-entrypoint.sh"]
