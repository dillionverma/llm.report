import { Icons } from "@/components/icons";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

const TestimonialHighlight = () => {
  return (
    <>
      <section id="testimonial-highlight">
        <div className="max-w-screen-xl px-4 py-20 mx-auto md:px-8">
          <Link
            className="max-w-3xl mx-auto text-center cursor-pointer group"
            href="https://twitter.com/rauchg/status/1693750425160486942?s=20"
          >
            {/* <h3 className="pb-6 font-semibold ">What people are saying</h3> */}
            <figure>
              <blockquote>
                <p className="text-xl italic font-semibold text-center transition-all duration-300 ease-in-out text-custom sm:text-2xl group-hover:-translate-y-1 ">
                  “🔥 llm.report OSS, instant, realtime LLM observability“
                </p>
              </blockquote>
              <div className="mt-6">
                <img
                  width={64}
                  height={64}
                  src="https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg"
                  alt="Guillermo Rauch"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <div className="mt-3">
                  <span className="block font-semibold">
                    Guillermo Rauch
                    <Icons.twitterVerified className="ml-1 mb-[0.2rem] inline h-4 w-4 text-blue-500" />
                  </span>
                  <span className="block text-custom-foreground text-sm mt-0.5">
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
