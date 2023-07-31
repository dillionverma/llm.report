import UserCostChart from "@/components/users/UserCostChart";
import UserTable from "@/components/users/UserTable";
import {
  Callout,
  Card,
  Col,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
  Grid,
  Subtitle,
  Title,
} from "@tremor/react";
import { format, startOfMonth, startOfYear, sub } from "date-fns";
import { ConstructionIcon } from "lucide-react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Suspense, useState } from "react";

const dateSelectOptions = [
  {
    value: "tdy",
    text: "Today",
    from: sub(new Date(), { days: 1 }),
  },
  {
    value: "3d",
    text: "Last 3 days",
    from: sub(new Date(), { days: 3 }),
  },
  {
    value: "w",
    text: "Last 7 days",
    from: sub(new Date(), { days: 7 }),
  },
  {
    value: "mtd",
    text: "This month",
    from: startOfMonth(new Date()),
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
  },
];

export default function Users() {
  const [value, setValue] = useState<DateRangePickerValue>({
    from: sub(new Date(), { days: 7 }),
    to: new Date(),
    selectValue: "w",
  });

  console.log(value);
  return (
    <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
      <Col numColSpan={1}>
        <Callout title="Alpha feature" icon={ConstructionIcon} color="blue">
          This feature is in alpha and may change at any time.
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
          <Title>Cost Per User</Title>
          <Subtitle>
            The total cost of the top 10 users from{" "}
            {value.from && format(value.from, "yyyy-MM-dd")} to{" "}
            {value.to && format(value.to, "yyyy-MM-dd")}
          </Subtitle>
          <Suspense fallback={<>loading...</>}>
            <UserCostChart from={value.from} to={value.to} />
          </Suspense>
        </Card>
      </Col>
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <Title>Cost Summary</Title>
          <Suspense fallback={<>loading...</>}>
            <UserTable from={value.from} to={value.to} />
          </Suspense>
        </Card>
      </Col>
    </Grid>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
