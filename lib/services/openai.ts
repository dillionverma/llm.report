import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import axios from "axios";
import { format } from "date-fns";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  OrganizationUsers,
  UsageResponse,
} from "../types";

export class OpenAI {
  private static key: string | null = null;
  private orgId: string | null = null;
  private pendingGetUsagePromise: Promise<UsageResponse> | null = null;

  constructor() {}

  static setKey(key: string | null) {
    OpenAI.key = key;
  }

  static getKey() {
    return OpenAI.key;
  }

  static hasKey() {
    return !!OpenAI.key;
  }

  setOrgId(orgId: string) {
    this.orgId = orgId;
  }

  async getUsage(date: Date | string): Promise<UsageResponse> {
    const key = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!key) {
      throw new Error("OpenAI key not set");
    }

    OpenAI.setKey(key.replaceAll('"', ""));

    if (typeof date === "string") {
      date = new Date(date);
    }

    const query = {
      date: format(date, "yyyy-MM-dd"),
    };

    try {
      const res = await axios.get(
        `https://api.openai.com/v1/usage?${new URLSearchParams(query)}`,
        {
          headers: {
            Authorization: `Bearer ${OpenAI.key}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      throw err; // Re-throw the error to reject the Promise
    }
  }

  async getBillingUsage(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<BillingUsageResponse> {
    const key = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!key) {
      throw new Error("OpenAI key not set");
    }

    console.log("start", startDate, "end", endDate);
    OpenAI.setKey(key.replaceAll('"', ""));

    if (typeof startDate === "string") {
      startDate = new Date(startDate);
    }

    if (typeof endDate === "string") {
      endDate = new Date(endDate);
    }

    const query: {
      start_date: string;
      end_date: string;
    } = {
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    };

    // const cacheKey = `${query.start_date}-${query.end_date}`;
    // const cached = await get<{ data: BillingUsageResponse; timestamp: Date }>(
    //   cacheKey
    // );

    // if (
    //   cached &&
    //   (query.start_date !== format(new Date(), "yyyy-MM-dd") ||
    //     differenceInMinutes(new Date(), cached.timestamp) < 10)
    // ) {
    //   return cached.data;
    // }

    const res = await axios.get<BillingUsageResponse>(
      `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${OpenAI.key}`,
        },
      }
    );

    // await set(cacheKey, { data: res.data, timestamp: new Date() });

    return res.data;
  }

  async getSubscription(): Promise<BillingSubscriptionResponse> {
    const key = localStorage.getItem(LOCAL_STORAGE_KEY);

    console.log("KEY", key);
    if (!key) {
      throw new Error("OpenAI key not set");
    }

    OpenAI.setKey(key.replaceAll('"', ""));

    const response = await axios.get<BillingSubscriptionResponse>(
      `https://api.openai.com/dashboard/billing/subscription`,
      {
        headers: {
          Authorization: `Bearer ${OpenAI.key}`,
        },
      }
    );

    return response.data;
  }

  async getUsers(): Promise<OrganizationUsers> {
    const response = await axios.get<OrganizationUsers>(
      `https://api.openai.com/v1/organizations/${this.orgId}/users`,
      {
        headers: {
          Authorization: `Bearer ${OpenAI.key}`,
        },
      }
    );

    return response.data;
  }

  async isValidKey(key: string | null): Promise<boolean> {
    if (!key) {
      return false;
    }

    try {
      const response = await axios.get(
        `https://api.openai.com/dashboard/billing/subscription`,
        {
          headers: {
            Authorization: `Bearer ${key}`,

            // cache ttl 1 hr
            "Cache-Control": "max-age=3600",
          },
        }
      );

      return response.status === 200;
    } catch (e) {
      return false;
    }
  }
}

const openai = new OpenAI();

export default openai;
