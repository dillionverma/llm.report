import Meta from "@/components/Meta";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Meta />
      <body className="bg-slate-50 min-h-screen dark:bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
