"use client";

import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

const components: {
  title: string;
  href: string;
  description: string;
  video?: string;
}[] = [
  {
    title: "OpenAI Analytics",
    href: "https://docs.llm.report/features/openai",
    description:
      "Enter your OpenAI API key and get access to a dashboard of analytics.",
    video: "https://cdn.llm.report/openai-demo.mp4",
  },
  {
    title: "Logging",
    href: "https://docs.llm.report/features/logs",
    description:
      "Log your prompts to gain insights about latency, cost per request, and more.",
    video: "https://cdn.llm.report/logs-demo.mp4",
  },
  {
    title: "User Analytics",
    href: "https://docs.llm.report/features/users",
    description:
      "Understand your cost per user, discover your power users, and adjust your pricing strategy.",
    video: "https://cdn.llm.report/users-demo.mp4",
  },
];

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  video?: string;
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "flex flex-col h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-4 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
            <div className="flex-1" />
            {props.video && (
              <video
                src={props.video}
                autoPlay
                loop
                muted
                className="rounded-xl border"
              />
            )}
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center gap-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
        {/* <Badge variant="secondary">Beta</Badge> */}
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        llm.report
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        llm observability and analytics platform
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>

                <ListItem
                  href="https://docs.llm.report/introduction"
                  title="Installation"
                >
                  How to install and configure llm.report
                </ListItem>
                {/* <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem> */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent data-state="open">
              <ul className="grid w-[400px] grid-cols-1 gap-3 p-4 md:w-[300px] lg:grid-cols-3 lg:w-[900px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    video={component.video}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="https://docs.llm.report" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Docs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/pricing" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
