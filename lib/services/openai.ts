import axios from "axios";
import { format } from "date-fns";
import { get, set } from "idb-keyval";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  UsageResponse,
} from "../types";

class OpenAI {
  private key: string | null = null;

  constructor() {}

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

    const cached = await get<UsageResponse>(query.date);

    if (cached && query.date !== format(new Date(), "yyyy-MM-dd")) {
      return cached;
    }

    const res = await axios.get<UsageResponse>(
      `https://api.openai.com/v1/usage?${new URLSearchParams(query)}`,
      {
        headers: {
          Authorization: `Bearer ${this.key}`,
        },
      }
    );

    await set(query.date, res.data);

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
    const cached = await get<BillingUsageResponse>(cacheKey);

    if (cached && query.end_date !== format(new Date(), "yyyy-MM-dd")) {
      return cached;
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

    await set(cacheKey, res.data);

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
