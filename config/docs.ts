// import { allComponents } from "@/.contentlayer/generated";
import { MainNavItem, SidebarNavItem } from "@/types";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
  ],
  sidebarNav: [
    {
      title: "Solutions",
      items: [
        {
          title: "OpenAI",
          href: "/",
        },
      ],

      // allComponents
      //   .filter(
      //     (post) => post.date <= new Date().toISOString() && post.published,
      //   )
      //   .sort((a, b) => {
      //     return compareDesc(new Date(a.date), new Date(b.date));
      //   })
      //   .map((component) => ({
      //     title: component.title,
      //     href: `/components/${component.slugAsParams}`,
      //     items: [],
      //   })),
    },
  ],
};
