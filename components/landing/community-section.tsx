import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function CommunitySection() {
  return (
    <section id="community">
      <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8 py-20">
        <div className="max-w-xl space-y-3 md:mx-auto">
          <h3 className="text-orange-600 font-semibold">Community</h3>
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Join our community
          </p>
          <p className="text-gray-600">
            Join our open-source community and help shape the future of LLM
            Report.
          </p>
        </div>
        <div className="mt-4 flex gap-4 justify-center items-center">
          <Link
            href="https://github.com/dillionverma/llm.report/issues"
            className={cn(
              buttonVariants({ size: "lg", variant: "default" }),
              "gap-2"
            )}
          >
            <Icons.gitHub className="w-6 h-6" />
            Github Discussions
          </Link>
          <Link
            href="/discord"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "gap-2"
            )}
          >
            <Icons.discord className="w-6 h-6" />
            Discord Server
          </Link>
        </div>
      </div>
    </section>
  );
}
