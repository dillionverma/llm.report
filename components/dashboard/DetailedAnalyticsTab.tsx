import { Grid } from "@tremor/react";
import { Progress } from "@/components/ui/progress";
import MonthlyChartByMinute from "@/components/dashboard/MonthlyChartByMinute";
import Requests from "@/components/dashboard/Requests";
import Tokens from "@/components/dashboard/Tokens";
import { Category } from "@/lib/types";
import { useUsageData } from "@/lib/hooks/api/useUsageData";

interface DetailedAnalyticsTabProps {
  startDate: Date;
  endDate: Date;
  categories: Category[];
}

const DetailedAnalyticsTab = ({
  startDate,
  endDate,
  categories,
}: DetailedAnalyticsTabProps) => {
  const query = useUsageData(startDate, endDate);

  const successfulRequestCount = query.filter(
    (q) => q.status === "success"
  ).length;
  const errorRequestCount = query.filter((q) => q.status === "error").length;

  const estimateTime = () => {
    // 5 requests per minute
    const numRequests = query.length - successfulRequestCount;
    const time = (numRequests * 60) / 5;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `Estimated time: ${minutes}m ${seconds}s`;
  };

  return (
    <div className="relative">
      {successfulRequestCount !== query.length && (
        <div className="absolute z-10 w-full h-full rounded-lg backdrop-blur bg-white/20">
          <div className="flex items-center justify-center mt-32">
            {errorRequestCount === 0 ? (
              <div>
                <div>
                  Loading data ({successfulRequestCount}/{query.length}) -{" "}
                  {estimateTime()}
                </div>
                <Progress
                  value={(successfulRequestCount / query.length) * 100}
                  className="mt-4"
                />
                <p className="mt-2 text-xs w-80">
                  Open AI API has a rate limit of 5 requests per minute. We will
                  fetch and cache your data. Feel free to leave this page and
                  come back later.
                </p>
              </div>
            ) : (
              <div>
                An error occurred during the request. Please try again later.
              </div>
            )}
          </div>
        </div>
      )}
      <Grid className="gap-4 mt-6">
        <Grid numItemsMd={1} className="gap-4">
          <MonthlyChartByMinute
            startDate={startDate}
            endDate={endDate}
            categories={categories}
          />
        </Grid>
        <Grid numItemsMd={1} numItemsLg={3} className="gap-4">
          <Requests startDate={startDate} endDate={endDate} />
          <Tokens
            startDate={startDate}
            endDate={endDate}
            categories={categories}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailedAnalyticsTab;
