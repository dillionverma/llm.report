/* eslint-disable max-len */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { animationVariant } from "@/lib/constants";
import { useUsageDataCumulative } from "@/lib/hooks/api/useUsageDataCumulative";
import { Category } from "@/lib/types";
import useInterval from "@/lib/use-interval";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
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
        <div className="h-6 bg-gray-200 rounded-full w-32 mb-2.5"></div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex items-start space-y-1 flex-col h-[250px] mt-4 animate-pulse"
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
      </CardContent>
    </Card>
  );
};

type SelectedCategory = "total" | "context" | "generated";

const selectedCategories: SelectedCategory[] = [
  "total",
  "context",
  "generated",
];

const Tokens = ({
  startDate,
  endDate,
  categories,
  defaultLoading,
  demo,
}: {
  startDate: Date;
  endDate: Date;
  categories: Category[];
  defaultLoading?: boolean;
  demo?: boolean;
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>("total");

  const { contextTokenData, generatedTokenData, totalTokenData, loading } =
    useUsageDataCumulative(startDate, endDate);

  const tabcategories = [
    { key: "total", name: "Total", icon: ChartBarIcon },
    { key: "context", name: "Context", icon: ArrowDownTrayIcon },
    { key: "generated", name: "Generated", icon: ArrowUpTrayIcon },
  ];

  if (defaultLoading || loading) {
    return <LoadingList />;
  }

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
            <Title>Tokens</Title>
            <Icon
              icon={InformationCircleIcon}
              size="sm"
              color="gray"
              tooltip="Tokens are how OpenAI measures usage. 1 token ~= 4 characters in english."
            />
          </Flex>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-2"
          >
            <Metric>
              {selectedCategory === "total" &&
                totalTokenData
                  .reduce((acc, obj) => acc + obj.value, 0)
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
              {selectedCategory === "context" &&
                contextTokenData
                  .reduce((acc, obj) => acc + obj.value, 0)
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
              {selectedCategory === "generated" &&
                generatedTokenData
                  .reduce((acc, obj) => acc + obj.value, 0)
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
            </Metric>
            <Text>Total Tokens</Text>
          </Flex>
        </CardHeader>
        <CardContent>
          <TabGroup
            className="mt-6"
            onIndexChange={(value) =>
              setSelectedCategory(selectedCategories[value as number])
            }
            defaultValue={selectedCategory}
          >
            <TabList>
              {tabcategories.map((category) => (
                <Tab
                  key={category.key}
                  value={category.key}
                  icon={category.icon}
                >
                  {category.name}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
          <Flex className="mt-4">
            <Text>
              <Bold>Model</Bold>
            </Text>
            <Text>
              <Bold>Tokens</Bold>
            </Text>
          </Flex>

          {selectedCategory === "generated" && (
            <BarList
              data={generatedTokenData}
              className="mt-4"
              valueFormatter={(v) =>
                v.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
          )}

          {selectedCategory === "context" && (
            <BarList
              data={contextTokenData}
              className="mt-4"
              valueFormatter={(v) =>
                v.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
          )}

          {selectedCategory === "total" && (
            <BarList
              data={totalTokenData}
              className="mt-4"
              valueFormatter={(v) =>
                v.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Tokens;
