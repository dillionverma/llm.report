// "use client";

// import { UserDropdownMenu } from "@/components/Dropdown";
// import { Icons } from "@/components/icons";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { useLogCount } from "@/lib/hooks/useLogCount";
// import { cn, nFormatter, numberFormat } from "@/lib/utils";
// import { BoltIcon } from "@heroicons/react/24/solid";
// import { Badge } from "@tremor/react";
// import { getDaysInMonth } from "date-fns";
// import { motion } from "framer-motion";
// import { ArrowUpDown, Download, Settings, User } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const LOGS_PER_MONTH = 100000;
// const HOME_LINKS = [
//   {
//     text: "OpenAI Analytics",
//     Icon: () => <Icons.openai className="w-4 h-4" />,
//     href: "/openai",
//     badge: null,
//   },
//   {
//     text: "Logs",
//     Icon: () => <ArrowUpDown className="w-4 h-4" />,
//     href: "/logs",
//     badge: null,
//   },
//   {
//     text: "Users",
//     Icon: () => <User className="w-4 h-4" />,
//     href: "/users",
//     badge: "New ✨",
//   },
//   {
//     text: "Installation",
//     Icon: () => <Download className="w-4 h-4" />,
//     href: "/install",
//     badge: null,
//   },
//   {
//     text: "Settings",
//     Icon: () => <Settings className="w-4 h-4" />,
//     href: "/settings",
//     badge: null,
//   },
// ];

// const LinkItem = ({ text, href, Icon, badge, external, isActive }: any) => (
//   <motion.div whileHover="hover" className="space-y-2">
//     <Link
//       href={href}
//       target={external ? "_blank" : undefined}
//       className={cn(
//         "flex items-center w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900 transition-all rounded-md px-2 py-1 gap-2",
//         {
//           "bg-slate-50 dark:bg-slate-900": isActive,
//         }
//       )}
//     >
//       <motion.div
//         className="flex"
//         initial={{
//           rotate: 0,
//           originX: "50%",
//           originY: "50%",
//         }}
//         variants={{
//           hover: {
//             rotate: [0, 20, 0],
//             transition: {
//               ease: ["easeOut"],
//             },
//             originX: "50%",
//             originY: "50%",
//           },
//         }}
//       >
//         <Icon />
//       </motion.div>
//       <p className="flex">{text}</p>
//       {badge && <Badge className="px-2 ml-2 cursor-pointer">{badge}</Badge>}
//     </Link>
//   </motion.div>
// );

// const Drawer = () => {
//   const { data, isLoading } = useLogCount({});
//   const logCount = data?.count;

//   const router = useRouter();
//   const { data: session } = useSession();

//   const [activeTab, setActiveTab] = useState("");

//   const pathname = usePathname();

//   useEffect(() => {
//     if (!pathname) return;
//     const activeTabName = pathname.replace("/", "");

//     setActiveTab(activeTabName);
//   }, [pathname]);

//   if (!session?.user) return null;

//   const logsLeft = LOGS_PER_MONTH - logCount;
//   const projectedLogs =
//     (logCount / new Date().getDate()) * getDaysInMonth(new Date());

//   const renderLinks = (links: any) =>
//     links.map((navItem: any, index: number) => (
//       <LinkItem
//         key={index}
//         {...navItem}
//         isActive={activeTab === navItem.href.replace("/", "")}
//       />
//     ));

//   return (
//     <aside className="flex-col justify-between flex-shrink-0 hidden w-64 h-screen px-4 pt-4 transition-transform -translate-x-full border-b border-r lg:translate-x-0 lg:flex">
//       <div className="flex flex-col gap-2">
//         <Link href="/" className="flex items-center space-x-2">
//           <Image
//             src="/logo.svg"
//             alt="Logo"
//             width={32}
//             height={32}
//             className="rounded-full"
//           />
//           <h1 className="text-xl font-semibold text-gray-800">LLM Report</h1>
//         </Link>
//         <h2 className="mb-2 text-lg font-semibold tracking-tight">Home</h2>
//         {renderLinks(HOME_LINKS)}
//         {/* <h2 className="mb-2 text-lg font-semibold tracking-tight">Community</h2>
//         {renderLinks(COMMUNITY_LINKS)} */}
//       </div>
//       <div className="flex flex-1" />
//       <Card className="p-2">
//         <CardHeader className="p-2">
//           <CardTitle>Free plan</CardTitle>
//           <CardDescription>
//             {logCount} / {numberFormat(LOGS_PER_MONTH)}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-2 p-2">
//           <div>
//             <Progress value={(logCount / LOGS_PER_MONTH) * 100} />
//             {/* <Progress
//               className="absolute green-300"
//               value={(projectedLogs / LOGS_PER_MONTH) * 100}
//             /> */}
//           </div>
//           <div className="text-xs">
//             {numberFormat(logsLeft)} logs left this month
//           </div>
//           <div className="text-xs">~{nFormatter(projectedLogs)} projected</div>
//         </CardContent>
//         <CardFooter className="p-2">
//           <Button
//             onClick={() => router.push("/settings/billing")}
//             className="relative justify-center w-full gap-2 transition-all duration-300 ease-out group hover:ring-2 hover:ring-primary hover:ring-offset-2"
//           >
//             <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 ease-out transform translate-x-12 bg-white rotate-12 opacity-10 group-hover:-translate-x-60"></span>

//             <BoltIcon className="w-4 h-4" />
//             <span>Upgrade to pro</span>
//           </Button>
//         </CardFooter>
//       </Card>

//       {session?.user && <UserDropdownMenu />}
//     </aside>
//   );
// };

// export default Drawer;
"use client";
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
import { cn, nFormatter, numberFormat } from "@/lib/utils";
import { useSession } from "next-auth/react";
// import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// import { BoltIcon } from "@heroicons/react/24/solid";
// import { Badge } from "@tremor/react";
import { getDaysInMonth } from "date-fns";
// import { motion } from "framer-motion";
import { UserDropdownMenu } from "@/components/Dropdown";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Settings, User, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { ModeToggle } from "./mode-toggle";
const LOGS_PER_MONTH = 100000;

const LINK_ITEMS = [
  {
    text: "OpenAI Analytics",
    Icon: () => (
      <Icons.openaidrawer className="w-4 h-4 dark:fill-zinc-200 fill-zinc-700" />
    ),
    href: "/openai",
    badge: null,
  },
  {
    text: "Logs",
    Icon: () => <ArrowUpDown className="w-4 h-4" />,
    href: "/logs",
    badge: null,
  },
  {
    text: "Users",
    Icon: () => <User className="w-4 h-4" />,
    href: "/users",
    badge: "New ✨",
  },
  {
    text: "Installation",
    Icon: () => <Download className="w-4 h-4" />,
    href: "/install",
    badge: null,
  },
  {
    text: "Settings",
    Icon: () => <Settings className="w-4 h-4" />,
    href: "/settings",
    badge: null,
  },
];

const LinkItem = ({ text, href, Icon, badge, external, isActive }: any) => (
  <div className="space-y-2 group">
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className={cn(
        "flex items-center w-full justify-start hover:bg-zinc-100 dark:hover:bg-slate-900 dark:hover:text-indigo-500 hover:text-indigo-600 transition-all rounded-md px-2 py-1 gap-2",
        {
          "bg-zinc-200 dark:bg-slate-900 text-indigo-500": isActive,
        }
      )}
    >
      <div className="text-muted-foreground group-hover:text-indigo-400 group-hover:animate-wiggle">
        <Icon />
      </div>
      <p className="flex">{text}</p>
      {badge && (
        <Badge
          variant="common"
          // className="px-3 py-1 ml-2 text-sm text-indigo-600 cursor-pointer bg-indigo-50 dark:bg-inherit dark:text-indigo-400"
        >
          {badge}
        </Badge>
      )}
    </Link>
  </div>
);

const CardComponent = ({ logCount, logsLeft, projectedLogs, router }: any) => (
  <Card className="p-2">
    <CardHeader className="p-2">
      <CardTitle>Free plan</CardTitle>
      <CardDescription>
        {logCount} / {numberFormat(LOGS_PER_MONTH)}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 p-2">
      <div>
        <Progress value={(logCount / LOGS_PER_MONTH) * 100} />
      </div>
      <div className="text-xs">
        {numberFormat(logsLeft)} logs left this month
      </div>
      <div className="text-xs">~{nFormatter(projectedLogs)} projected</div>
    </CardContent>
    <CardFooter className="p-2">
      <Button
        onClick={() => router.push("/settings/billing")}
        className="relative justify-center w-full gap-2 transition-all duration-300 ease-out group hover:ring-2 hover:ring-primary hover:ring-offset-2"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 ease-out transform translate-x-12 bg-white rotate-12 opacity-10 group-hover:-translate-x-60"></span>
        <Zap className="w-4 h-4" />
        <span>Upgrade to pro</span>
      </Button>
    </CardFooter>
  </Card>
);

const CommonMenu = () => {
  const { data, isLoading } = useLogCount({});
  const logCount = data?.count;

  const router = useRouter();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const activeTabName = pathname.replace("/", "");
      setActiveTab(activeTabName);
    }
  }, [pathname]);

  if (!session?.user) return null;

  const logsLeft = LOGS_PER_MONTH - logCount;
  const projectedLogs =
    (logCount / new Date().getDate()) * getDaysInMonth(new Date());

  return (
    <>
      <div className="flex flex-col gap-2">
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full bg-slate-200"
          /> */}
          <Icons.logo className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-custom">LLM Report</h1>
        </Link>
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Home</h2>
        {LINK_ITEMS.map((navItem: any, index: number) => (
          <LinkItem
            key={index}
            {...navItem}
            isActive={activeTab === navItem.href.replace("/", "")}
          />
        ))}
      </div>
      <div className="flex flex-1" />
      <CardComponent
        logCount={logCount}
        logsLeft={logsLeft}
        projectedLogs={projectedLogs}
        router={router}
      />
      {session?.user && <UserDropdownMenu />}
    </>
  );
};

const Drawer = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger className="flex justify-center py-3 leading-6 underline shadow-md dark:shadow-sm dark:shadow-orange-300 lg:hidden backdrop-blur">
          Menu
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <CommonMenu />
        </SheetContent>
      </Sheet>
      <aside className="flex-col justify-between flex-shrink-0 hidden w-64 h-screen px-4 pt-4 transition-transform -translate-x-full border-b border-r lg:translate-x-0 lg:flex">
        <CommonMenu />
      </aside>
    </>
  );
};

export default Drawer;
