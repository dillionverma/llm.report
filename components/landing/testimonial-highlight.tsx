import { Icons } from "@/components/icons";
import Link from "next/link";

const TestimonialHighlight = () => {
  return (
    <>
      <section id="testimonial-highlight">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
          <Link
            className="max-w-3xl mx-auto cursor-pointer text-center group"
            href="https://twitter.com/rauchg/status/1693750425160486942?s=20"
          >
            {/* <h3 className=" font-semibold pb-6">What people are saying</h3> */}
            <figure>
              <blockquote>
                <p
                  className="text-gray-800 text-xl text-center font-semibold sm:text-2xl italic group-hover:-translate-y-1 transition-all duration-300 ease-in-out
                "
                >
                  “🔥 llm.report OSS, instant, realtime LLM observability“
                </p>
              </blockquote>
              <div className="mt-6">
                <img
                  width={64}
                  height={64}
                  src="/rauchg.jpeg"
                  alt="Guillermo Rauch"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <div className="mt-3">
                  <span className="block font-semibold">
                    Guillermo Rauch
                    <Icons.twitterVerified className="ml-1 mb-[0.2rem] inline h-4 w-4 text-blue-500" />
                  </span>
                  <span className="block text-gray-800 text-sm mt-0.5">
                    CEO of Vercel (Next.js) and creator of Socket.io
                  </span>
                  <Icons.vercel className="w-24 mx-auto" />
                </div>
              </div>
            </figure>
          </Link>
        </div>
      </section>
    </>
  );
};

export default TestimonialHighlight;
