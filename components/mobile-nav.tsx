// "use client";

// import Link, { LinkProps } from "next/link";
// import { useRouter } from "next/navigation";
// import * as React from "react";

// import { Icons } from "@/components/icons";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { docsConfig } from "@/config/docs";
// import { siteConfig } from "@/config/site";
// import { cn } from "@/lib/utils";

// export function MobileNav() {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <Link href="/" className="flex items-center mr-6 space-x-2 sm:hidden">
//         <Icons.logo className="w-6 h-6" />
//         <span className="inline-block font-bold">{siteConfig.name}</span>
//         {/* <Badge variant="secondary">Beta</Badge> */}
//       </Link>
//       <SheetTrigger asChild>
//         {/* <Button
//           variant="ghost"
//           className="px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
//         >
//           <SidebarOpen className="w-6 h-6" />
//           <span className="sr-only">Toggle Menu</span>
//         </Button> */}
//       </SheetTrigger>
//       <SheetContent side="left" className="pr-0">
//         <MobileLink
//           href="/"
//           className="flex items-center"
//           onOpenChange={setOpen}
//         >
//           <Icons.logo className="w-4 h-4 mr-2" />
//           <span className="font-bold">{siteConfig.name}</span>
//         </MobileLink>
//         <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
//           {/* <div className="flex flex-col space-y-3">
//             {docsConfig.mainNav?.map(
//               (item) =>
//                 item.href && (
//                   <MobileLink
//                     key={item.href}
//                     href={item.href}
//                     onOpenChange={setOpen}
//                   >
//                     {item.title}
//                   </MobileLink>
//                 )
//             )}
//           </div> */}
//           <div className="flex flex-col space-y-2">
//             {docsConfig.sidebarNav.map((item, index) => (
//               <div key={index} className="flex flex-col pt-6 space-y-3">
//                 <h4 className="font-medium">{item.title}</h4>
//                 {item.items?.map((item) => (
//                   <React.Fragment key={item.href}>
//                     {!item.disabled &&
//                       (item.href ? (
//                         <MobileLink
//                           href={item.href}
//                           onOpenChange={setOpen}
//                           className="text-muted-foreground"
//                         >
//                           {item.title}
//                         </MobileLink>
//                       ) : (
//                         item.title
//                       ))}
//                   </React.Fragment>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </SheetContent>
//     </Sheet>
//   );
// }

// interface MobileLinkProps extends LinkProps {
//   onOpenChange?: (open: boolean) => void;
//   children: React.ReactNode;
//   className?: string;
// }

// function MobileLink({
//   href,
//   onOpenChange,
//   className,
//   children,
//   ...props
// }: MobileLinkProps) {
//   const router = useRouter();
//   return (
//     <Link
//       href={href}
//       onClick={() => {
//         router.push(href.toString());
//         onOpenChange?.(false);
//       }}
//       className={cn(className)}
//       {...props}
//     >
//       {children}
//     </Link>
//   );
// }

"use client";

import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Icons } from "@/components/icons";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { docsConfig } from "@/config/docs";
// import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CommonMenu } from "./sidebar";
import { ChevronRight, MenuIcon } from "lucide-react";
// import { ModeToggle } from "./mode-toggle";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  let displayPathname = pathname?.replace("/", "");
  if (displayPathname === "openai") {
    displayPathname = "OpenAI";
  } else {
    displayPathname = displayPathname?.replace(/^\w/, (c) => c.toUpperCase());
  }

  return (
    <Sheet>
      <div className="flex items-center justify-between mx-5 mt-1 border-b">
        <SheetTrigger className="flex justify-start py-2 w-fit">
          <div className="flex items-center justify-center">
            Menu <MenuIcon className="w-5 h-5 ml-2" />
          </div>
        </SheetTrigger>
        <h1 className="flex items-center">
          {" "}
          <Icons.logo className="w-6 h-6 mr-1" />
          llm.report
        </h1>
        {/* <ModeToggle /> */}
      </div>
      <div className="flex items-center justify-between pl-5 mt-3 text-base w-fit">
        <p className="text-muted-foreground">Home </p>
        <ChevronRight className="w-[15px] h-[15px] mt-[2px]" />
        <span className="font-semibold text-indigo-300">{displayPathname}</span>
      </div>
      <SheetContent side="left" className="flex flex-col justify-between pr-4">
        <CommonMenu />
      </SheetContent>
    </Sheet>
  );
}

// interface MobileLinkProps extends LinkProps {
//   onOpenChange?: (open: boolean) => void;
//   children: React.ReactNode;
//   className?: string;
// }

// function MobileLink({
//   href,
//   onOpenChange,
//   className,
//   children,
//   ...props
// }: MobileLinkProps) {
//   const router = useRouter();
//   return (
//     <Link
//       href={href}
//       onClick={() => {
//         router.push(href.toString());
//         onOpenChange?.(false);
//       }}
//       className={cn(className)}
//       {...props}
//     >
//       {children}
//     </Link>
//   );
// }
