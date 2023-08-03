"use client";

import { useCopyCode } from "@/lib/copyCode";
import { Card, Flex, Text, Title } from "@tremor/react";
import { motion } from "framer-motion";
import { useState } from "react";

const Docs = ({ code }: { code: any }) => {
  useCopyCode();
  let tabs = [
    { id: "curl", label: "curl" },
    { id: "js", label: "javascript" },
    { id: "nodejs", label: "node.js" },
    { id: "python", label: "python" },
  ];

  const [key, setKey] = useState<string>();
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <Card>
      <Flex justifyContent="start" className="gap-4 mb-2">
        {/* <Step step={1} currentStep={step} /> */}
        <Title>Log your first request</Title>
      </Flex>

      <Text>Update your code using the examples below.</Text>

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
  );
};

export default Docs;
