"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserCostChart from "@/components/users/UserCostChart";
import UserTable from "@/components/users/UserTable";
import {
  Callout,
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
import { Sparkle } from "lucide-react";
import Link from "next/link";
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

export default function Users() {
  const [value, setValue] = useState<DateRangePickerValue>({
    from: sub(new Date(), { days: 7 }),
    to: add(new Date(), { days: 1 }),
    selectValue: "w",
  });

  console.log(value);
  return (
    <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
      <Col numColSpan={1}>
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
      </Col>

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
            <CardTitle>Cost Per User</CardTitle>
            <CardDescription>
              The total cost of the top 10 users from{" "}
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
            <CardDescription>A usage summary of the top users</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<>loading...</>}>
              <UserTable from={value.from} to={value.to} />
            </Suspense>
          </CardContent>
        </Card>
      </Col>
    </Grid>
  );
}

// export async function getServerSideProps(context: NextPageContext) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// }
