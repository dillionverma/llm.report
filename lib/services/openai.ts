import axios from "axios";
import { differenceInMinutes, format } from "date-fns";
import { clear, get, set } from "idb-keyval";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  OrganizationUsers,
  UsageResponse,
} from "../types";

class OpenAI {
  private key: string | null = null;
  private orgId: string | null = null;
  private pendingGetUsagePromise: Promise<UsageResponse> | null = null;

  constructor() {}

  setKey(key: string | null) {
    clear(); // clear cache when setting key
    this.key = key;
  }

  setOrgId(orgId: string) {
    this.orgId = orgId;
  }

  async getUsage(date: Date | string): Promise<UsageResponse> {
    if (!this.key) {
      // throw new Error("OpenAI key not set");
    }

    if (typeof date === "string") {
      date = new Date(date);
    }

    const query = {
      date: format(date, "yyyy-MM-dd"),
    };

    const cached = await get<{ data: UsageResponse; timestamp: Date }>(
      query.date
    );

    const isToday = query.date === format(new Date(), "yyyy-MM-dd");

    // If cached data exists and (it's not today or (it's today and it's been less than 10 minutes since cached))
    if (
      cached &&
      (!isToday ||
        (isToday && differenceInMinutes(new Date(), cached.timestamp) < 10))
    ) {
      return cached.data;
    }

    // If there's no pending request, make a new one and store the promise
    // if (!this.pendingGetUsagePromise) {
    //   this.pendingGetUsagePromise = this.fetchAndCacheUsage(query);
    //   this.pendingGetUsagePromise.finally(() => {
    //     this.pendingGetUsagePromise = null; // Reset the pending promise when the request completes or fails
    //   });
    // }

    // // Return the pending promise
    // return this.pendingGetUsagePromise;
    return this.fetchAndCacheUsage(query);
  }

  private async fetchAndCacheUsage(query: any) {
    try {
      const res = await axios.get(
        `https://api.openai.com/v1/usage?${new URLSearchParams(query)}`,
        {
          headers: {
            Authorization: `Bearer ${this.key}`,
          },
        }
      );

      await set(query.date, { data: res.data, timestamp: new Date() });

      return res.data;
    } catch (err) {
      throw err; // Re-throw the error to reject the Promise
    }
  }

  async getBillingUsage(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<BillingUsageResponse> {
    if (!this.key) {
      // throw new Error("OpenAI key not set");
    }

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

    const cacheKey = `${query.start_date}-${query.end_date}`;
    const cached = await get<{ data: BillingUsageResponse; timestamp: Date }>(
      cacheKey
    );

    if (
      cached &&
      (query.start_date !== format(new Date(), "yyyy-MM-dd") ||
        differenceInMinutes(new Date(), cached.timestamp) < 10)
    ) {
      return cached.data;
    }

    const res = await axios.get<BillingUsageResponse>(
      `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${this.key}`,
        },
      }
    );

    await set(cacheKey, { data: res.data, timestamp: new Date() });

    return res.data;
  }

  async getSubscription(): Promise<BillingSubscriptionResponse> {
    if (!this.key) {
      // throw new Error("OpenAI key not set");
    }

    const response = await axios.get<BillingSubscriptionResponse>(
      `https://api.openai.com/dashboard/billing/subscription`,
      {
        headers: {
          Authorization: `Bearer ${this.key}`,
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
          Authorization: `Bearer ${this.key}`,
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
