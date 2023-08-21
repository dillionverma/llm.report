"use client";

import { Card, Flex, LineChart, Metric, Title } from "@tremor/react";
import { format } from "date-fns";

const data = [
  { date: "2023-04-29", users: 4 },
  { date: "2023-04-30", users: 24 },
  { date: "2023-05-01", users: 297 },
  { date: "2023-05-02", users: 574 },
  { date: "2023-05-03", users: 737 },
  { date: "2023-05-04", users: 865 },
  { date: "2023-05-05", users: 952 },
  { date: "2023-05-06", users: 1072 },
  { date: "2023-05-07", users: 1144 },
  { date: "2023-05-08", users: 1255 },
  { date: "2023-05-09", users: 1367 },
  { date: "2023-05-10", users: 1427 },
  { date: "2023-05-11", users: 1528 },
  { date: "2023-05-12", users: 1567 },
  { date: "2023-05-13", users: 1586 },
  { date: "2023-05-14", users: 1610 },
  { date: "2023-05-15", users: 1640 },
  { date: "2023-05-16", users: 1664 },
  { date: "2023-05-17", users: 1691 },
  { date: "2023-05-18", users: 1816 },
  { date: "2023-05-19", users: 1845 },
  { date: "2023-05-20", users: 1896 },
  { date: "2023-05-21", users: 1946 },
  { date: "2023-05-22", users: 1982 },
  { date: "2023-05-23", users: 2008 },
  { date: "2023-05-24", users: 2030 },
  { date: "2023-05-25", users: 2059 },
  { date: "2023-05-26", users: 2105 },
  { date: "2023-05-27", users: 2115 },
  { date: "2023-05-28", users: 2129 },
  { date: "2023-05-29", users: 2145 },
  { date: "2023-05-30", users: 2160 },
  { date: "2023-05-31", users: 2182 },
  { date: "2023-06-01", users: 2193 },
  { date: "2023-06-02", users: 2204 },
  { date: "2023-06-03", users: 2215 },
  { date: "2023-06-04", users: 2225 },
  { date: "2023-06-05", users: 2235 },
  { date: "2023-06-06", users: 2246 },
  { date: "2023-06-07", users: 2257 },
  { date: "2023-06-08", users: 2264 },
  { date: "2023-06-09", users: 2271 },
  { date: "2023-06-10", users: 2273 },
  { date: "2023-06-11", users: 2277 },
  { date: "2023-06-12", users: 2284 },
  { date: "2023-06-13", users: 2293 },
  { date: "2023-06-14", users: 2306 },
  { date: "2023-06-15", users: 2313 },
  { date: "2023-06-16", users: 2322 },
  { date: "2023-06-17", users: 2323 },
  { date: "2023-06-18", users: 2324 },
  { date: "2023-06-19", users: 2329 },
  { date: "2023-06-20", users: 2334 },
  { date: "2023-06-21", users: 2345 },
  { date: "2023-06-22", users: 2354 },
  { date: "2023-06-23", users: 2360 },
  { date: "2023-06-24", users: 2370 },
  { date: "2023-06-25", users: 2377 },
  { date: "2023-06-26", users: 2386 },
  { date: "2023-06-27", users: 2394 },
  { date: "2023-06-28", users: 2407 },
  { date: "2023-06-29", users: 2412 },
  { date: "2023-06-30", users: 2418 },
  { date: "2023-07-01", users: 2420 },
  { date: "2023-07-02", users: 2422 },
  { date: "2023-07-03", users: 2426 },
  { date: "2023-07-04", users: 2431 },
  { date: "2023-07-05", users: 2440 },
  { date: "2023-07-06", users: 2451 },
  { date: "2023-07-07", users: 2459 },
  { date: "2023-07-08", users: 2460 },
  { date: "2023-07-09", users: 2464 },
  { date: "2023-07-10", users: 2480 },
  { date: "2023-07-11", users: 2488 },
  { date: "2023-07-12", users: 2497 },
  { date: "2023-07-13", users: 2514 },
  { date: "2023-07-14", users: 2520 },
  { date: "2023-07-15", users: 2521 },
  { date: "2023-07-16", users: 2526 },
  { date: "2023-07-17", users: 2533 },
  { date: "2023-07-18", users: 2554 },
  { date: "2023-07-19", users: 2562 },
  { date: "2023-07-20", users: 2574 },
  { date: "2023-07-21", users: 2583 },
  { date: "2023-07-22", users: 2588 },
  { date: "2023-07-23", users: 2596 },
  { date: "2023-07-24", users: 2604 },
  { date: "2023-07-25", users: 2617 },
  { date: "2023-07-26", users: 2626 },
  { date: "2023-07-27", users: 2639 },
  { date: "2023-07-28", users: 2642 },
  { date: "2023-07-29", users: 2643 },
  { date: "2023-07-30", users: 2647 },
  { date: "2023-07-31", users: 2651 },
  { date: "2023-08-01", users: 2666 },
  { date: "2023-08-02", users: 2675 },
  { date: "2023-08-03", users: 2680 },
  { date: "2023-08-04", users: 2686 },
  { date: "2023-08-05", users: 2690 },
  { date: "2023-08-06", users: 2692 },
  { date: "2023-08-07", users: 2700 },
  { date: "2023-08-08", users: 2709 },
  { date: "2023-08-09", users: 2720 },
  { date: "2023-08-10", users: 2735 },
  { date: "2023-08-11", users: 2738 },
  { date: "2023-08-12", users: 2740 },
  { date: "2023-08-13", users: 2750 },
  { date: "2023-08-14", users: 2760 },
  { date: "2023-08-15", users: 2772 },
  { date: "2023-08-16", users: 2775 },
  { date: "2023-08-17", users: 2780 },
  { date: "2023-08-18", users: 2789 },
  { date: "2023-08-19", users: 2794 },
  { date: "2023-08-20", users: 2801 },
].map((d) => ({
  ...d,
  date: format(new Date(d.date), "MMMM d, yyyy"),
}));

const Admin = () => {
  return (
    <div className="max-w-[800px] space-y-4">
      <Card className="mt-10 ml-10">
        <Flex className="space-x-4" justifyContent="start" alignItems="center">
          <div className="w-full">
            <Title className="truncate">Number of Users</Title>
            <Metric>{data[data.length - 1].users}</Metric>
          </div>
        </Flex>
        <LineChart
          className="mt-6"
          data={data}
          index="date"
          colors={["blue"]}
          categories={["users"]}
          showLegend={false}
        />
      </Card>
    </div>
  );
};

export default Admin;
