import Onboarding from "@/components/Onboarding";
import RequestTable from "@/components/RequestTable";
import { preWrapperPlugin } from "@/lib/markdown/preWrapperPlugin";
import { Card, Col, Grid, Title } from "@tremor/react";
import MarkdownIt from "markdown-it";
import { NextPageContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import {
  createDiffProcessor,
  createFocusProcessor,
  createHighlightProcessor,
  createRangeProcessor,
  defineProcessor,
  getHighlighter,
} from "shiki-processor";

export const Logs = ({
  code,
}: {
  code: {
    curl: string;
    js: string;
    nodejs: string;
    nodejslangchain: string;
    python: string;
  };
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [loading, setLoading] = useState(true);

  const [totalCount, setTotalCount] = useState(1); // set default to 1 for now

  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  useEffect(() => {
    if (status === "authenticated") {
      const apiUrl = `/api/v1/requests`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setTotalCount(data.totalCount);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [refreshKey, status]);

  return (
    <>
      {!loading && totalCount < 1 && (
        <Onboarding code={code} onRefresh={handleRefresh} />
      )}
      {!loading && totalCount > 0 && (
        <Grid numCols={1} numColsLg={1} className="gap-6 w-full">
          <Col numColSpan={1}>
            <Card className="shadow-none">
              <Title>OpenAI Logs</Title>
              <Suspense fallback={<></>}>
                <RequestTable key={refreshKey} />
              </Suspense>
            </Card>
          </Col>
          {/* <Col>
        <Card className="shadow-none">
          <Title>OpenAI Requests Details</Title>
      
        </Card>
      </Col> */}
        </Grid>
      )}
    </>
  );
};

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

const NodejsLangchain = `

\`\`\`js
import { ChatOpenAI } from "langchain/chat_models/openai";


const model = new ChatOpenAI(
  {},
  { // [!code ++]
    basePath: "https://api.openai.withlogging.com/v1", // [!code ++]
    baseOptions: { // [!code ++]
      headers: { // [!code ++]
        "X-Api-Key": \`Bearer \${process.env.LLM_REPORT_API_KEY}\`,  // [!code ++]
      }, // [!code ++]
    }, // [!code ++]
  } // [!code ++]
);

const out = await model.call("Hi!");
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

export async function getStaticProps(context: NextPageContext) {
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
  const nodejslangchain = renderer.render(NodejsLangchain);
  const python = renderer.render(Python);

  return {
    props: {
      code: {
        curl,
        js,
        nodejs,
        nodejslangchain,
        python,
      },
    },
  };
}

export default Logs;
