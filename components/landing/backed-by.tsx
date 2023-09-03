import Link from "next/link";

const BackedBy = () => (
  <div className="flex flex-col items-center justify-center gap-4 mt-12">
    <div>
      <h3 className="text-sm font-semibold text-center text-custom">
        BACKED BY THE BEST IN THE INDUSTRY
      </h3>
    </div>

    <div className="flex flex-row gap-4">
      <Link
        href="https://vercel.com/blog/ai-accelerator-participants"
        target="_blank"
        className="relative justify-center w-full gap-2 transition-all duration-300 ease-out rounded-md group hover:ring-2 hover:ring-primary hover:ring-offset-2"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 ease-out transform translate-x-12 bg-white rotate-12 opacity-10 group-hover:-translate-x-40"></span>

        <img
          src="/accelerator-badge-dark.png"
          alt="Backed by Vercel AI Accelerator"
          className="w-36"
        />
      </Link>

      <Link
        href="https://buildspace.so/sf1"
        target="_blank"
        className="relative justify-center w-full gap-2 transition-all duration-300 ease-out rounded-md group hover:ring-2 hover:ring-primary hover:ring-offset-2"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 ease-out transform translate-x-12 bg-white rotate-12 opacity-10 group-hover:-translate-x-40"></span>

        <img
          src="/buildspace-badge-dark.png"
          alt="Backed by Buildspace"
          className="w-36"
        />
      </Link>
    </div>
  </div>
);

export default BackedBy;
