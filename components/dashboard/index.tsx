import { useDialog } from "@/components/SettingsModal";
import Cost from "@/components/dashboard/Cost";
import CostChart from "@/components/dashboard/CostChart";
import GeneratedTokenChart from "@/components/dashboard/GeneratedTokenChart";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import MonthlyChartByMinute from "@/components/dashboard/MonthlyChartByMinute";
import RequestChart from "@/components/dashboard/RequestChart";
import Requests from "@/components/dashboard/Requests";
import Tokens from "@/components/dashboard/Tokens";
import {
  CATEGORIES,
  CATEGORIES_KEY,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_ORG_ID,
} from "@/lib/constants";
import openai, { OpenAI } from "@/lib/services/openai";
import { Category, OrganizationUsers } from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import {
  Badge,
  Card,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
  Flex,
  Grid,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  Text,
  Title,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import { add, startOfMonth, sub } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContextTokenChart from "./ContextTokenChart";

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
    text: "Month to date",
    from: startOfMonth(new Date()),
  },
  {
    value: "m",
    text: "Last 30 days",
    from: sub(new Date(), { days: 30 }),
    // utc end date
    to: new Date(),
  },
  {
    value: "100d",
    text: "Last 100 days (Max)",
    from: sub(new Date(), { days: 100 }),
  },
];

export default function Dashboard() {
  const [value, setValue] = useState<DateRangePickerValue>({
    from: startOfMonth(new Date()),
    to:
      startOfMonth(new Date()) === new Date()
        ? new Date()
        : add(new Date(), { days: 1 }),
    selectValue: "mtd",
  });

  const setDates = (v: DateRangePickerValue) => {
    // if (!v[0] || !v[1]) return;

    // Edge case due to OpenAI API. They don't accept start_date === end_date.
    if (v.from && v.to && v.from.getTime() === v.to.getTime()) {
      return setValue({
        from: v.from,
        to: add(v.to, { days: 1 }),
        selectValue: v.selectValue,
      });
    } else {
      setValue({
        from: v.from || new Date(),
        to: v.to || new Date(),
        selectValue: v.selectValue,
      });
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

  // useEffect(() => {
  //   (async () => setValidKey(await openai.isValidKey(key)))();
  // }, [key]);

  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const valid = await openai.isValidKey(key);
        setValidKey(valid);
        if (!valid) return;
        const res = await openai.getSubscription();
        setIsDown(false);
      } catch (e) {
        setIsDown(true);
        console.log("EE", e);
      }
    })();
  }, [key]);

  // const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    CATEGORIES_KEY,
    CATEGORIES
  );

  const [users, setUsers] = useState<OrganizationUsers>();
  const [orgId, setOrgId] = useLocalStorage<string>(LOCAL_STORAGE_ORG_ID, "");

  useEffect(() => {
    (async () => {
      if (!key || !orgId) return;
      OpenAI.setOrg(orgId);
      const u = await openai.getUsers();
      setUsers(u);
    })();
  }, [key, orgId]);

  return (
    <div>
      <Flex className="flex-col items-start space-y-4 2xl:flex-row 2xl:items-center">
        <div className="flex flex-row w-full gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-row gap-2">
              <Title>OpenAI Analytics</Title>

              {!data?.user && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="blue"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-blue-500 rounded-full"></span>
                    </span>
                  )}
                >
                  demo
                </Badge>
              )}

              {data?.user && !key && subscribed && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="red"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                >
                  waiting for key
                </Badge>
              )}

              {data?.user && !subscribed && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="red"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                >
                  waiting for subscription
                </Badge>
              )}

              {data?.user && key && validKey && !isDown && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="green"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                    </span>
                  )}
                >
                  live
                </Badge>
              )}

              {data?.user && key && validKey && isDown && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="red"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                >
                  OpenAI cost API is down
                </Badge>
              )}

              {data?.user && key && !validKey && (
                <Badge
                  className="px-3 space-x-2 transition-all duration-200 ease-in-out transform"
                  // onClick={() => openDialog()}
                  color="red"
                  icon={() => (
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                >
                  invalid key
                </Badge>
              )}
            </div>
            <Text>Let&apos;s see how we&apos;re doing today</Text>
          </div>
        </div>

        <div className="z-20 flex flex-col items-end w-full max-w-3xl space-x-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <DateRangePicker
            value={value}
            onValueChange={setDates}
            selectPlaceholder="Select"
          >
            {dateSelectOptions.map((option, index) => (
              <DateRangePickerItem key={index} {...option}>
                {option.text}
              </DateRangePickerItem>
            ))}
          </DateRangePicker>

          <MultiSelect
            placeholder="Select Models"
            value={categories!}
            onValueChange={(a: any) => {
              console.log("VALUE CHANGE", a);
              setCategories(a as Category[]);
            }}
          >
            {CATEGORIES.map((category, index) => (
              <MultiSelectItem key={index} value={category}>
                {category}
              </MultiSelectItem>
            ))}
          </MultiSelect>

          {users && (
            <Select
              onValueChange={(value) =>
                console.log("The selected value is", value)
              }
              placeholder="Select User"
            >
              {users.members.data.map(({ user }, idx) => (
                <SelectItem
                  key={idx}
                  value={user.id}
                  icon={() => (
                    <img
                      alt={user.name}
                      src={user.picture}
                      className="mr-3 rounded-full w-7 h-7"
                    />
                  )}
                >
                  {user.name}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
      </Flex>

      <TabGroup>
        <TabList className="mt-2">
          <Tab>Overview</Tab>
          <Tab>
            Detailed Analytics
            <span className="px-2 py-1 ml-2 bg-tremor-brand-muted text-tremor-brand-emphasis rounded-tremor-full">
              New ✨
            </span>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid
              numItems={1}
              numItemsMd={2}
              numItemsLg={4}
              className="w-full gap-6 mt-4"
            >
              <Card className="z-10 shadow-none">
                <CostChart
                  startDate={new Date()}
                  endDate={new Date()}
                  categories={categories!}
                />
              </Card>
              <Card className="shadow-none">
                <RequestChart startDate={new Date()} endDate={new Date()} />
              </Card>
              <Card className="shadow-none">
                <ContextTokenChart
                  startDate={new Date()}
                  endDate={new Date()}
                />
              </Card>
              <Card className="shadow-none">
                <GeneratedTokenChart
                  startDate={new Date()}
                  endDate={new Date()}
                />
              </Card>
            </Grid>

            <Card className="mt-4 shadow-none">
              <MonthlyChart
                startDate={value.from!}
                endDate={value.to!}
                categories={categories!}
              />
            </Card>

            <Grid numItemsMd={1} numItemsLg={3} className="gap-6 mt-4">
              <Card className="shadow-none">
                <Cost
                  startDate={value.from!}
                  endDate={value.to!}
                  categories={categories!}
                />
              </Card>
            </Grid>
          </TabPanel>
          <TabPanel>
            <Card className="mt-4 shadow-none">
              <MonthlyChartByMinute
                startDate={value.from!}
                endDate={value.to!}
                categories={categories!}
              />
            </Card>
            <Grid numItemsMd={1} numItemsLg={3} className="gap-6 mt-4">
              <Card className="shadow-none">
                <Requests startDate={value.from!} endDate={value.to!} />
              </Card>
              <Card className="shadow-none">
                <Tokens
                  startDate={value.from!}
                  endDate={value.to!}
                  categories={categories!}
                />
              </Card>
            </Grid>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
