import Cost from "@/components/Cost";
import MonthlyChart from "@/components/MonthlyChart";
import Requests from "@/components/Requests";
import { useDialog } from "@/components/SettingsModal";
import { default as Tokens } from "@/components/Tokens";
import { CATEGORIES, LOCAL_STORAGE_KEY } from "@/lib/constants";
import { addMock, enableMocking } from "@/lib/mock-axios";
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
import axios from "axios";
import { add, format, startOfMonth, sub } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import subscription from "../fixtures/openai/subscription.json";
import usageDay1 from "../fixtures/openai/usage-day-1.json";
import usageRange from "../fixtures/openai/usage-range.json";

export default function KpiCardGrid() {
  const [value, setValue] = useState<DateRangePickerValue>([
    startOfMonth(new Date()),
    new Date(),
    "mtd",
  ]);

  const [subscribed, setSubscribed] = useState(false);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "");
  const [validKey, setValidKey] = useState(false);

  const { data } = useSession();
  useEffect(() => {
    (async () => {
      if (!data?.user) return;
      const res = await axios.get("/api/v1/me");
      console.log(res);

      const isSubscribed =
        res.data.user.subscriptions.filter(
          (sub: any) => sub.status === "active" || sub.status === "trialing"
        ).length > 0 ||
        res.data.user.payments.filter(
          (payment: any) => payment.status === "succeeded"
        ).length > 0;

      setSubscribed(isSubscribed);
    })();
  }, [data?.user]);

  useEffect(() => {
    const ping = async (): Promise<boolean> => {
      try {
        const res = await axios.get(
          "https://api.openai.com/dashboard/billing/subscription",
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );
        setValidKey(true);
        return true;
      } catch (e) {
        setValidKey(false);
        return false;
      }
    };

    (async () => {
      await ping();
    })();
  }, [key]);

  useEffect(() => {
    if (!value[0] || !value[1]) return;

    // // Only enable mocking if no user is logged in.
    if (!data?.user) {
      addMock(
        `https://api.openai.com/dashboard/billing/usage?start_date=${format(
          value[0],
          "yyyy-MM-dd"
        )}&end_date=${format(value[1], "yyyy-MM-dd")}`,
        { data: usageRange, status: 200 }
      );

      for (let i = 0; i < 300; i++) {
        const date = format(sub(value[1], { days: i }), "yyyy-MM-dd");
        addMock(`https://api.openai.com/v1/usage?date=${date}`, {
          data: usageDay1,
          status: 200,
        });
      }

      addMock("https://api.openai.com/dashboard/billing/subscription", {
        data: subscription,
        status: 200,
      });

      console.log("enabling mocking");

      enableMocking(true);
    } else {
      enableMocking(false);
    }
  }, [data?.user, value]);

  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES.filter((c) => c !== "Total Cost ($)")
  );

  const { openDialog } = useDialog();

  return (
    <div>
      <Flex className="lg:flex-row flex-col items-start lg:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>OpenAI Analytics</Title>

            {!data?.user && (
              <Badge
                className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                onClick={() => openDialog()}
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

            {!key && subscribed && (
              <Badge
                className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                onClick={() => openDialog()}
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
                className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                onClick={() => openDialog()}
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

            {key && subscribed && validKey && (
              <Badge
                className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                onClick={() => openDialog()}
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

            {key && subscribed && !validKey && (
              <Badge
                className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                onClick={() => openDialog()}
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
            onValueChange={setValue}
            dropdownPlaceholder="Select"
            options={[
              {
                value: "tdy",
                text: "Today",
                startDate: new Date(),
                endDate: add(new Date(), { days: 1 }),
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
              },
              {
                value: "100d",
                text: "Last 100 days (Max)",
                startDate: sub(new Date(), { days: 100 }),
              },
            ]}
            // minDate={sub(new Date(), { days: 100 })}
            maxDate={new Date()}
          />

          <MultiSelectBox
            // className="w-full"
            value={categories}
            onValueChange={(a) => setCategories(a as Category[])}
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

      <Card className="mt-4">
        <MonthlyChart
          startDate={value[0]}
          endDate={value[1]}
          categories={categories}
          defaultLoading={data?.user && (!subscribed || !validKey || !key)}
        />
      </Card>

      <Grid numColsMd={1} numColsLg={3} className="gap-6 mt-4">
        <Card>
          <Cost
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
        <Card>
          <Requests
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
        <Card>
          <Tokens
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
            defaultLoading={data?.user && (!subscribed || !validKey || !key)}
          />
        </Card>
      </Grid>

      {/* KPI section */}
      {/* <Grid numColsMd={2} className="mt-4 gap-4">
        <Card>
          <div className="h-28" />
        </Card>
        <Card>
          <div className="h-28" />
        </Card>
      </Grid> */}
    </div>
  );
}
