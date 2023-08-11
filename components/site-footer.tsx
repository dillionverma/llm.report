import { Icons } from "@/components/icons";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const footerNavs = [
  {
    label: "Company",
    items: [
      {
        href: "javascript:void()",
        name: "Partners",
      },
      {
        href: "javascript:void()",
        name: "Blog",
      },
      {
        href: "javascript:void()",
        name: "Team",
      },
      {
        href: "javascript:void()",
        name: "Careers",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        href: "javascript:void()",
        name: "contact",
      },
      {
        href: "javascript:void()",
        name: "Support",
      },
      {
        href: "javascript:void()",
        name: "Docs",
      },
      {
        href: "javascript:void()",
        name: "Pricing",
      },
    ],
  },
  {
    label: "About",
    items: [
      {
        href: "javascript:void()",
        name: "Terms",
      },
      {
        href: "javascript:void()",
        name: "License",
      },
      {
        href: "javascript:void()",
        name: "Privacy",
      },
      {
        href: "javascript:void()",
        name: "About US",
      },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="md:flex md:justify-between p-4 sm:py-16">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                llm.report
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Product
              </h2>
              <ul className="gap-2 grid">
                <li>
                  <Link
                    href="/"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Open AI Cost Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Logging
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="gap-2 grid">
                <li>
                  <Link
                    href="https://twitter.com/dillionverma"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.gg/eVtDPmRWXm"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="gap-2 grid">
                <li>
                  <Link
                    href="/terms"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="cursor-pointer text-gray-400 hover:text-gray-600 hover:opacity-90 duration-200"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between border-t py-4 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            <Link
              href="https://discord.gg/eVtDPmRWXm"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
            >
              <DiscordLogoIcon className="w-4 h-4" />
              <span className="sr-only">Discord community</span>
            </Link>
            <Link
              href="https://twitter.com/dillionverma"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
            >
              <Icons.twitter className="w-4 h-4" />
              <span className="sr-only">Twitter page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
            >
              <Icons.gitHub className="w-4 h-4" />
              <span className="sr-only">GitHub account</span>
            </Link>
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
