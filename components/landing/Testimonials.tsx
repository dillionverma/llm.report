import Marquee from "@/components/magicui/marquee";
import { ServerTweetCard } from "@/components/magicui/tweet-card";
import { getTweet } from "react-tweet/api";

const tweetIds = [
  "1654372865222021120",
  // "1653919932516818945",
  "1655703926979825665",
  "1693750425160486942",
  "1655596207924826117",

  "1694126150333636664",
  "1659141729151500289",
  // "1659218622169096193",
  "1657097533041041424",
  "1654243063651266562",

  "1657165411048210432",
  "1663298747000864769",
  // "1654551137201328128",
  // "1658983912410890241",
  "1658936278690439170",
  // "1658970955203641344",
];

async function getTweets() {
  try {
    const tweets = await Promise.all(
      tweetIds
        .map(async (id) => {
          try {
            const tweet = await getTweet(id);
            if (!tweet) return null;
            return tweet;
          } catch (error) {
            return null;
          }
        })
        .filter((t) => t !== null)
    );

    return tweets.length ? { props: { tweets } } : { notFound: true };
  } catch (error) {
    return { notFound: true };
  }
}

export default async function Testimonials() {
  const { props } = await getTweets();
  const firstRow = props?.tweets?.slice(0, props?.tweets?.length / 2);
  const secondRow = props?.tweets?.slice(props?.tweets?.length / 2);

  return (
    <section id="testimonials" className="relative">
      <div className="py-14 space-y-14">
        <div className="mx-auto max-w-md text-center sm:max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-black sm:text-5xl sm:leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              3,000+ users
            </span>{" "}
            and{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              companies
            </span>{" "}
            worldwide
          </h2>

          <p className="mt-5 text-gray-600 sm:text-lg">
            Here&apos;s what our users have to say
          </p>
        </div>

        <div className="flex gap-4 flex-col">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow?.map((t, idx) => (
              <ServerTweetCard
                tweet={t}
                key={idx}
                className="h-full w-72 min-w-[22rem]"
              />
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:40s]">
            {secondRow?.map((t, idx) => (
              <ServerTweetCard
                tweet={t}
                key={idx}
                className="h-full w-72 min-w-[22rem]"
              />
            ))}
          </Marquee>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-slate-950"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-slate-950"></div>
    </section>
  );
}
