import axios from "axios";
import { format } from "date-fns";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  UsageResponse,
} from "../types";

// class LocalStorageCache {
//   get(key: string): any {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : null;
//   }

//   has(key: string): boolean {
//     return !!localStorage.getItem(key);
//   }

//   set(key: string, value: any): void {
//     localStorage.setItem(key, JSON.stringify(value));
//   }
// }

class OpenAI {
  private cache: Map<string, any>;
  private key: string | null = null;

  constructor() {
    this.cache = new Map<string, any>();
  }

  setKey(key: string | null) {
    this.key = key;
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

    if (this.cache.has(query.date) && date.getTime() !== new Date().getTime()) {
      return this.cache.get(query.date);
    }

    const res = await axios.get<UsageResponse>(
      `https://api.openai.com/v1/usage?${new URLSearchParams(query)}`,
      {
        headers: {
          Authorization: `Bearer ${this.key}`,
        },
      }
    );

    this.cache.set(query.date, res.data);

    return res.data;
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

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
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

    this.cache.set(cacheKey, res.data);

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
