# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/

RUN npm ci --workspace=@kly-rh/shared --workspace=@kly-rh/backend

COPY packages/shared/ packages/shared/
COPY packages/backend/ packages/backend/
COPY tsconfig.base.json ./

RUN npx prisma generate --schema=packages/backend/src/prisma/schema.prisma
RUN npm run build --workspace=@kly-rh/backend 2>/dev/null || npx tsc --project packages/backend/tsconfig.json

# --- Run stage ---
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/shared/ packages/shared/
COPY --from=build /app/packages/backend/package.json packages/backend/
COPY --from=build /app/packages/backend/dist/ packages/backend/dist/
COPY --from=build /app/packages/backend/src/prisma/ packages/backend/src/prisma/
COPY --from=build /app/node_modules/ node_modules/

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --schema=packages/backend/src/prisma/schema.prisma && node packages/backend/dist/index.js"]
