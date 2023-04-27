import { DropdownMenuDemo } from "@/components/Dropdown";
import MonthlyChart from "@/components/MonthlyChart";
import MonthlyUsage from "@/components/MonthlyUsage";
import Requests from "@/components/Requests";
import { useDialog } from "@/components/SignInModal";
import { default as Tokens } from "@/components/Tokens";
import { CATEGORIES } from "@/src/constants";
import { Category } from "@/src/types";
import {
  Button,
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
import Link from "next/link";
import { useState } from "react";

export default function KpiCardGrid() {
  const [value, setValue] = useState<DateRangePickerValue>([
    startOfMonth(new Date()),
    new Date(),
    "mtd",
  ]);

  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES.filter((c) => c !== "Total Cost ($)")
  );
  const { isOpen, openDialog, closeDialog } = useDialog();
  const { data: session } = useSession();

  return (
    <div className="h-full bg-slate-50 p-10 sm:p-10">
      <nav className="flex items-end flex-col">
        {session?.user ? (
          <div className="flex justify-center items-center">
            <DropdownMenuDemo />
          </div>
        ) : (
          <Button onClick={openDialog}>Login</Button>
        )}
      </nav>

      <Flex className="md:flex-row flex-col items-start lg:items-center space-y-4">
        <div className="space-y-2">
          <Title>OpenAI Analytics</Title>
          <Text>Let&apos;s see how we&apos;re doing today</Text>

          {/* {process.env.NODE_ENV === "development" ? (
            <>
              <script
                async
                src="https://js.stripe.com/v3/buy-button.js"
              ></script>
              <stripe-buy-button
                buy-button-id="buy_btn_1N1HIoB24wj8TkEzgwFtnzpU"
                publishable-key="pk_test_51N1AtxB24wj8TkEzMfn8iSqXkThvyKEaiWrGe7L8DQaGhojJpaud2xWyCQfzymmK7ZPwsewSYzg0i1fSkSpnMpjG00w9h7rhtj"
              />
            </>
          ) : (
            <>
              <script
                async
                src="https://js.stripe.com/v3/buy-button.js"
              ></script>
              <stripe-buy-button
                buy-button-id="buy_btn_1N1HF1B24wj8TkEzCn4mLzy9"
                publishable-key="pk_live_51N1AtxB24wj8TkEz3li5RqdgbYON9DXrSudOzmMc80gegb5h8CFPpXIUEvIur8yckJlmsbR8sqKrN58O5m6h8uOW00Syk5n0vt"
              />
            </>
          )} */}
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
        />
      </Card>

      <Grid numColsMd={1} numColsLg={3} className="gap-6 mt-4">
        <Card>
          <MonthlyUsage
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
          />
        </Card>
        <Card>
          <Requests
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
          />
        </Card>
        <Card>
          <Tokens
            startDate={value[0]}
            endDate={value[1]}
            categories={categories}
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
      <footer className="bg-slate-50 px-6 sm:px-10 text-sm leading-5">
        <div className="py-4 sm:py-8 max-w-10xl text-center space-y-0 border-slate-200">
          <div className="text-slate-600 flex justify-center">
            <Link
              href="https://twitter.com/dillionverma"
              target="_blank"
              rel="noreferrer noopener"
            >
              <p className="hover:text-slate-800 transition-all">
                Made with ❤️ by Dillion
              </p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
