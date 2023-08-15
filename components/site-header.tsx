import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { UserAccountNav } from "@/components/user-account-nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import Link from "next/link";

interface SiteHeaderProps {
  user?: User;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 w-full backdrop-blur bg-background border-b">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-between">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <CommandMenu /> */}
            <Link
              className={cn(
                buttonVariants(),
                "gap-2 whitespace-pre hidden md:flex"
              )}
              href={siteConfig.links.github}
            >
              <Icons.gitHub className="h-4 w-4 fill-current" />
              Star on GitHub
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            {/* <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">Github</span>
              </div>
            </Link> */}

            {/* <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.twitter className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
            {/* <ModeToggle /> */}

            {user && (
              <UserAccountNav
                user={{
                  name: user.name,
                  image: user.image,
                  email: user.email,
                }}
              />
            )}

            {!user && (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "px-4 bg-gradient-to-r from-red-600 to-amber-600 text-white"
                )}
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
