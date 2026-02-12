FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable \
  && pnpm config set node-linker hoisted \
  && pnpm config set ignore-scripts false \
  && pnpm install



COPY . .
RUN pnpm dlx prisma generate

EXPOSE 3000
CMD ["pnpm", "start:dev:docker"]

