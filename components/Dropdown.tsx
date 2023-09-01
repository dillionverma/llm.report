import {
  Book,
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  LogOut,
  MessageSquare,
  UserPlus,
} from "lucide-react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncate } from "@/lib/utils";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Crisp } from "crisp-sdk-web";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function UserDropdownMenu() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="py-2">
          <Button variant="outline" className="w-full">
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
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/team">
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite Team</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/openai">
            <DropdownMenuItem className="cursor-pointer">
              <Icons.openai className="mr-2 h-4 w-4" />
              <span>OpenAI Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link
            // no js op
            href="#"
            onClick={() => {
              Crisp.chat.open();
              Crisp.chat.show();
            }}
          >
            <DropdownMenuItem className="cursor-pointer">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Ask a question</span>
            </DropdownMenuItem>
          </Link>
          <Link href="https://docs.llm.report" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <Book className="mr-2 h-4 w-4" />
              <span>Documentation</span>
              <DropdownMenuShortcut>
                <ExternalLink className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link
            href="https://github.com/dillionverma/llm.report/issues"
            target="_blank"
          >
            <DropdownMenuItem className="cursor-pointer">
              <Icons.gitHub className="mr-2 h-4 w-4" />
              <span>Submit Feedback</span>
              <DropdownMenuShortcut>
                <ExternalLink className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <Link href="https://discord.gg/eVtDPmRWXm" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <DiscordLogoIcon className="mr-2 h-4 w-4" />
              <span>Discord</span>
              <DropdownMenuShortcut>
                <ExternalLink className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
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
