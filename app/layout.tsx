import SettingsModal, { DialogProvider } from "@/components/SettingsModal";
import { Analytics } from "@/components/analytics";
import { CrispChat } from "@/components/crisp-chat";
import SessionProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/lib/ReactQueryProvider";
import { useCopyCode } from "@/lib/copyCode";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
// import "@/styles/mdx.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Report",
  description: "OpenAI API Cost Analytics tool",
  // image: absoluteUrl("/api/og"),
};

export default function RootLayout({
  // Component,
  children,
}: // pageProps: {  ...pageProps },
{
  children: React.ReactNode;
}) {
  // AppProps<{
  //   children: React.ReactNode;
  //   // session: Session;
  //   // dehydratedState: Record<string, unknown>;
  // }>
  useCopyCode();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
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
                  {/* <TailwindIndicator /> */}
                  <Toaster />
                  <SettingsModal />
                </ThemeProvider>
              </TooltipProvider>
            </DialogProvider>
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
