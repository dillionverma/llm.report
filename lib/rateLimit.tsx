import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ApiFunction<T> = (...args: any[]) => Promise<T>;

let requestQueue: Array<() => void> = [];
let lastExecuted = Date.now();
let totalRequests = 0;
let successfulRequests = 0;

const LoadingToast = ({ text }: { text: string }) => (
  <span className="flex flex-row justify-center items-center gap-2">
    {text}
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-5 h-5 text-gray-500 " />
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Open AI API has a rate limit of 5 requests per minute. We will fetch
          and cache your data. Feel free to leave this page and come back later.
        </p>
      </TooltipContent>
    </Tooltip>
  </span>
);

const limiter = () => {
  if (requestQueue.length === 0) return;
  const now = Date.now();
  const timeSinceLast = now - lastExecuted;
  const rateLimitTime = (60 * 1000) / 5;

  if (timeSinceLast < rateLimitTime) {
    setTimeout(limiter, rateLimitTime - timeSinceLast);
  } else {
    const task = requestQueue.shift();
    if (task) task();
    lastExecuted = Date.now();
    setTimeout(limiter, rateLimitTime);
  }
};

const estimateTime = () => {
  // 5 requests per minute
  const numRequests = totalRequests - successfulRequests;
  const time = (numRequests * 60) / 5;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  // add a set timeout to the toast to update the time every second

  return `Estimated time: ${minutes}m ${seconds}s`;
};

const ToastComponent = () => {
  const [timeLeft, setTimeLeft] = useState(estimateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(estimateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingToast
      text={`Loading data (${successfulRequests}/${totalRequests}) - ${timeLeft}`}
    />
  );
};

export const rateLimitQuery = <T extends unknown>(
  apiFn: ApiFunction<T>,
  ...args: any[]
): Promise<T> => {
  // const toastId = uuidv4();
  const toastId = "rate-limit-toast";

  toast.loading(() => <ToastComponent />, { id: toastId });

  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const data = await apiFn(...args);

        successfulRequests++;

        if (requestQueue.length === 0) {
          totalRequests = 0;
          successfulRequests = 0;
          // Update toast to show that request has completed.
          toast.success("Done!", { id: toastId });
        }

        resolve(data);
      } catch (error: any) {
        // Update toast to show that an error occurred.
        toast.error(`An error occurred during the request: ${error}`);
        reject(error);
      }
    });

    totalRequests++;
    limiter();
  });
};
