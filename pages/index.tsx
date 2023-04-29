import { useDialog } from "@/components/SettingsModal";
import { Button } from "@tremor/react";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "./dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isOpen, openDialog, closeDialog } = useDialog();
  const { data: session } = useSession();

  return (
    <>
      <header className="pt-10 px-10">
        <nav className="flex items-end flex-col">
          {session?.user ? (
            <div className="flex justify-center items-center">
              <button
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
              </button>
              {/* <DropdownMenuDemo /> */}
            </div>
          ) : (
            <Button onClick={openDialog}>Get Started</Button>
          )}
        </nav>
      </header>
      <main className="px-10 ">
        <Dashboard />
      </main>
      <footer className="p-5">
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
      </footer>
    </>
  );
}
