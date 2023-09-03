"use client";

import StripePortalButton from "@/components/StripePortalButton";
import { OnboardingStep } from "@/components/onboarding/Step";
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
import { subscriptionPlans } from "@/lib/stripe/subscriptionPlans";
import { cn } from "@/lib/utils";
import { Badge, Grid, Title } from "@tremor/react";
import { m } from "framer-motion";
import {
  ArrowRightCircle,
  Check,
  Copy,
  CreditCard,
  Key,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

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
  onRefresh?: () => void;
  className?: string;
  user_id?: boolean;
}

const UserOnboarding = ({
  code,
  className,
  onRefresh = () => {},
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

  const handleSkip = () => {
    setStep(3);
  };

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

  const handlePayment = async () => {
    const params = new URLSearchParams({
      client_reference_id: user.id,
    });

    const paymentLink =
      subscriptionPlans[
        process.env.NODE_ENV as "development" | "production" | "test"
      ][plan as "free" | "pro"]["monthly"];

    const url = `${paymentLink}?${params.toString()}`;

    window.open(url, "_blank");
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
      <div
        className={cn(
          "flex flex-col items-center w-full h-full lg:flex-row",
          className
        )}
      >
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 ">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <span>End-User Analytics </span>
                  <Badge color="blue">✨ Free</Badge>
                </CardTitle>
                <CardDescription>( ~ 1 minute installation )</CardDescription>
                <CardDescription>
                  Building an AI product is hard. You probably have no idea who
                  your power users are, how many requests they&apos;re making,
                  or how much they&apos;re costing you.
                </CardDescription>
                <CardDescription className="font-semibold">
                  Lets start answering these questions today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <video
                  src="https://cdn.llm.report/users-demo.mp4"
                  autoPlay
                  loop
                  muted
                  className="border rounded-xl"
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-center gap-4">
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
                    className="w-full px-2 py-1 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none"
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
              <CardHeader className="flex-row items-center gap-4">
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
                      defaultValue="free"
                      placeholder="Free - $0/month"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - $0/month</SelectItem>
                    <SelectItem value="pro">Pro - $20/month</SelectItem>
                    {/* <SelectItem value="startup">Startup - $20/month</SelectItem> */}
                    {/* <SelectItem value="team">Team - $500/month</SelectItem> */}
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
              <CardFooter className="max-md:space-y-2 max-md:flex-col md:justify-between">
                {!subscribed && (
                  <Button className="gap-2" onClick={handlePayment}>
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

                <Button
                  className="gap-2 max-md:w-52"
                  variant="outline"
                  onClick={handleSkip}
                >
                  <span>Skip</span>
                  <ArrowRightCircle className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card
              className={cn("", {
                "opacity-50 pointer-events-none": !key || step < 3,
              })}
            >
              <CardHeader className="flex-row items-center gap-4">
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
                        activeTab === tab.id ? "" : "hover:text-indigo-400"
                      } relative rounded-full px-3 py-1.5 text-sm font-medium text-custom outline-sky-400 transition focus-visible:outline-2`}
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
                          ? code?.curl.replace(
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
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleLog}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </button> */}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default UserOnboarding;
