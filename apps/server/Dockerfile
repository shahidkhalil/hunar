FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/config ./packages/config
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages ./packages
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# Generate Prisma client
RUN pnpm exec prisma generate

# Build
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/apps/server/package.json ./package.json

EXPOSE 4000

CMD ["node", "dist/index.js"]

