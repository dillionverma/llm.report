"use client";

import StripePortalButton from "@/components/StripePortalButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/hooks/user/useUser";
import { cn } from "@/lib/utils";
import { Grid, Title } from "@tremor/react";
import { m } from "framer-motion";
import { Check, Copy, CreditCard, Key, Send } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { OnboardingStep } from "./onboarding/Step";

let tabs = [
  { id: "curl", label: "curl" },
  { id: "js", label: "javascript" },
  { id: "nodejs", label: "node.js" },
  { id: "python", label: "python" },
];

interface OnboardingProps {
  code: {
    curl: string;
    js: string;
    nodejs: string;
    python: string;
  };
  onRefresh: () => void;
  className?: string;
  user_id?: boolean;
}

const Onboarding = ({
  code,
  className,
  onRefresh,
  user_id = false,
}: OnboardingProps) => {
  const { user, isLoading, subscribed } = useUser();
  const [step, setStep] = useState(1);
  const [key, setKey] = useState<string>();
  let [activeTab, setActiveTab] = useState(tabs[0].id);
  const [plan, setPlan] = useState("free");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  useEffect(() => {
    if (step === 2 && subscribed) setStep(3);
  }, [step, subscribed]);

  if (!user) return null;

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
      body: JSON.stringify({
        ...(user && { user_id: "myuser@example.com" }),
      }),
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

  return (
    <Suspense>
      <div className={cn("flex flex-col w-full max-w-xl space-y-4", className)}>
        <Grid numItems={1} className="gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle>End-User Analytics </CardTitle>
              <CardDescription>( ~ 1 minute installation )</CardDescription>
              <CardDescription>
                Building an AI product is hard. You probably have no idea who
                your power users are, how many requests they&apos;re making, or
                how much they&apos;re costing you.
              </CardDescription>
              <CardDescription className="font-semibold">
                Lets start answering your questions today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <video
                src="/users-demo.mp4"
                autoPlay
                loop
                muted
                className="rounded-xl border"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row gap-4 items-center">
              <OnboardingStep step={1} currentStep={step} />
              <div className="flex flex-col justify-center gap-1.5">
                <CardTitle>Create an LLM Report API Key</CardTitle>
                <CardDescription>
                  This key will be used to identify your requests so that you
                  can view your logs in the dashboard.
                </CardDescription>
              </div>
            </CardHeader>
            {key && (
              <CardContent>
                <Input
                  type="text"
                  name="name"
                  value={key}
                  className="w-full px-2 py-1 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg"
                />
              </CardContent>
            )}
            <CardFooter>
              {!key && (
                <Button onClick={handleSubmit}>
                  <Key className="w-4 h-4 mr-2" />
                  <span>Create API Key</span>
                </Button>
              )}

              {key && (
                <Button
                  className="gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(key);
                    toast.success("Copied to clipboard!");
                    setCopied(true);
                  }}
                >
                  {copied && <Check className="w-4 h-4" />}
                  {!copied && <Copy className="w-4 h-4" />}
                  <span>Copy to Clipboard</span>
                </Button>
              )}
            </CardFooter>
          </Card>
          <Card
            className={cn("", {
              "opacity-50 pointer-events-none": !key,
            })}
          >
            <CardHeader className="flex-row gap-4 items-center">
              <OnboardingStep step={2} currentStep={step} />
              <div className="flex flex-col justify-center gap-1.5">
                <CardTitle>Choose a plan</CardTitle>
                <CardDescription>
                  Choose a plan that fits your needs. We support developers,
                  startups, and teams of all sizes.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(v) => {
                  console.log(v);
                  setPlan(v);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    defaultValue="developer"
                    placeholder="Developer - $20/month"
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="free">Free - $0/month</SelectItem> */}
                  <SelectItem value="developer">
                    Developer - $20/month
                  </SelectItem>
                  <SelectItem value="startup">Startup - $60/month</SelectItem>
                  <SelectItem value="team">Team - $500/month</SelectItem>
                </SelectContent>
              </Select>
              <CardDescription className="mt-2">
                You can change your plan at any time.{" "}
                <Link href="/settings/billing" className="underline">
                  More details
                </Link>
                .
              </CardDescription>
            </CardContent>
            <CardFooter className="justify-between">
              {!subscribed && (
                <Button
                  className="gap-2"
                  onClick={() => {
                    const params = new URLSearchParams({
                      client_reference_id: user.id,
                    });
                    const url = `https://buy.stripe.com/test_9AQ7use7tcS5bhm289?${params.toString()}`;

                    window.open(url, "_blank");
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Add a Payment Method</span>
                </Button>
              )}

              {subscribed && user.stripe_customer_id && (
                <StripePortalButton
                  customerId={user.stripe_customer_id}
                  className="gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Manage Plan</span>
                </StripePortalButton>
              )}

              {/* <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 opacity-40 gap-2"
                // onClick={handleSubmit}
              >
                <span>Skip</span>
                <ArrowRightCircle className="w-4 h-4" />
              </button> */}
            </CardFooter>
          </Card>
          <Card
            className={cn("", {
              "opacity-50 pointer-events-none": !subscribed || !key,
            })}
          >
            <CardHeader className="flex-row gap-4 items-center">
              <OnboardingStep step={3} currentStep={step} />
              <div className="flex flex-col justify-center gap-1.5">
                <Title>Log your first request</Title>
                <CardDescription>
                  Update your code using the examples below, or just press the
                  button!
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
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
                      <m.span
                        layoutId="bubble"
                        className="absolute inset-0 z-10 bg-white mix-blend-difference"
                        style={{ borderRadius: 9999 }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 space-y-2">
                <m.div
                  className="md"
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleLog}>
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </Button>
              {/* <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleLog}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </button> */}
            </CardFooter>
          </Card>
        </Grid>
      </div>
    </Suspense>
  );
};

export default Onboarding;
