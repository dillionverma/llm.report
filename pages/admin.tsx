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
  { date: "2023-05-09", users: 1321 },
].map((d) => ({
  ...d,
  date: format(new Date("2023-05-01"), "MMMM d, yyyy"),
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
