/* eslint-disable max-len */

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

const Requests = ({
  startDate,
  endDate,
}: // categories,
// defaultLoading,
// demo,
{
  startDate: Date;
  endDate: Date;
  // categories: Category[];
  // defaultLoading?: boolean;
  // demo?: boolean;
}) => {
  const { requestData, loading } = useUsageDataCumulative(startDate, endDate);
  // const [loading, setLoading] = useState(false);
  // const [requestData, setRequestData] = useState<
  //   { name: string; value: number }[]
  // >([]);
  // const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  // const { data: session } = useSession();

  // useEffect(() => {
  //   (async () => {
  //     if (!startDate || !endDate) {
  //       return;
  //     }

  //     setLoading(true);

  //     const dates = dateRange(startDate, endDate);

  //     openai.setKey(key);

  //     let data;
  //     try {
  //       if (demo) {
  //         data = usageDay1;
  //       } else {
  //         data = await Promise.all(dates.map((date) => openai.getUsage(date)));
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       return;
  //     }

  //     console.log(data);

  //     const cumulativeUsage = data.reduce(
  //       (acc, cv) => {
  //         return {
  //           ...acc,
  //           total:
  //             acc.total + cv.data.reduce((acc, cv) => acc + cv.n_requests, 0),
  //           requests: cv.data.reduce((acc, cv) => {
  //             return {
  //               ...acc,
  //               // @ts-ignore
  //               [cv.snapshot_id]: (acc[cv.snapshot_id] || 0) + cv.n_requests,
  //             };
  //           }, acc.requests),

  //           contextTokens: cv.data.reduce((acc, cv) => {
  //             return {
  //               ...acc,
  //               [cv.snapshot_id]:
  //                 // @ts-ignore
  //                 (acc[cv.snapshot_id] || 0) + cv.n_context_tokens_total,
  //             };
  //           }, acc.contextTokens),
  //           generatedTokens: cv.data.reduce((acc, cv) => {
  //             return {
  //               ...acc,
  //               [cv.snapshot_id]:
  //                 // @ts-ignore
  //                 (acc[cv.snapshot_id] || 0) + cv.n_generated_tokens_total,
  //             };
  //           }, acc.generatedTokens),
  //         };
  //       },
  //       { total: 0, requests: {}, contextTokens: {}, generatedTokens: {} }
  //     );

  //     console.log("CUMUL", cumulativeUsage);

  //     setRequestData(
  //       Object.entries(cumulativeUsage.requests)
  //         .map(([name, value]): { name: string; value: number } => ({
  //           name,
  //           value: value as number,
  //         }))
  //         .sort((a, b) => b.value - a.value)
  //     );
  //     setLoading(false);
  //   })();
  // }, [startDate, endDate, key, session, demo]);

  if (loading) {
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
        <Title>Requests</Title>
        <Icon
          icon={InformationCircleIcon}
          size="sm"
          color="gray"
          tooltip="Requests are the number of times you've called the API."
        />
      </Flex>
      <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
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
      <TabList
        // onValueChange={(value) => setSelectedCategory(value)}
        defaultValue={"Total"}
        className="mt-6"
      >
        <Tab key={"Total"} value={"Total"} icon={ChartBarIcon} text={"Total"} />
      </TabList>
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
    </motion.div>
  );
};

export default Requests;
