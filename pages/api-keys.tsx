import { preWrapperPlugin } from "@/lib/markdown/preWrapperPlugin";
import { fetcher } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Card, Flex, Text, Title } from "@tremor/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { TrashIcon } from "lucide-react";
import MarkdownIt from "markdown-it";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { Fragment, Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createDiffProcessor,
  createFocusProcessor,
  createHighlightProcessor,
  createRangeProcessor,
  defineProcessor,
  getHighlighter,
} from "shiki-processor";
import useSWR, { mutate } from "swr";

const DeleteDialog = ({ id, hashed }: { id: string; hashed: string }) => {
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async () => {
    const res = await fetch(`/api/v1/keys/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    console.log(json);

    toast.success("Key deleted successfully!");

    mutate("/api/v1/keys");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete key
                  </Dialog.Title>

                  <>
                    <div className="mt-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium  mb-1 text-red-600"
                      >
                        Are you sure you want to delete this key? This action is
                        irreversible.
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={hashed}
                        disabled
                        placeholder="My key"
                        className="w-full px-2 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                      />
                    </div>

                    <div className="mt-4 space-x-2 flex justify-end">
                      <button
                        className="
                        bg-gray-100 text-gray-500 hover:text-gray-600
                        inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="text-white bg-red-400 hover:bg-red-500  inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none "
                        onClick={handleSubmit}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const KeyDialog = () => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);

    setTimeout(() => {
      setName("");
      setKey("");
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [name, setName] = useState<string>();
  const [key, setKey] = useState<string>();

  const handleSubmit = async () => {
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(json);

    toast.success("Key generated successfully!");

    setKey(json.key);
    mutate("/api/v1/keys");
    // closeModal();
  };

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  return (
    <>
      <Button type="button" onClick={openModal}>
        Create
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {!key ? "Create a new key" : "Your key"}
                  </Dialog.Title>

                  {!key ? (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={handleChange}
                          placeholder="My key"
                          className="w-full px-2 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={handleSubmit}
                        >
                          Create
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          This is your key. Keep it safe. You won&apos;t be able
                          to see it again.
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            name="name"
                            value={key}
                            // onChange={handleChange}
                            // placeholder="My key"
                            className="w-full px-2 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                          />
                          {/* Icon button to copy on click */}
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ml-2"
                            onClick={() => {
                              navigator.clipboard.writeText(key);
                              toast.success("Copied to clipboard!");
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Done
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
    },
  },
  out: {
    opacity: 0.5,
    scale: 0.98,
    transition: {
      duration: 1,
    },
  },
};

const ApiKeys = ({
  code,
}: {
  code: {
    curl: string;
    js: string;
    nodejs: string;
    python: string;
  };
}) => {
  const { data: keys, error, isLoading } = useSWR("/api/v1/keys", fetcher);
  const { data } = useSession();
  const [value, setValue] = useState("js");
  let [isKeyDialogOpen, setKeyDialogOpen] = useState(false);

  let tabs = [
    { id: "curl", label: "curl" },
    { id: "js", label: "javascript" },
    { id: "nodejs", label: "node.js" },
    { id: "python", label: "python" },
  ];

  const [step, setStep] = useState(1);
  const [key, setKey] = useState<string>();
  let [activeTab, setActiveTab] = useState(tabs[0].id);

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
      {/* <Callout
        className="my-4"
        title="This feature is currently in alpha"
        icon={FlaskConical}
        color="blue"
      >
        API keys are used to authenticate your requests to the LLM Report proxy
        API.
      </Callout> */}
      {/* <Callout
        className="my-4"
        title="Don't put your OpenAI API key here. "
        icon={ExclamationCircleIcon}
        color="red"
      >
        This is for the LLM Report API. If you want to enter your OpenAI API
        key, you can do so{" "}
        <Link href="/settings" className="underline">
          here
        </Link>
        .
      </Callout> */}
      <Suspense fallback={<></>}>
        <Card className="shadow-none">
          <div className="overflow-scroll p-2">
            {data?.user && !isLoading && keys?.keys && keys.keys.length > 0 && (
              <table className="w-full table-auto text-sm text-left">
                <thead className=" text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Key</th>
                    <th className="py-3 px-6">Created</th>
                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {!isLoading &&
                    keys.keys &&
                    keys.keys.map((key: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {key.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {key.sensitive_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(key.createdAt), "MMM dd, yyyy")}
                        </td>

                        <td className="text-right px-6 whitespace-nowrap">
                          <DeleteDialog id={key.id} hashed={key.sensitive_id} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            <KeyDialog />
          </div>
        </Card>
      </Suspense>

      <Suspense fallback={<></>}>
        <Card>
          <Flex justifyContent="start" className="gap-4 mb-2">
            {/* <Step step={1} currentStep={step} /> */}
            <Title>Log your first request</Title>
          </Flex>

          <Text>
            Update your code using the examples below, or just press the button!
          </Text>

          <div className="mt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id ? "" : "hover:text-black/60"
                } relative rounded-full px-3 py-1.5 text-sm font-medium text-black outline-sky-400 transition focus-visible:outline-2`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-10 bg-white mix-blend-difference"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-2 space-y-2">
            <motion.div
              className="md"
              // layoutId={"bubble"} // Add a layoutId for shared layout animations
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              dangerouslySetInnerHTML={{
                __html:
                  activeTab === "curl"
                    ? code.curl.replace(
                        "$LLM_REPORT_API_KEY",
                        key || "$LLM_REPORT_API_KEY"
                      )
                    : activeTab === "js"
                    ? code.js.replace(
                        "${process.env.LLM_REPORT_API_KEY}",
                        key || "process.e"
                      )
                    : activeTab === "nodejs"
                    ? code.nodejs.replace(
                        "${process.env.LLM_REPORT_API_KEY}",
                        key || "process.e"
                      )
                    : activeTab === "python"
                    ? code.python.replace(
                        'os.getenv("OPENAI_API_KEY")',
                        key || 'os.getenv("OPENAI_API_KEY")'
                      )
                    : "",
              }}
            />
          </div>
        </Card>
      </Suspense>
    </div>
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

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

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

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      code: {
        curl,
        js,
        nodejs,
        python,
      },
    },
  };
}

export default ApiKeys;
