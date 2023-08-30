import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { UserRegisterForm } from "@/components/user-register-form";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | llm.report",
  description: "Register your account",
};

export default function RegisterPage() {
  return (
    <div className="container flex flex-col items-center justify-center w-screen h-screen">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="w-4 h-4 mr-2" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="w-6 h-6 mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to llm.report
          </h1>
          <p className="text-sm text-muted-foreground">Register your account</p>
        </div>
        <UserRegisterForm />
        <Link
          href="/login"
          className="px-8 text-sm text-center text-indigo-600 hover:underline"
        >
          Have an account? Login
        </Link>
        <p className="px-8 text-sm text-center text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
        {/* <p className="px-8 text-sm text-center text-muted-foreground">
          <Link
            href="/register"
            className="underline hover:text-brand underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
