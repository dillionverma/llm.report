"use client";

import { OnboardingStep } from "@/components/onboarding/Step";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai, { OpenAI } from "@/lib/services/openai";
import useLocalStorage from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { Badge, Grid } from "@tremor/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const Step = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <div
    className={cn(
      "font-heading mt-6 scroll-m-20 text-xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
);

const Steps = ({ ...props }) => (
  <div
    className="[&>div]:step mb-8 ml-4 border-l pl-8 [counter-reset:step]"
    {...props}
  />
);

export const InstallSteps = () => {
  return (
    <Steps>
      <Step>
        Go to{" "}
        <a
          className="underline text-blue-500"
          target="_blank"
          href="https://platform.openai.com/account/usage"
        >
          https://platform.openai.com/account/usage
        </a>
      </Step>
      <Step>Open Chrome Network requests tab</Step>
      <p>Mac:</p>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          cmd + option + i
        </code>
      </pre>
      <p>Windows: </p>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          ctrl + shift + i
        </code>
      </pre>
      <Step>Find the GET request with the following URL</Step>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          https://api.openai.com/dashboard/billing/usage
        </code>
      </pre>
      <Step>Copy session token</Step>
      <p>It will be in the request headers under `authorization`</p>
      <p>It looks like this:</p>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          Bearer sess-rYyW10fURtEce3rYSS6QGRMnLziKwrRdZeDt
        </code>
      </pre>
      <Step>Paste the session token below</Step>
      <p>Only paste the token itself, remove the `Bearer` prefix</p>
      <pre className="my-2">
        <code className="bg-gray-100 p-2 rounded-md text-sm">
          sess-rYyW10fURtEce3rYSS6QGRMnLziKwrRdZeDt
        </code>
      </pre>
    </Steps>
  );
};

// Usage
const OnboardingDashboard = ({ className }: { className?: string }) => {
  const [step, setStep] = useState(1);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

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
    <Suspense>
      <div className={cn("flex flex-col w-full max-w-xl space-y-4", className)}>
        <Grid numItems={1} className="gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 flex-row items-center">
                <span>OpenAI Analytics</span>
                <Badge color="blue">✨ Free</Badge>
              </CardTitle>
              <CardDescription>( ~ 1 minute installation )</CardDescription>
              <CardDescription>
                If you&apos;re using OpenAI, you probably have no idea which
                model you&apos;re using, how much it costs you, or what your
                token usage is.
              </CardDescription>
              <CardDescription className="font-semibold">
                We built a dashboard to help you understand your usage and
                costs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <video
                src="https://cdn.llm.report/openai-demo.mp4"
                autoPlay
                loop
                muted
                className="rounded-xl border"
              />
            </CardContent>
          </Card>

          <Card>
            {/* <CardHeader>
              <CardTitle>OpenAI Session Token</CardTitle>
              <CardDescription>
               
              </CardDescription>
            </CardHeader> */}
            <CardHeader className="flex-row gap-4 items-center">
              <OnboardingStep step={1} currentStep={step} />
              <div className="flex flex-col justify-center gap-1.5">
                <CardTitle>OpenAI Session Token</CardTitle>
                <CardDescription>
                  Paste your OpenAI session token below to get started. We use
                  your OpenAI session token to call the OpenAI API and create
                  your dashboard. This does not cost you and we do not store
                  your key on our servers.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <InstallSteps />
              </ScrollArea>
              <Input
                type="text"
                name={LOCAL_STORAGE_KEY}
                onChange={onChange}
                required
                value={key as string}
                className="my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
                placeholder="sess-5q293fh..."
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
            </CardContent>
          </Card>
        </Grid>
      </div>
    </Suspense>
  );
};

//  {/* <div className={cn("flex flex-col w-full max-w-xl space-y-4", className)}>
//       <Grid numItems={1} className="gap-4 w-full">
//         <Card>
//           <Flex justifyContent="start" className="gap-4 mb-2">
//             <OnboardingStep step={1} currentStep={step} />
//             <Title>llm.report setup instructions</Title>
//           </Flex>
//           <Text>
//             We use your OpenAI session token to call the OpenAI API and create
//             your dashboard. This does not cost you and we do not store your key
//             on our servers.
//           </Text>

//           <InstallSteps />

//           <div className="mt-2">
//             {/* {!key && (
//               <button
//                 type="button"
//                 className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                 onClick={handleSubmit}
//               >
//                 <Key className="w-4 h-4 mr-2" />
//                 Create API Key
//               </button>
//             )} */}

//             <input
//               type="text"
//               name={LOCAL_STORAGE_KEY}
//               onChange={onChange}
//               required
//               value={key as string}
//               className="w-full my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
//               placeholder="sess-5q293fh..."
//             />

//             {/* <p className="text-sm text-gray-500 mt-1 inline-block">
//               Find API Key{" "}
//               <Link
//                 href="https://beta.openai.com/account/api-keys"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="underline"
//               >
//                 here.
//               </Link>
//             </p> */}
//           </div>
//         </Card>
//       </Grid>
//     </div>

export default OnboardingDashboard;
