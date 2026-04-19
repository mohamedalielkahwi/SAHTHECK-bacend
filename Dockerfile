FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Copy all source files
COPY . .

# Generate prisma client
RUN pnpm exec prisma generate

# Build the app
RUN pnpm run build

# Verify dist exists
RUN ls -la /app/dist/

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec prisma generate && node dist/src/main"]