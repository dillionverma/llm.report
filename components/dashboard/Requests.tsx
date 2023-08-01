/* eslint-disable max-len */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { animationVariant } from "@/lib/constants";
import { useUsageDataCumulative } from "@/lib/hooks/api/useUsageDataCumulative";
import useInterval from "@/lib/use-interval";
import { ChartBarIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  BarList,
  Bold,
  Flex,
  Icon,
  Metric,
  Tab,
  TabGroup,
  TabList,
  Text,
  Title,
} from "@tremor/react";
import { motion } from "framer-motion";
import { useState } from "react";

const LoadingList = () => {
  const loadingBarHeights = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const getRandomHeight = () => {
    return loadingBarHeights[
      Math.floor(Math.random() * loadingBarHeights.length)
    ];
  };
  const [heights, setHeights] = useState<number[]>(
    new Array(6).fill(0).map((_) => getRandomHeight())
  );

  useInterval(() => {
    setHeights((heights) => {
      return heights.map((height) => {
        return getRandomHeight();
      });
    });
  }, 1500);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded-full  w-32 mb-2.5"></div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse">
          {/* <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full "></div>  */}
          <motion.div
            className="flex items-start space-y-1 flex-col h-[250px] mt-4"
            variants={animationVariant}
            initial="hidden"
            whileInView="show"
            animate="show"
          >
            {heights.map((value, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scaleX: 0, originX: 0 },
                  show: { opacity: 1, scaleX: 1, originX: 0 },
                }}
                className={` bg-gray-200 rounded-r-md  transition-all duration-500 ease-in-out h-[20rem]`}
                style={{
                  width: `${value}%`,
                }}
              ></motion.div>
            ))}
          </motion.div>
          <span className="sr-only">Loading...</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface RequestsProps {
  startDate: Date;
  endDate: Date;
}

const Requests = ({ startDate, endDate }: RequestsProps) => {
  const { requestData, loading } = useUsageDataCumulative(startDate, endDate);

  if (loading) return <LoadingList />;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
        },
      }}
    >
      <Card className="shadow-none">
        <CardHeader>
          <Flex
            justifyContent="start"
            className="space-x-1"
            alignItems="center"
          >
            <Title>Requests</Title>
            <Icon
              icon={InformationCircleIcon}
              size="sm"
              color="gray"
              tooltip="Requests are the number of times you've called the API."
            />
          </Flex>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-2"
          >
            <Metric>
              {requestData
                .reduce((acc, obj) => acc + obj.value, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
            </Metric>
            <Text>Total Requests</Text>
          </Flex>
        </CardHeader>
        <CardContent>
          <TabGroup>
            <TabList
              // onValueChange={(value) => setSelectedCategory(value)}
              defaultValue={"Total"}
              className="mt-6"
            >
              <Tab key={"Total"} value={"Total"} icon={ChartBarIcon}>
                Total
              </Tab>
            </TabList>
          </TabGroup>
          <Flex className="mt-4">
            <Text>
              <Bold>Model</Bold>
            </Text>
            <Text>
              <Bold>Requests</Bold>
            </Text>
          </Flex>

          <BarList
            data={requestData}
            className="mt-4"
            valueFormatter={(v) =>
              v.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Requests;
