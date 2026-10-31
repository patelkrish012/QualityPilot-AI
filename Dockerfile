# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace config files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/
COPY packages/ai-engine/package*.json ./packages/ai-engine/
COPY packages/database/package*.json ./packages/database/
COPY packages/testing-engine/package*.json ./packages/testing-engine/

# Install ALL deps (including devDeps for build tools)
RUN npm install --include=dev

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma client FIRST
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build packages in order
RUN npm run build --workspace=@qualitypilot/types
RUN npm run build --workspace=@qualitypilot/ai-engine
RUN npm run build --workspace=@qualitypilot/database
RUN npm run build --workspace=@qualitypilot/testing-engine
RUN npm run build --workspace=@qualitypilot/api

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Copy workspace config
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/
COPY packages/ai-engine/package*.json ./packages/ai-engine/
COPY packages/database/package*.json ./packages/database/
COPY packages/testing-engine/package*.json ./packages/testing-engine/

# Install only production deps
RUN npm install --omit=dev

# Copy prisma schema for runtime migrations
COPY packages/database/prisma ./packages/database/prisma

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built files from builder
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/ai-engine/dist ./packages/ai-engine/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/testing-engine/dist ./packages/testing-engine/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "apps/api/dist/main"]
