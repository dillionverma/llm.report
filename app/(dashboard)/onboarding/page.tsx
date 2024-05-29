"use client";
import { CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Card, Grid } from "@tremor/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const Onboarding = ({ className }: { className?: string }) => {
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState(false);

  const router = useRouter();

  return (
    <Suspense>
      <div
        className={cn(
          "flex flex-col items-center w-full max-w-xl space-y-4",
          className
        )}
      >
        <Grid numItems={1} className="gap-4 w-full items-center justify-center">
          <Card className="flex flex-col items-center">
            {step === 1 && (
              <>
                <CardHeader className="text-center font-bold">
                  Are you a business?
                </CardHeader>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="bg-black text-white rounded-lg px-4 py-2"
                    onClick={() => {
                      setStep(2);
                      setBusiness(true);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-black text-white rounded-lg px-4 py-2"
                    onClick={() => {
                      setStep(2);
                      setBusiness(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <CardHeader className="text-center font-bold">
                  Do you plan to self host or have us host?
                </CardHeader>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    className="bg-black text-white rounded-lg px-4 py-2"
                    onClick={() => {
                      if (business) {
                        router.push(
                          "https://github.com/dillionverma/llm.report"
                        );
                      } else {
                        router.push(
                          "https://github.com/dillionverma/llm.report"
                        );
                      }
                    }}
                  >
                    Self Hosting
                  </button>
                  <button
                    className="bg-black text-white rounded-lg px-4 py-2"
                    onClick={() => {
                      if (business) {
                        router.push("/logs");
                      } else {
                        router.push("/openai");
                      }
                    }}
                  >
                    You Host
                  </button>
                </div>
              </>
            )}
          </Card>
        </Grid>
      </div>
    </Suspense>
  );
};

export default Onboarding;
