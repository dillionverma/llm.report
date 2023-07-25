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

export interface LoginResponse {
  object: "login";
  user: {
    object: "user";
    id: string;
    email: string;
    name: string;
    picture: string;
    created: number;
    groups: string[];
    session: {
      sensitive_id: string;
      object: "api_key";
      name: null | string;
      created: number;
      last_use: number;
      publishable: boolean;
    };
    orgs: {
      object: "list";
      data: {
        object: "organization";
        id: string;
        created: number;
        title: string;
        name: string;
        description: string;
        personal: boolean;
        is_default: boolean;
        role: string;
        groups: string[];
      }[];
    };
    intercom_hash: string;
  };
  invites: any[]; // Replace 'any' with the actual type if known
}

export interface OrganizationUsers {
  members: {
    object: "list";
    data: {
      object: "organization_user";
      role: string;
      created: number;
      user: {
        object: "user";
        id: string;
        name: string;
        email: string;
        picture: string;
      };
    }[];
  };
  invited: any[]; // Replace 'any' with the actual type if known
  can_invite: boolean;
}

export type Category = Model;

export type Model =
  | "DALL-E API"
  | "Audio models"
  | "Chat models"
  | "Embedding models"
  | "Fine-tuned models"
  | "GPT-4"
  | "Image models"
  | "Instruct models";

export type GPT4Model =
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0314";

export type GPT3Model =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k-0613";

export type ChatCompletionModel = GPT3Model | GPT4Model;

export type CompletionModel =
  | "text-ada-001"
  | "text-babbage-001"
  | "text-curie-001"
  | "text-davinci-002"
  | "text-davinci-003"
  | "text-davinci:003";

export type EditModel = "text-davinci-edit-001" | "code-davinci-edit-001";

export type FineTunedModel =
  | "text-davinci-003"
  | "text-davinci-002"
  | "text-curie-001"
  | "text-babbage-001"
  | "text-ada-001";

export type AudioModel = "whisper-1" | "whisper-2";

export type EmbeddingModel =
  | "text-embedding-ada-002"
  | "text-embedding-ada-002-v2"
  | "text-search-ada-doc-001";

export type ImageResolution = "256x256" | "512x512" | "1024x1024";

export type Snapshot =
  | ChatCompletionModel
  | CompletionModel
  | EditModel
  | FineTunedModel
  | AudioModel
  | EmbeddingModel
  | ImageResolution;
