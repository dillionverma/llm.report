<a href="https://llm.report">
  <img alt="llm.report – an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts." src="https://cdn.llm.report/openai-demo.gif" width="100%">
  <h1 align="center">llm.report</h1>
  <p align="center"><b>An open-source logging and analytics platform for OpenAI</b></p>
</a>

<h4 align="center">
  <a href="https://twitter.com/llmreport">
    <img src="https://img.shields.io/twitter/follow/llmreport?style=flat&label=%40llmreport&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://github.com/dillionverma/llm.report/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/dillionverma/llm.report?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/dillionverma/llm.report/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/dillionverma/llm.report/issues">
    <img src="https://img.shields.io/github/commit-activity/m/dillionverma/llm.report" alt="git commit activity" />
  </a>
  <a href="https://llm.report/discord">
    <img src="https://img.shields.io/badge/chat-on%20Discord-blueviolet" alt="Discord Channel" />
  </a>

</h4>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#self-hosted-installation"><strong>Self Hosted Installation</strong></a> ·
  <a href="#cloud-installation"><strong>Cloud Installation</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

llm.report is an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.

Here are some of the features that llm.report provides out-of-the-box:

- [OpenAI API Analytics](#openai-api-analytics)
- [Logs](#logs)
- [User Analytics](#user-analytics)

### OpenAI API Analytics

No-code solution to analyze your OpenAI API costs and token usage.

<a href="https://docs.llm.report/features/openai">
  <img alt="llm.report – an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts." src="https://cdn.llm.report/openai-demo.gif" width="100%">
</a>

### Logs

Log your OpenAI API requests / responses and analyze them to improve your prompts.

<a href="https://docs.llm.report/features/logs">
  <img alt="llm.report – an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts." src="https://cdn.llm.report/logs-demo.gif" width="100%">
</a>

### User Analytics

Calculate the cost per user for your AI app.

<a href="https://docs.llm.report/features/users">
  <img alt="llm.report – an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts." src="https://cdn.llm.report/users-demo.gif" width="100%">
</a>

## Self-Hosted Installation

1. Clone the repo

```bash
git clone https://github.com/dillionverma/llm.report.git
```

2. cd into the repo

```bash
cd llm.report
```

3. Install dependencies

```bash
yarn
```

4. Setup environment variables

```bash
cp .env.example .env
```

- Generate `NEXTAUTH_SECRET` using `openssl rand -base64 32` and add it to `.env`

5. Quickstart

> Requires Docker and Docker Compose to be installed
> Will start a local Postgres instance with a few test users - the credentials will be logged in the console

```bash
yarn dx
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> We're still working on making this as streamlined as possible. If you run into any issues, please open an issue or reach out to us on [Discord](https://llm.report/discord).

## Cloud Installation

Head over to [llm.report](https://llm.report) to get started for free or schedule a call with the founders for a demo.

<a href="https://cal.com/dillionverma/llm-report-demo"><img alt="Schedule a meeting" src="https://cal.com/book-with-cal-dark.svg" /></a>

Email: [dillion@llm.report](mailto:dillion@llm.report)

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Typescript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Shadcn](https://ui.shadcn.com) – App UI components
- [Magic UI](https://magicuikit.com/) – Marketing UI components
- [Postgres](https://www.postgresql.org/) – database
- [NextAuth.js](https://next-auth.js.org/) – auth
- [Stripe](https://stripe.com/) – payments

## Contributing

Here's how you can contribute:

- [Open an issue](https://github.com/dillionverma/llm.report/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/dillionverma/llm.report/pull) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/dillionverma/llm.report/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dillionverma/llm.report" />
</a>

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=dillionverma/llm.report&type=Date)

## License

Inspired by [Dub](https://dub.sh) and [Plausible](https://plausible.io), both are open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find it here](https://github.com/dillionverma/llm.report/blob/main/LICENSE). The reason for this is that we believe in the open-source ethos and want to contribute back to the community.

## Credits

- [OpenAI](https://openai.com/) – for creating ChatGPT
- [shadcn-ui](https://ui.shadcn.com) – for making it easy to build beautiful UIs
- [tremor.so](https://tremor.so) – beautiful dashboard componenets
- [mintlify](https://mintlify.com) – beautiful documentation
- [screen.studio](https://screen.studio) – the best video recording tool
- [vercel](https://vercel.com) – for making next.js and making it easy to build powerful apps
- [Dub](https://dub.sh) – for inspiring me to open-source this project
