import { Icons } from "@/components/icons";

declare global {
  interface Window {
    ApplePaySession: any;
  }
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };

export type UserPayments = Pick<User> & {
  payments: Payment[];
};

export type Request = {
  id: string,
  userId: string,
  openai_id: string,
  ip: string,
  url: string,
  method: string,
  status: number,
  cached: boolean,
  streamed: boolean,
  user_id: string,
  model: string,
  prompt_tokens: number,
  completion_tokens: number,
  request_headers: object,
  request_body: object,
  response_headers: object,
  response_body: object,
  streamed_response_body: string,
  completion: string,
  createdAt: number,
  updatedAt: number,
};
