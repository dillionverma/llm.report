import Docs from "@/app/(dashboard)/api-keys/docs";
import KeysTable from "@/app/(dashboard)/api-keys/keys-table";
import { preWrapperPlugin } from "@/lib/markdown/preWrapperPlugin";
import { Flex, Text, Title } from "@tremor/react";
import MarkdownIt from "markdown-it";
import { Suspense } from "react";
import {
  createDiffProcessor,
  createFocusProcessor,
  createHighlightProcessor,
  createRangeProcessor,
  defineProcessor,
  getHighlighter,
} from "shiki-processor";

const Curl = `
\`\`\`bash
curl https://api.openai.com/v1/chat/completions // [!code --] \\
curl https://api.openai.withlogging.com/v1/chat/completions // [!code ++] \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "X-Api-Key: Bearer $LLM_REPORT_API_KEY" // [!code ++] \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
`;

const JS = `

\`\`\`js
fetch("https://api.openai.com/v1/chat/completions", { // [!code --]
fetch("https://api.openai.withlogging.com/v1/chat/completions", { // [!code ++]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
    "X-Api-Key": \`Bearer \${process.env.LLM_REPORT_API_KEY}\`, // [!code ++]
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  }),
})
\`\`\`
`;

const Nodejs = `

\`\`\`js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
  basePath: "https://api.openai.com/v1",  // [!code --]
  basePath: "https://api.openai.withlogging.com/v1",  // [!code ++]
  baseOptions: { // [!code ++:5]
    headers: {
      "X-Api-Key": \`Bearer \${process.env.LLM_REPORT_API_KEY}\`, 
    },
  }
});

const openai = new OpenAIApi(configuration);
\`\`\`
`;

const Python = `
\`\`\`python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = "https://api.openai.com/v1"  // [!code --]
openai.api_base = "https://api.openai.withlogging.com/v1"  // [!code ++]

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Hello!"}
  ],
  headers={
    "X-Api-Key": "Bearer " + os.getenv("LLM_REPORT_API_KEY"), // [!code ++]
  }
)

print(completion.choices[0].message)
\`\`\`
`;

async function getMarkdownCode() {
  const highlighter = await getHighlighter({
    theme: "material-theme-palenight",
    processors: [
      createDiffProcessor(),
      createHighlightProcessor(),
      createFocusProcessor(),
      defineProcessor({
        name: "line",
        handler: createRangeProcessor({
          error: ["highlighted", "error"],
          warning: ["highlighted", "warning"],
        }),
        postProcess: ({ code }) => {
          const modifiedCode = code.replace(
            /(.withlogging)/g,
            '<span class="highlight-word">$1</span>'
          );
          // console.log("code", modifiedCode);
          return modifiedCode;
        },
      }),
    ],
  });

  // https://github.com/vuejs/vitepress/pull/1534/files
  const renderer = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, {
        lang,
        // theme: "material-theme-palenight",
      });
    },
  }).use(preWrapperPlugin);

  const curl = renderer.render(Curl);
  const js = renderer.render(JS);
  const nodejs = renderer.render(Nodejs);
  const python = renderer.render(Python);

  return {
    curl,
    js,
    nodejs,
    python,
  };
}

export default async function LogsPage() {
  const code = await getMarkdownCode();

  return (
    <div className="max-w-4xl space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>API Keys</Title>
          </div>
          <Text>
            LLM Report uses API keys to authenticate your requests to the LLM
            Report proxy API.
          </Text>
        </div>
      </Flex>

      <Suspense fallback={<></>}>
        <KeysTable />
      </Suspense>

      <Suspense fallback={<></>}>
        <Docs code={code} />
      </Suspense>
    </div>
  );
}
