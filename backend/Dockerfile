FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy data directory (seed.json)
COPY data/ ./data/

# Copy backend files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma at runtime
RUN apk add --no-cache openssl

# Copy data
COPY --from=builder /app/data ./data

# Copy backend artifacts
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package*.json ./

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/server.js"]
