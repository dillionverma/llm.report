import Drawer from "@/components/Drawer";
import Banner from "@/components/landing/banner";
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
    <>
      <Banner />
      <main className="flex">
        <Drawer />
        <div className="w-full">
          <header className={cn("hidden w-full z-50 bg-white border-b")}>
            <nav className="flex items-center h-16 px-8">
              {/* <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <h1 className="text-gray-800 font-semibold text-xl">
                  LLM Report
                </h1>
              </Link> 
              <div className="flex-1" />

              {/* {session?.user && (
                <div className="flex justify-center items-center ml-auto">
                  <UserDropdownMenu />
                </div>
              )} */}
            </nav>
          </header>
          <div
            className={cn(
              "relative w-full space-y-4 md:p-8 p-4 pt-6 h-screen overflow-auto bg-slate-50 dark:bg-slate-950",
              {
                "h-[calc(100vh-4rem)]": false,
              }
            )}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
