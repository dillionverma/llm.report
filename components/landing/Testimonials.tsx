import { useRouter } from "next/router";
import { EmbeddedTweet, TweetSkeleton } from "react-tweet";
import { type Tweet } from "react-tweet/api";

export default function Testimonials({ tweets }: { tweets: Tweet[] }) {
  const { isFallback } = useRouter();

  return (
    <section>
      <div className="py-14">
        <div className="mx-auto max-w-md text-center sm:max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-black sm:text-5xl sm:leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              1,500+ users
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

        <div className="space-y-6 py-8 sm:columns-2 sm:gap-6 xl:columns-3">
          {tweets.map((t) =>
            isFallback ? (
              <TweetSkeleton key={t.id_str} />
            ) : (
              <div key={t.id_str} className="light">
                <EmbeddedTweet tweet={t} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
