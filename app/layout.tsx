import { Analytics } from "@/components/analytics";
import MotionProvider from "@/components/motion-provider";
import PosthogIdentify from "@/components/posthog-identify";
import { PHProvider } from "@/components/posthog-provider";
import SessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as HotToaster } from "@/components/toaster";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebVitals } from "@/components/web-vitals";
import { ReactQueryProvider } from "@/lib/ReactQueryProvider";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/mdx.css";
import "@/styles/querybuilder.css";
import { Metadata } from "next";
import "react-querybuilder/dist/query-builder.css";

export const metadata: Metadata = {
  title: "LLM Report",
  description: "Logging and Analytics for AI Apps",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <PHProvider>
          <MotionProvider>
            <SessionProvider>
              <ReactQueryProvider>
                <TooltipProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                  >
                    {children}
                    <Analytics />
                    {/* <CrispChat /> */}
                    <WebVitals />
                    <PosthogIdentify />
                    {/* <TailwindIndicator /> */}
                    <Toaster />
                    <HotToaster />
                  </ThemeProvider>
                </TooltipProvider>
              </ReactQueryProvider>
            </SessionProvider>
          </MotionProvider>
        </PHProvider>
      </body>
    </html>
  );
}
