export interface BillingSubscriptionResponse {
  object: "billing_subscription";
  has_payment_method: boolean;
  canceled: boolean;
  canceled_at: null | number;
  delinquent: null | boolean;
  access_until: number;
  soft_limit: number;
  hard_limit: number;
  system_hard_limit: number;
  soft_limit_usd: number;
  hard_limit_usd: number;
  system_hard_limit_usd: number;
  plan: {
    title: string;
    id: string;
  };
  account_name: string;
  po_number: null | string;
  billing_email: null | string;
  tax_ids: null | string[];
  billing_address: {
    city: string;
    line1: string;
    state: string;
    country: string;
    postal_code: string;
  };
  business_address: null | any;
}

export interface BillingUsageResponse {
  object: string;
  daily_costs: {
    timestamp: number;
    line_items: {
      name: Model;
      cost: number;
    }[];
  }[];
  total_usage: number;
}

export interface UsageResponse {
  object: string;
  data: {
    aggregation_timestamp: number;
    n_requests: number;
    operation: string;
    snapshot_id: string;
    n_context: number;
    n_context_tokens_total: number;
    n_generated: number;
    n_generated_tokens_total: number;
  }[];
  ft_data: any[];
  dalle_api_data: any[];
  whisper_api_data: any[];
  current_usage_usd: number;
}

export type Category = Model | "Total Cost ($)";

export type Model =
  | "DALL-E API"
  | "Audio models"
  | "Chat models"
  | "Embedding models"
  | "Fine-tuned models"
  | "GPT-4"
  | "Image models"
  | "Instruct models";
