import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "https://docs.llm.report/features/openai",
        name: "OpenAI Analytics",
      },
      {
        href: "https://docs.llm.report/features/logs",
        name: "Logs",
      },
      {
        href: "https://docs.llm.report/features/users",
        name: "User Analytics",
      },
      {
        href: "/pricing",
        name: "Pricing",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        href: "https://docs.llm.report",
        name: "Docs",
      },
      {
        href: "https://github.com/dillionverma/llm.report/issues",
        name: "Feedback and Requests",
      },
      {
        href: "https://github.com/dillionverma/llm.report/commits/main",
        name: "Changelog",
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        href: "https://discord.gg/eVtDPmRWXm",
        name: "Discord",
      },
      {
        href: "https://twitter.com/dillionverma",
        name: "Twitter",
      },
      {
        href: "mailto:dillion@llm.report",
        name: "Email",
      },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        href: "/terms",
        name: "Terms",
      },

      {
        href: "/privacy",
        name: "Privacy",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "https://discord.gg/eVtDPmRWXm",
    name: "Discord",
    icon: <DiscordLogoIcon className="h-4 w-4" />,
  },
  {
    href: "https://twitter.com/dillionverma",
    name: "Twitter",
    icon: <Icons.twitter className="h-4 w-4" />,
  },
  {
    href: "https://github.com/dillionverma",
    name: "GitHub",
    icon: <Icons.gitHub className="h-4 w-4" />,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="md:flex md:justify-between p-4 py-16 sm:pb-24 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                llm.report
              </span>
            </Link>
            <p className="max-w-xs">{siteConfig.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-4">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  {nav.label}
                </h2>
                <ul className="gap-2 grid">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between border-t py-4 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{" "}
            <Link href="/" className="cursor-pointer">
              llm.report™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
