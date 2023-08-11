"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    title: "Billing",
    href: "/settings/billing",
  },
  {
    title: "Team",
    href: "/settings/team",
  },
  {
    title: "OpenAI",
    href: "/settings/openai",
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className={cn("flex space-x-2", className)} {...props}>
      <Tabs
        defaultValue={
          pathname === "/settings"
            ? "/settings/billing"
            : pathname || "/settings/billing"
        }
        onValueChange={(v) => {
          router.push(v);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          {items.map((item) => (
            <TabsTrigger key={item.title} value={item.href}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  );
}
