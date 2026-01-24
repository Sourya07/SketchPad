FROM node:22-alpine

WORKDIR /app
RUN corepack enable
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  libc6-compat
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY ./packages ./packages


COPY ./apps/ws ./apps/ws

RUN pnpm install 

EXPOSE 8080

CMD ["pnpm", "--filter", "ws", "run", "dev"]

