This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## Local Setup

1. Copy `.env.example` into `.env.local` (create new file)

2. Setup local postgres db
   Run `docker-compose up -d` to run the postgres db using docker

3. Prisma migrate
   Run `yarn db:migrate:dev`

4. To start the server
   Run `yarn dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Setup

1. Copy `.env.example` into `.env` (create new file)

2. Setup production postgres db

3. Prisma migrate
   Run `yarn db:migrate:prod`
