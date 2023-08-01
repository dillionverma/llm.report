import { UserDropdownMenu } from "@/components/Dropdown";
import { useDialog } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Badge } from "@tremor/react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  HomeIcon,
  Key,
  MessageSquarePlus,
  Settings,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HOME_LINKS = [
  {
    text: "Dashboard",
    Icon: () => <HomeIcon className="h-4 w-4" />,
    href: "/",
    badge: null,
  },
  {
    text: "Logs",
    Icon: () => <ArrowUpDown className="h-4 w-4" />,
    href: "/logs",
    badge: "New ✨",
  },
  {
    text: "Users",
    Icon: () => <User className="h-4 w-4" />,
    href: "/users",
    badge: "Coming Soon",
  },
  {
    text: "LLM Report API Keys",
    Icon: () => <Key className="h-4 w-4" />,
    href: "/api-keys",
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
  const { isOpen, openDialog, closeDialog } = useDialog();
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
      <div key={index} className="px-4">
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
    <aside className="flex-col flex-shrink-0 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0 border-r border-b justify-between hidden lg:flex">
      <div className="flex flex-col gap-2 py-4">
        <Link href="/" className="flex items-center space-x-2 px-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h1 className="text-gray-800 font-semibold text-xl">LLM Report</h1>
        </Link>
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Home</h2>
        {renderLinks(HOME_LINKS)}
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Community
        </h2>
        {renderLinks(COMMUNITY_LINKS)}
      </div>
      {session?.user && <UserDropdownMenu />}
    </aside>
  );
};

export default Drawer;
