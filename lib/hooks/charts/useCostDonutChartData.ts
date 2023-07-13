import { CATEGORY_TO_COLOR } from "@/lib/constants";
import { useBillingData } from "@/lib/hooks/api/useBillingData";
import { Category } from "@/lib/types";

export const useCostDonutChartData = (
  startDate: Date,
  endDate: Date,
  categories: Category[]
) => {
  const billingData = useBillingData(startDate, endDate);

  const { isLoading } = billingData;

  if (billingData.isLoading || billingData.isError) {
    return { billing: billingData.data, chartData: [], isLoading };
  }

  const cumulativeTotalCost = billingData.data.daily_costs.reduce(
    (acc, { line_items }) =>
      line_items.reduce((innerAcc, { name, cost }) => {
        if (!categories.includes(name as Category)) {
          return innerAcc;
        }
        // @ts-ignore
        if (!innerAcc[name]) {
          // @ts-ignore
          innerAcc[name] = 0;
        }
        // @ts-ignore
        innerAcc[name] += cost;
        return innerAcc;
      }, acc),
    {}
  );

  const data = Object.entries(cumulativeTotalCost)
    .map(([name, cost]) => ({
      name,
      cost: (cost as number) / 100,
      color: CATEGORY_TO_COLOR[name as Category],
    }))
    .filter(({ name }) => categories.includes(name as Category));

  return { billing: billingData.data, chartData: data, isLoading };
};
