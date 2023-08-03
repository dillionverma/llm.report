import { ChevronsUpDown, CreditCard, LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncate } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function UserDropdownMenu() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="py-2">
          <Button variant="outline">
            <Image
              className="rounded-full cursor-pointer w-6 h-6"
              alt={session?.user?.email || "User"}
              src={
                session?.user.image ||
                `https://avatars.dicebear.com/api/initials/${session?.user.email}.svg`
              }
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start">
              {/* <span className="ml-2 text-sm font-semibold tracking-tight">
                {session?.user?.name}
              </span> */}
              <span className="ml-2 text-sm">
                {truncate(session?.user?.email!, 18)}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings/billing">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
          {/* <Link href="/feature-request">
            <DropdownMenuItem
              onClick={() =>
                window.open("https://llmreport.featurebase.app/", "_blank")
              }
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </DropdownMenuItem>
          </Link> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
