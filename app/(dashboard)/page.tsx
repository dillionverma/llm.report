import DashboardPage from "@/app/(dashboard)/dashboard";
import LandingPage from "@/app/(marketing)/landingpage";
import { Suspense } from "react";
import { Tweet, getTweet } from "react-tweet/api";

const tweetIds = [
  "1654372865222021120",
  // "1653919932516818945",
  "1655703926979825665",
  "1655596207924826117",

  "1659141729151500289",
  "1659218622169096193",
  "1657097533041041424",
  "1654243063651266562",

  "1657165411048210432",
  "1663298747000864769",
  // "1654551137201328128",
  // "1658983912410890241",
  "1658936278690439170",
  "1658970955203641344",
];

async function getTweets() {
  try {
    const tweets = await Promise.all(
      tweetIds.map(async (tweetId) => {
        const tweet = await getTweet(tweetId);
        return tweet;
      }) as Promise<Tweet>[]
    );
    return tweets;
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const tweets = await getTweets();
  return (
    <Suspense fallback={<></>}>
      <DashboardPage />
      <LandingPage tweets={tweets} />
    </Suspense>
  );
}
