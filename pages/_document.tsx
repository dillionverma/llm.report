import Meta from "@/components/Meta";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Meta />
      <body className="bg-slate-50 min-h-screen max-w-[1280px] mx-auto">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
