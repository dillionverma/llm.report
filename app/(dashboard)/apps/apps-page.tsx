"use client";

import UserOnboarding from "@/app/(dashboard)/users/user-onboarding";
import UserCostChart from "@/components/appids/AppCostChart";
import { AppTable } from "@/components/appids/AppTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCopyCode } from "@/lib/copyCode";
import { useLogCount } from "@/lib/hooks/useLogCount";
import { useUserCount } from "@/lib/hooks/useUserCount";
import {
  Col,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
  Grid,
} from "@tremor/react";
import {
  add,
  endOfDay,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  sub,
} from "date-fns";
import { Suspense, useState } from "react";

const dateSelectOptions = [
  {
    value: "tdy",
    text: "Today",
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  },
  {
    value: "3d",
    text: "Last 3 days",
    from: sub(new Date(), { days: 3 }),
    to: endOfDay(new Date()),
  },
  {
    value: "w",
    text: "Last 7 days",
    from: sub(new Date(), { days: 7 }),
    to: endOfDay(new Date()),
  },
  {
    value: "mtd",
    text: "This month",
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  },
  {
    value: "lm",
    text: "Last month",
    from: sub(startOfMonth(new Date()), { months: 1 }),
    to: startOfMonth(new Date()),
  },
  {
    value: "y",
    text: "This year",
    from: startOfYear(new Date()),
    to: endOfDay(new Date()),
  },
];

export default function UsersPage({ code }: { code: any }) {
  useCopyCode();
  const { userCount, handleChange, loading } = useUserCount();

  const { refetch } = useLogCount({});

  const [value, setValue] = useState<DateRangePickerValue>({
    from: sub(new Date(), { days: 7 }),
    to: add(new Date(), { days: 1 }),
    selectValue: "w",
  });

  return (
    <Suspense>
      {!loading && userCount < 1 && (
        <UserOnboarding
          code={code}
          onRefresh={() => {
            handleChange();
            refetch();
          }}
          user_id
        />
      )}

      {!loading && userCount >= 1 && (
        <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
          {/* <Col numColSpan={1}>
            <Callout
              title="New Feature - User Analytics"
              icon={Sparkle}
              color="green"
            >
              To start using this feature, follow the{" "}
              <Link href="/install" className="underline">
                installation instructions
              </Link>
              .
            </Callout>
          </Col> */}

          <Col numColSpan={1}>
            <DateRangePicker
              value={value}
              onValueChange={setValue}
              selectPlaceholder="Select"
            >
              {dateSelectOptions.map((option, index) => (
                <DateRangePickerItem key={index} {...option}>
                  {option.text}
                </DateRangePickerItem>
              ))}
            </DateRangePicker>
          </Col>

          <Col numColSpan={1}>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Cost Per App</CardTitle>
                <CardDescription>
                  The total cost of the top 10 apps from{" "}
                  {value.from && format(value.from, "yyyy-MM-dd")} to{" "}
                  {value.to && format(value.to, "yyyy-MM-dd")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<>loading...</>}>
                  <UserCostChart from={value.from} to={value.to} />
                </Suspense>
              </CardContent>
            </Card>
          </Col>
          <Col numColSpan={1}>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
                <CardDescription>
                  A usage summary of the top apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<>loading...</>}>
                  <AppTable from={value.from} to={value.to} />
                </Suspense>
              </CardContent>
            </Card>
          </Col>
        </Grid>
      )}
    </Suspense>
  );
}
