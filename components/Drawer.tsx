"use client";

import { UserDropdownMenu } from "@/components/Dropdown";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLogCount } from "@/lib/hooks/useLogCount";
import { cn, numberFormat } from "@/lib/utils";
import { BoltIcon } from "@heroicons/react/24/solid";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Badge } from "@tremor/react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Download,
  MessageSquarePlus,
  Settings,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LOGS_PER_MONTH = 100000;
const HOME_LINKS = [
  {
    text: "OpenAI Analytics",
    Icon: () => <Icons.openai className="h-4 w-4" />,
    href: "/openai",
    badge: null,
  },
  {
    text: "Logs",
    Icon: () => <ArrowUpDown className="h-4 w-4" />,
    href: "/logs",
    badge: null,
  },
  {
    text: "Users",
    Icon: () => <User className="h-4 w-4" />,
    href: "/users",
    badge: "New ✨",
  },
  {
    text: "Installation",
    Icon: () => <Download className="h-4 w-4" />,
    href: "/install",
    badge: null,
  },
  {
    text: "Settings",
    Icon: () => <Settings className="h-4 w-4" />,
    href: "/settings",
    badge: null,
  },
];

const COMMUNITY_LINKS = [
  {
    text: "Feature Request",
    Icon: () => <MessageSquarePlus className="h-4 w-4" />,
    href: "/feature-request",
    badge: null,
  },
  {
    text: "Discord",
    Icon: () => <DiscordLogoIcon className="h-4 w-4" />,
    href: "https://discord.gg/eVtDPmRWXm",
    badge: "Come Say Hi! 👋",
    external: true,
  },
];

const Drawer = () => {
  const { data, isLoading } = useLogCount({});
  const logCount = data?.count;

  const router = useRouter();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const activeTabName = pathname.replace("/", "");

    setActiveTab(activeTabName);
  }, [pathname]);

  if (!session?.user) return null;

  const renderLinks = (links: any) =>
    links.map((navItem: any, index: number) => (
      <div key={index}>
        <div className="space-y-2">
          <motion.div whileHover="hover">
            <Link
              href={navItem.href}
              target={navItem.external ? "_blank" : undefined}
              className={cn(
                "flex items-center w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900 transition-all rounded-md px-2 py-1 gap-2",
                {
                  "bg-slate-50 dark:bg-slate-900":
                    activeTab === navItem.href.replace("/", ""),
                }
              )}
            >
              <motion.div
                className="flex"
                initial={{
                  rotate: 0,
                  originX: "50%",
                  originY: "50%",
                }}
                variants={{
                  hover: {
                    rotate: [0, 20, 0],
                    transition: {
                      ease: ["easeOut"],
                    },
                    originX: "50%",
                    originY: "50%",
                  },
                }}
              >
                <navItem.Icon />
              </motion.div>
              <p className="flex">{navItem.text}</p>
              {navItem.badge && (
                <Badge className="ml-2 px-2 cursor-pointer">
                  {navItem.badge}
                </Badge>
              )}
            </Link>
          </motion.div>
        </div>
      </div>
    ));
  return (
    <aside className="flex-col flex-shrink-0 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0 border-r border-b justify-between hidden lg:flex px-4 pt-4">
      <div className="flex flex-col gap-2">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h1 className="text-gray-800 font-semibold text-xl">LLM Report</h1>
        </Link>
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Home</h2>
        {renderLinks(HOME_LINKS)}
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Community</h2>
        {renderLinks(COMMUNITY_LINKS)}
      </div>
      <div className="flex flex-1" />
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>Free plan</CardTitle>
          <CardDescription>
            {logCount} / {numberFormat(LOGS_PER_MONTH)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <Progress value={logCount / LOGS_PER_MONTH} />
          <sub>
            {numberFormat(LOGS_PER_MONTH - logCount)} logs left this month
          </sub>
        </CardContent>
        <CardFooter className="p-2">
          <Button
            onClick={() => router.push("/settings/billing")}
            className="justify-center gap-2 w-full"
          >
            <BoltIcon className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </CardFooter>
      </Card>

      {session?.user && <UserDropdownMenu />}
    </aside>
  );
};

export default Drawer;
