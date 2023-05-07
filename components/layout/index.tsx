import { UserDropdownMenu } from "@/components/Dropdown";
import { useDialog } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@tremor/react";
import {
  ArrowUpDown,
  HomeIcon,
  MessageSquarePlus,
  Settings,
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
          <aside className="absolute w-64 h-screen transition-transform -translate-x-full lg:translate-x-0 bg-white border-r border-b ">
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

                      {/* <Link
                        href="/users"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Users
                        <Badge className="ml-2 px-2 cursor-pointer">
                          Coming Soon
                        </Badge>
                      </Link> */}

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
                      Community
                    </h2>
                    <div className="space-y-2">
                      <Link
                        href="/feature-request"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        Feature Request
                      </Link>
                      <Link
                        href="https://discord.gg/eVtDPmRWXm"
                        target="_blank"
                        className="flex items-center w-full justify-start hover:bg-slate-50 transition-all rounded-md px-2 py-1"
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-4 w-4"
                        >
                          <title>Discord</title>
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                        Discord
                        <Badge className="ml-2 px-2 cursor-pointer">
                          Come Say Hi! 👋
                        </Badge>
                      </Link>
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
            "lg:ml-64": session?.user,
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
