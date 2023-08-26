// import Drawer from "@/components/Drawer";
import { MobileNav } from "@/components/mobile-nav";
import { CommonMenu } from "@/components/sidebar";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex flex-col lg:flex-row">
      <div className="flex flex-col justify-between lg:hidden">
        <MobileNav />
      </div>
      <div className="lg:flex flex-col justify-between w-3/4 max-w-[280px] gap-4 pb-5 mx-4 pr-3 border-r h-screen hidden">
        <CommonMenu />
      </div>
      <div
        className={cn(
          "w-full space-y-4 md:p-8 p-4 lg:my-5 h-fit overflow-auto bg-slate-50 dark:bg-slate-950",
          {
            "h-[calc(100vh-4rem)]": false,
          }
        )}
      >
        {children}
      </div>
    </main>
    // <main className="flex flex-col lg:flex-row">
    //   <Drawer />
    //   <div className="w-full">
    //     <header className={cn("hidden w-full z-50 bg-white border-b")}>
    //       <nav className="flex items-center h-16 px-8">
    //         {/* <Link href="/" className="flex items-center space-x-2">
    //             <Image
    //               src="/logo.svg"
    //               alt="Logo"
    //               width={32}
    //               height={32}
    //               className="rounded-full"
    //             />
    //             <h1 className="text-xl font-semibold text-gray-800">
    //               LLM Report
    //             </h1>
    //           </Link>
    //           <div className="flex-1" />

    //           {/* {session?.user && (
    //             <div className="flex items-center justify-center ml-auto">
    //               <UserDropdownMenu />
    //             </div>
    //           )} */}
    //       </nav>
    //     </header>
    //     <div
    //       className={cn(
    //         "w-full space-y-4 md:p-8 p-4 pt-6 h-fit overflow-auto bg-slate-50 dark:bg-slate-950",
    //         {
    //           "h-[calc(100vh-4rem)]": false,
    //         }
    //       )}
    //     >
    //       {children}
    //     </div>
    //   </div>
    // </main>
  );
}
