<a href="https://llm.report">
  <img alt="llm.report – an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts." src="https://cdn.llm.report/openai-demo.gif">
  <h1 align="center">llm.report</h1>
</a>

<p align="center">
  An open-source logging and analytics platform for OpenAI
</p>

<p align="center">
  <a href="https://twitter.com/llmreport">
    <img src="https://img.shields.io/twitter/follow/llmreport?style=flat&label=%40llmreport&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://news.ycombinator.com/item?id=32939407"><img src="https://img.shields.io/badge/Hacker%20News-255-%23FF6600" alt="Hacker News"></a>
  <a href="https://github.com/dillionverma/llm.report/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/dillionverma/llm.report?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#self-hosted-installation"><strong>Self Hosted Installation</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#implementation"><strong>Implementation</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

llm.report is an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.

Here are some of the features that llm.report provides out-of-the-box:

- [OpenaAI API Analytics](#openai-api-analytics)
- [Logs](#logs)
- [User Analytics](#user-analytics)

### OpenAI API Analytics

Dub provides a powerful analytics dashboard for your links, including geolocation, device, and browser information.

![OpenAI Analytics](https://cdn.llm.report/openai-demo.gif)

### Logs

You can easily configure custom domains on Dub – just add an A/CNAME record to your DNS provider and you're good to go. This is built on the [Vercel Domains API](https://domains-api.vercel.app/).

![Logs](https://cdn.llm.report/logs-demo.gif)

### User Analytics

You can easily generate and customize QR codes for your links, which can be used for flyers, posters, powerpoint presentations, etc.

![User Analytics](https://cdn.llm.report/users-demo.gif)

## Self-Hosted Installation

1. Copy `.env.example` into `.env.local` (create new file)

2. Setup local postgres db
   Run `docker-compose up -d` to run the postgres db using docker

3. Prisma migrate
   Run `yarn db:migrate:dev`

4. To start the server
   Run `yarn dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Typescript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Shadcn](https://ui.shadcn.com) – UI components
- [Postgres](https://www.postgresql.org/) – database
- [NextAuth.js](https://next-auth.js.org/) – auth
- [Stripe](https://stripe.com/) – payments

## Implementation

<!-- Dub is built as a standard Next.js application with [Middleware](https://nextjs.org/docs/advanced-features/middleware) to handle multi-tenancy, inspired by [the Vercel Platforms Starter Kit](https://github.com/vercel/platforms).

[Redis](https://redis.io/) is used as the caching layer for all short links.

[Clickhouse](https://clickhouse.com/) ([Tinybird](https://tinybird.com/)) is used as the analytics database for storing link click data.

[MySQL](https://www.mysql.com/) is used as the database for storing user data, project data, and link metadata. You can refer to the Prisma schema [here](/prisma/schema.prisma). -->

## Contributing

Here's how you can contribute:

- [Open an issue](https://github.com/dillionverma/llm.report/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/dillionverma/llm.report/pull) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/dillionverma/llm.report/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dillionverma/llm.report" />
</a>

## Author

- Dillion Verma ([@dillionverma](https://twitter.com/dillionverma))

## License

Inspired by [Dub](https://dub.sh), Dub is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find it here](https://github.com/dillionverma/llm.report/blob/main/LICENSE.md).
