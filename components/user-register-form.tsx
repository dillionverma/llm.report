"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userRegisterSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import axios from "axios";

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userRegisterSchema>;

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log("1");
    setIsLoading(true);
    console.log("2");
    try {
      console.log("3");
      await axios.post("/api/register", data);
      setIsLoading(false);

      return toast({
        title: "Check your email",
        description:
          "We sent you a verification link. Be sure to check your spam too.",
      });
    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    // const signInResult = await signIn("credentials", {
    //   email: data.email.toLowerCase(),
    //   password: data.password,
    //   redirect: false,
    //   callbackUrl: "/openai",
    // });

    // if (!signInResult || signInResult?.error || !signInResult?.ok) {
    //   return toast({
    //     title: "Something went wrong.",
    //     description: "Your sign in request failed. Please try again.",
    //     variant: "destructive",
    //   });
    // }

    // router.push(signInResult?.url || "/openai");
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="name"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Sign up with Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google", { callbackUrl: "/openai" });
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Icons.google className="w-4 h-4 mr-2" />
        )}{" "}
        Google
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true);
          signIn("github", { callbackUrl: "/openai" });
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Icons.gitHub className="w-4 h-4 mr-2" />
        )}{" "}
        Github
      </button>
    </div>
  );
}
