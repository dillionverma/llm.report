import { m } from "framer-motion";
import { ComponentProps } from "react";

interface OnboardingStepProps {
  step: number;
  currentStep: number;
}

export function OnboardingStep({ step, currentStep }: OnboardingStepProps) {
  let status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <m.div
      animate={status}
      className="relative flex h-10 w-10 items-center justify-center flex-row "
    >
      <m.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "tween",
          ease: "circOut",
        }}
        className="absolute inset-0 rounded-full bg-green-200"
      />
      <m.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: "#fff", // neutral
            borderColor: "#e5e5e5", // neutral-200
            color: "#a3a3a3", // neutral-400
          },
          active: {
            backgroundColor: "#fff",
            borderColor: "#64748B", // blue-500
            color: "#64748B", // blue-500
          },
          complete: {
            backgroundColor: "#22c55e", // green-500
            borderColor: "#22c55e", // green-500
            color: "#22c55e", // green-500
          },
        }}
        transition={{ duration: 0.2 }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold green-500"
      >
        <div className="flex items-center justify-center">
          {status === "complete" ? (
            <CheckIcon className="h-6 w-6 text-white" />
          ) : (
            <span>{step}</span>
          )}
        </div>
      </m.div>
    </m.div>
  );
}

export function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <m.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
