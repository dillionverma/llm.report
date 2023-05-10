import { useDialog } from "@/components/SettingsModal";
import Cost from "@/components/dashboard/Cost";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import Requests from "@/components/dashboard/Requests";
import { default as Tokens } from "@/components/dashboard/Tokens";
import { CATEGORIES, CATEGORIES_KEY, LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/services/openai";
import { Category } from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import {
  Badge,
  Card,
  DateRangePicker,
  DateRangePickerValue,
  Flex,
  Grid,
  MultiSelectBox,
  MultiSelectBoxItem,
  Text,
  Title,
} from "@tremor/react";
import { add, startOfMonth, sub } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [value, setValue] = useState<DateRangePickerValue>([
    startOfMonth(new Date()),
    startOfMonth(new Date()) === new Date()
      ? new Date()
      : add(new Date(), { days: 1 }),
    "mtd",
  ]);

  const setDates = (v: DateRangePickerValue) => {
    // Edge case due to OpenAI API. They don't accept start_date === end_date.
    if (v[0] && v[1] && v[0].getTime() === v[1].getTime()) {
      return setValue([v[0], add(v[1], { days: 1 }), v[2]]);
    } else {
      setValue(v);
    }
  };

  const [subscribed, setSubscribed] = useState(true);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  const [validKey, setValidKey] = useState(false);
  const { openDialog } = useDialog();
  const { data } = useSession();
  // useEffect(() => {
  //   (async () => {
  //     if (!data?.user) return;
  //     const res = await axios.get("/api/v1/me");
  //     console.log(res);

  //     const isSubscribed =
  //       res.data.user.subscriptions.filter(
  //         (sub: any) => sub.status === "active" || sub.status === "trialing"
  //       ).length > 0 ||
  //       res.data.user.payments.filter(
  //         (payment: any) => payment.status === "succeeded"
  //       ).length > 0;

  //     setSubscribed(isSubscribed);
  //   })();
  // }, [data?.user]);

  useEffect(() => {
    (async () => setValidKey(await openai.isValidKey(key)))();
  }, [key]);

  // const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    CATEGORIES_KEY,
    CATEGORIES
  );

  return (
    <div>
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>OpenAI Analytics</Title>

            {!data?.user && (
              <Badge
                className="px-3 space-x-2 transition-all transform duration-200 ease-in-out"
                // onClick={() => openDialog()}
                color="blue"
                icon={() => (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )}
              >
                demo
              </Badge>
            )}

            {data?.user && !key && subscribed && (
              <Badge
                className="px-3 space-x-2 transition-all transform duration-200 ease-in-out"
                // onClick={() => openDialog()}
                color="red"
                icon={() => (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              >
                waiting for key
              </Badge>
            )}

            {data?.user && !subscribed && (
              <Badge
                className="px-3 space-x-2 transition-all transform duration-200 ease-in-out"
                // onClick={() => openDialog()}
                color="red"
                icon={() => (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              >
                waiting for subscription
              </Badge>
            )}

            {data?.user && key && validKey && (
              <Badge
                className="px-3 space-x-2 transition-all transform duration-200 ease-in-out"
                // onClick={() => openDialog()}
                color="green"
                icon={() => (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
              >
                live
              </Badge>
            )}

            {data?.user && key && !validKey && (
              <Badge
                className="px-3 space-x-2 transition-all transform duration-200 ease-in-out"
                // onClick={() => openDialog()}
                color="red"
                icon={() => (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              >
                invalid key
              </Badge>
            )}
          </div>

          <Text>Let&apos;s see how we&apos;re doing today</Text>
        </div>

        <div className="w-full max-w-2xl items-end flex md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 flex-col">
          <DateRangePicker
            value={value}
            onValueChange={setDates}
            dropdownPlaceholder="Select"
            options={[
              {
                value: "tdy",
                text: "Today",
                startDate: new Date(),
              },
              {
                value: "3d",
                text: "Last 3 days",
                startDate: sub(new Date(), { days: 3 }),
              },
              {
                value: "w",
                text: "Last 7 days",
                startDate: sub(new Date(), { days: 7 }),
              },
              {
                value: "mtd",
                text: "Month to date",
                startDate: startOfMonth(new Date()),
              },
              {
                value: "m",
                text: "Last 30 days",
                startDate: sub(new Date(), { days: 30 }),
                // utc end date
                endDate: new Date(),
              },
              {
                value: "100d",
                text: "Last 100 days (Max)",
                startDate: sub(new Date(), { days: 100 }),
              },
            ]}
            // minDate={sub(new Date(), { days: 100 })}
            // maxDate={new Date()}
          />

          <MultiSelectBox
            // className="w-full"
            value={categories}
            onValueChange={(a) => {
              console.log("VALUE CHANGE", a);
              setCategories(a as Category[]);
            }}
          >
            {CATEGORIES.map((category, index) => (
              <MultiSelectBoxItem
                key={index}
                value={category}
                text={category}
              />
            ))}
          </MultiSelectBox>
        </div>
      </Flex>

      <Card className="mt-4 shadow-none">
        <MonthlyChart
          startDate={value[0]}
          endDate={value[1]}
          categories={categories}
          demo={!data?.user}
          defaultLoading={data?.user && (!subscribed || !validKey || !key)}
        />
      </Card>

      <Grid numColsMd={1} numColsLg={3} className="gap-6 mt-4">
        <Card className="shadow-none">
          <Cost
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            demo={!data?.user}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
        <Card className="shadow-none">
          <Requests
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            demo={!data?.user}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
        <Card className="shadow-none">
          <Tokens
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            demo={!data?.user}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
      </Grid>
    </div>
  );
}
