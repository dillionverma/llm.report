import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai, { OpenAI } from "@/lib/services/openai";
import useLocalStorage from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { Card, Flex, Grid, Text, Title } from "@tremor/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Step } from "./onboarding/Step";

let tabs = [
  { id: "curl", label: "curl" },
  { id: "js", label: "javascript" },
  { id: "nodejs", label: "node.js" },
  { id: "python", label: "python" },
];

// Usage
const OnboardingDashboard = ({
  className,
}: // onRefresh,
// onRefresh,
{
  // onRefresh: () => void;
  className?: string;
}) => {
  const [step, setStep] = useState(1);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === LOCAL_STORAGE_KEY) {
      setKey(value);
      OpenAI.setKey(value);
    }
  };

  useEffect(() => {
    (async () => {
      const isValid = await openai.isValidKey(key);

      if (isValid) {
        setStep(2);
        await new Promise((r) => setTimeout(r, 500));
      }
    })();
  }, [key]);

  return (
    <div className={cn("flex flex-col w-full max-w-xl space-y-4", className)}>
      <Grid numItems={1} className="gap-4 w-full">
        <Card>
          <Flex justifyContent="start" className="gap-4 mb-2">
            <Step step={1} currentStep={step} />
            <Title>Enter your OpenAI API Key</Title>
          </Flex>
          <Text>
            We use your key to call the OpenAI API and create your dashboard.
            This does not cost you and we do not store your key on our servers.
          </Text>

          <div className="mt-2">
            {/* {!key && (
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleSubmit}
              >
                <Key className="w-4 h-4 mr-2" />
                Create API Key
              </button>
            )} */}

            <input
              type="text"
              name={LOCAL_STORAGE_KEY}
              onChange={onChange}
              required
              value={key as string}
              className="w-full my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
              placeholder="sk-5q293fh..."
            />

            <p className="text-sm text-gray-500 mt-1 inline-block">
              Find API Key{" "}
              <Link
                href="https://beta.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                here.
              </Link>
            </p>
          </div>
        </Card>
      </Grid>
    </div>
  );
};

export default OnboardingDashboard;
