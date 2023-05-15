import TweetEmbed from "react-tweet-embed";

export default function Testimonials() {
  const tweetIds = [
    "1654372865222021120",
    "1653919932516818945",
    "1655703926979825665",
    "1655596207924826117",
    "1654243063651266562",
    "1657165411048210432",
    "1657097533041041424",
    "1654551137201328128",
  ];

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
          {tweetIds.map((id) => (
            <TweetEmbed key={id} tweetId={id} />
          ))}
        </div>
      </div>
    </section>
  );
}
