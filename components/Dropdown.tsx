import { LifeBuoy, LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useDialog } from "./SettingsModal";

export function UserDropdownMenu() {
  const { data: session } = useSession();
  const { openDialog } = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 hover:border-gray-400 focus:outline-none hover:border-1">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem> */}

          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
          <Link href="/feature-request">
            <DropdownMenuItem
              onClick={() =>
                window.open("https://llmreport.featurebase.app/", "_blank")
              }
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
