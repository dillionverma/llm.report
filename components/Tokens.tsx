/* eslint-disable max-len */

import { LOCAL_STORAGE_KEY, animationVariant } from "@/lib/constants";
import { Category, UsageResponse } from "@/lib/types";
import useInterval from "@/lib/use-interval";
import useLocalStorage from "@/lib/use-local-storage";
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
  TabList,
  Text,
  Title,
} from "@tremor/react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const dateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

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
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded-full  w-32 mb-2.5"></div>
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
  );
};

type SelectedCategory = "total" | "context" | "generated";

const Tokens = ({
  startDate,
  endDate,
  categories,
  defaultLoading,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
  defaultLoading?: boolean;
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>("total");
  const [loading, setLoading] = useState(false);

  const [contextTokenData, setContextTokenData] = useState<
    { name: string; value: number }[]
  >([]);

  const [generatedTokenData, setGeneratedTokenData] = useState<
    { name: string; value: number }[]
  >([]);

  const [totalTokenData, setTotalTokenData] = useState<
    { name: string; value: number }[]
  >([]);

  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      const dates = dateRange(startDate, endDate);

      let data;
      try {
        data = await Promise.all(
          dates.map(async (date) => {
            const query = {
              // ...query,
              date: format(date, "yyyy-MM-dd"),
            };

            const res = await axios.get<UsageResponse>(
              `https://api.openai.com/v1/usage?date=${format(
                date,
                "yyyy-MM-dd"
              )}`,
              {
                headers: {
                  Authorization: `Bearer ${key}`,
                },
              }
            );

            return res.data;
          })
        );
      } catch (e) {
        console.error(e);
        return;
      }

      toast.promise(
        Promise.all(
          dates.map(async (date) => {
            const query = {
              // ...query,
              date: format(date, "yyyy-MM-dd"),
            };

            const res = await axios.get<UsageResponse>(
              `https://api.openai.com/v1/usage?date=${format(
                date,
                "yyyy-MM-dd"
              )}`,
              {
                headers: {
                  Authorization: `Bearer ${key}`,
                },
              }
            );

            return res.data;
          })
        ),
        {
          loading: "Loading...",
          success: (data) => {
            const cumulativeUsage = data.reduce(
              (acc, cv) => {
                return {
                  ...acc,
                  total:
                    acc.total +
                    cv.data.reduce((acc, cv) => acc + cv.n_requests, 0),
                  requests: cv.data.reduce((acc, cv) => {
                    return {
                      ...acc,
                      [cv.snapshot_id]:
                        // @ts-ignore
                        (acc[cv.snapshot_id] || 0) + cv.n_requests,
                    };
                  }, acc.requests),

                  contextTokens: cv.data.reduce((acc, cv) => {
                    return {
                      ...acc,
                      [cv.snapshot_id]:
                        // @ts-ignore
                        (acc[cv.snapshot_id] || 0) + cv.n_context_tokens_total,
                    };
                  }, acc.contextTokens),
                  generatedTokens: cv.data.reduce((acc, cv) => {
                    return {
                      ...acc,
                      [cv.snapshot_id]:
                        // @ts-ignore
                        (acc[cv.snapshot_id] || 0) +
                        cv.n_generated_tokens_total,
                    };
                  }, acc.generatedTokens),
                };
              },
              { total: 0, requests: {}, contextTokens: {}, generatedTokens: {} }
            );

            console.log(cumulativeUsage);

            setContextTokenData(
              Object.entries(cumulativeUsage.contextTokens)
                .map(([name, value]): { name: string; value: number } => ({
                  name,
                  value: value as number,
                }))
                .sort((a, b) => b.value - a.value)
            );

            setGeneratedTokenData(
              Object.entries(cumulativeUsage.generatedTokens)
                .map(([name, value]): { name: string; value: number } => ({
                  name,
                  value: value as number,
                }))
                .sort((a, b) => b.value - a.value)
            );

            setTotalTokenData(
              [
                ...Object.entries(cumulativeUsage.contextTokens).map(
                  ([name, value]): { name: string; value: number } => ({
                    name,
                    value: value as number,
                  })
                ),
                ...Object.entries(cumulativeUsage.generatedTokens).map(
                  ([name, value]): { name: string; value: number } => ({
                    name,
                    value: value as number,
                  })
                ),
              ]
                .reduce((acc, obj) => {
                  const found = acc.find((item) => item.name === obj.name);
                  if (found) {
                    found.value += obj.value;
                  } else {
                    acc.push(obj);
                  }
                  return acc;
                }, [] as any[])
                .sort((a, b) => b.value - a.value)
            );

            setLoading(false);
            return "Success!";
          },
          error: (e) => {
            setLoading(false);
            return e.response.data.error.message;
          },
        }
      );

      setLoading(false);
    })();
  }, [startDate, endDate, key]);

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
      <Flex justifyContent="start" className="space-x-1" alignItems="center">
        <Title>Tokens</Title>
        <Icon
          icon={InformationCircleIcon}
          size="sm"
          color="gray"
          tooltip="Tokens are how OpenAI measures usage. 1 token ~= 4 characters in english."
        />
      </Flex>
      <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
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
      <TabList
        onValueChange={(value) =>
          setSelectedCategory(value as SelectedCategory)
        }
        defaultValue={selectedCategory}
        className="mt-6"
      >
        {tabcategories.map((category) => (
          <Tab
            key={category.key}
            value={category.key}
            icon={category.icon}
            text={category.name}
          />
        ))}
      </TabList>
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
    </motion.div>
  );
};

export default Tokens;
