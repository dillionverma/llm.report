import { cn } from "@/lib/utils";
import { Card, Flex, Grid, Text, Title } from "@tremor/react";
import { motion } from "framer-motion";
import { Key, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Step } from "./onboarding/Step";

let tabs = [
  { id: "curl", label: "curl" },
  { id: "js", label: "javascript" },
  { id: "nodejs", label: "node.js" },
  { id: "python", label: "python" },
];

// Usage
const Onboarding = ({
  code,
  className,
  onRefresh,
}: {
  code: {
    curl: string;
    js: string;
    nodejs: string;
    python: string;
  };
  onRefresh: () => void;
  className?: string;
}) => {
  const [step, setStep] = useState(1);
  const [key, setKey] = useState<string>();
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleSubmit = async () => {
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      body: JSON.stringify({ name: "onboarding" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(json);

    toast.success("Key generated successfully!");

    setStep(2);

    setKey(json.key);
    mutate("/api/v1/keys");
  };

  const handleLog = async () => {
    const res = await fetch("/api/v1/requests/insert-demo", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(json);

    toast.success("First Log generated successfully!");

    setStep(3);
    onRefresh();
  };

  // useEffect(() => {
  //   const copy = document.querySelectorAll(".copy");

  //   console.log(copy);

  //   copy?.forEach((pre) => {
  //     pre.classList.add("relative");

  //     const btn = document.createElement("button");
  //     btn.className =
  //       "absolute right-0 top-0 bg-gray-700 text-white text-sm p-2 rounded-bl-md";
  //     btn.innerText = "Copy";
  //     btn.addEventListener("click", () => {
  //       const code = pre.querySelector("code")?.innerText;
  //       if (code) {
  //         navigator.clipboard.writeText(code);
  //       }

  //       btn.innerText = "Copied!";
  //       setTimeout(() => {
  //         btn.innerText = "Copy";
  //       }, 1000);
  //     });

  //     pre.appendChild(btn);
  //   });
  // }, [code]);

  return (
    <div className={cn("flex flex-col w-full max-w-xl space-y-4", className)}>
      <Grid numCols={1} className="gap-4 w-full">
        <Card>
          <Flex justifyContent="start" className="gap-4 mb-2">
            <Step step={1} currentStep={step} />
            <Title>Create an LLM Report API Key</Title>
          </Flex>
          <Text>
            This key will be used to identify your requests so that you can view
            your OpenAI API logs in the dashboard.
          </Text>

          <div className="mt-2">
            {!key && (
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleSubmit}
              >
                <Key className="w-4 h-4 mr-2" />
                Create API Key
              </button>
            )}

            {key && (
              <input
                type="text"
                name="name"
                value={key}
                // onChange={handleChange}
                // placeholder="My key"
                className="w-full px-2 py-1 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg"
              />
            )}
          </div>
        </Card>
        <Card
          className={cn("", {
            "opacity-50 pointer-events-none": !key,
          })}
        >
          <Flex justifyContent="start" className="gap-4 mb-2">
            <Step step={2} currentStep={step} />
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
            <button
              type="button"
              className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={handleLog}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Request
            </button>
          </div>
        </Card>
      </Grid>
    </div>
  );
};

export default Onboarding;
