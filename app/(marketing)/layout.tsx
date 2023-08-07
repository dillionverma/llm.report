import GridPattern from "@/components/magicui/grid-pattern";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader user={user} />
      <main className="flex-1 container">{children}</main>
      <SiteFooter />
      {/* Top Ellipse Gradient */}
      <div className="pointer-events-none absolute inset-0 h-screen dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
      {/* Grid Pattern */}
      <GridPattern
        width={80}
        height={80}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-screen w-screen fill-black/10 stroke-black/10 dark:fill-white/90 dark:stroke-white/90",
          "-z-50 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
          "-top-[4rem] -z-50 h-[80%] skew-y-12"
        )}
      />
    </>
  );
}
