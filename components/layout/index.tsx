import { UserDropdownMenu } from "@/components/Dropdown";
import { useDialog } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@tremor/react";
import {
  ArrowUpDown,
  HomeIcon,
  MessageSquarePlus,
  Settings,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { isOpen, openDialog, closeDialog } = useDialog();
  const { data: session } = useSession();

  return (
    <>
      <header
        className={cn(" ", {
          "bg-white border-b": session?.user,
        })}
      >
        <nav className="flex items-center h-16 px-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold text-slate-800">LLM Report</h1>
          </Link>
          <div className="flex-1" />

          {session?.user ? (
            <div className="flex justify-center items-center ml-auto">
              {/* <button
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 hover:border-gray-400 focus:outline-none hover:border-1"
                onClick={() => openDialog()}
              >
                <Image
                  alt={session?.user?.email || "User"}
                  src={
                    session?.user.image ||
                    `https://avatars.dicebear.com/api/initials/${session?.user.email}.svg`
                  }
                  width={40}
                  height={40}
                />
              </button> */}
              <UserDropdownMenu />
            </div>
          ) : (
            <Button onClick={openDialog}>Get Started</Button>
          )}
        </nav>
      </header>
      <main className="">
        {session?.user && (
          <aside className="absolute w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white border-r border-b ">
            <div className="h-full pb-12 bg-white overflow-auto">
              <div className={cn("pb-12")}>
                <div className="space-y-4 py-4">
                  <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      Home
                    </h2>
                    <div className="space-y-2">
                      <Link
                        href="/"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <HomeIcon className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/requests"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Requests
                        <Badge className="ml-2 px-2 cursor-pointer">
                          Coming Soon
                        </Badge>
                      </Link>

                      <Link
                        href="/users"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Users
                        <Badge className="ml-2 px-2 cursor-pointer">
                          Coming Soon
                        </Badge>
                      </Link>

                      <Link
                        href="/feature-request"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        Feature Request
                        <Badge className="ml-2 px-2 cursor-pointer">New</Badge>
                      </Link>
                      {/* <Link
                        href="/api-keys"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Api Keys
                      </Link> */}
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      Account
                    </h2>

                    {/* <Link
                      href="/billing"
                      className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                    >
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      Billing
                    </Link> */}

                    <Link
                      href="/settings"
                      className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
        <div
          className={cn("space-y-4 p-8 pt-6", {
            "sm:ml-64": session?.user,
            "max-w-[1280px] mx-auto": !session?.user,
          })}
        >
          {children}
        </div>
      </main>
      {/* <footer className="p-5 max-w-[1280px] mx-auto">
        <div className="w-full text-center border-slate-200 ">
          <div className="text-slate-600 flex justify-center">
            <Link
              href="https://twitter.com/dillionverma"
              target="_blank"
              rel="noreferrer noopener"
            >
              <p className="hover:text-slate-800 transition-all">
                Made with ❤️ by Dillion
              </p>
            </Link>
          </div>
        </div>
      </footer> */}
    </>
  );
}
