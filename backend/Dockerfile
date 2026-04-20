FROM node:20-alpine AS builder

WORKDIR /app

# Copy data directory (seed.json)
COPY data/ ./data/

# Copy backend files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci

COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

# Copy data
COPY --from=builder /app/data ./data

# Copy backend artifacts
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package*.json ./

# Expose port
EXPOSE 3001

# Start: migrate → seed → serve
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/server.js"]
