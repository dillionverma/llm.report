import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden  px-6 py-2.5 sm:px-3.5 justify-center bg-gradient-to-br from-red-600 to-amber-600 z-50">
      <Link
        href="https://github.com/dillionverma/llm.report"
        target="_blank"
        className="group bg-white/[.05] hover:bg-white/[.1] border border-white/[.05] p-1 pl-4 rounded-full shadow-md gap-2 flex justify-center items-center transition-all duration-300 ease-in-out"
      >
        {/* <PartyPopper className="inline text-white" /> */}
        <p className="inline-block text-white text-sm">
          llm.report is now open-source! 🎉
        </p>
        <span className="group-hover:bg-white/[.1] py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/[.075] font-semibold text-white text-sm">
          <ChevronRight className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
};

export default Banner;
