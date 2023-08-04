import SettingsModal, { DialogProvider } from "@/components/SettingsModal";
import { Analytics } from "@/components/analytics";
import { CrispChat } from "@/components/crisp-chat";
import MotionProvider from "@/components/motion-provider";
import { PHProvider } from "@/components/posthog-provider";
import SessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebVitals } from "@/components/web-vitals";
import { ReactQueryProvider } from "@/lib/ReactQueryProvider";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/mdx.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Report",
  description: "Get Detailed Insights About Your OpenAI API Costs",
  // image: absoluteUrl("/api/og"),
};

export default function RootLayout({
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
                <DialogProvider>
                  <TooltipProvider>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="light"
                      enableSystem
                    >
                      {children}
                      <Analytics />
                      <CrispChat />
                      <WebVitals />
                      {/* <TailwindIndicator /> */}
                      <Toaster />
                      <SettingsModal />
                    </ThemeProvider>
                  </TooltipProvider>
                </DialogProvider>
              </ReactQueryProvider>
            </SessionProvider>
          </MotionProvider>
        </PHProvider>
      </body>
    </html>
  );
}
