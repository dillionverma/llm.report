import { Color } from "@tremor/react";
import {
  AudioModels,
  Category,
  ChatCompletionModels,
  CompletionModels,
  EditModels,
  EmbeddingModels,
  FineTunedModels,
  Resolution,
  Snapshot,
} from "./types";

export const FADE_LEFT_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { type: "spring" } },
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FADE_DOWN_ANIMATION_VARIANTS_DELAYED = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.7 } },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const CATEGORIES: Category[] = [
  // "Total Cost ($)",
  "Audio models",
  "Chat models",
  "Embedding models",
  "Fine-tuned models",
  "GPT-4",
  "Image models",
  "Instruct models",
  "DALL-E API",
];

export const RESOLUTIONS: Resolution[] = ["256x256", "512x512", "1024x1024"];

export const CHAT_GPT4_MODELS: ChatCompletionModels[] = [
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-32k",
  "gpt-4-32k-0314",
];
export const CHAT_GPT3_MODELS: ChatCompletionModels[] = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301",
];

export const COMPLETION_MODELS: CompletionModels[] = [
  "text-ada-001",
  "text-babbage-001",
  "text-curie-001",
  "text-davinci-002",
  "text-davinci-003",
];

export const EDIT_MODELS: EditModels[] = [
  "text-davinci-edit-001",
  "code-davinci-edit-001",
];

export const FINE_TUNED_MODELS: FineTunedModels[] = [
  "text-davinci-003",
  "text-davinci-002",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001",
];

export const EMBEDDING_MODELS: EmbeddingModels[] = [
  "text-embedding-ada-002",
  "text-embedding-ada-002-v2",
  "text-search-ada-doc-001",
];

export const AUDIO_MODELS: AudioModels[] = ["whisper-1", "whisper-2"];

export const COLORS: Color[] = [
  // "blue",
  "purple",
  "amber",
  "rose",
  "indigo",
  "emerald",
  "sky",
  "lime",
  "pink",
];

export const CATEGORY_TO_COLOR: Record<Category, Color> = {
  // "Total Cost ($)": "blue",
  "Audio models": "purple",
  "Chat models": "amber",
  "Embedding models": "rose",
  "Fine-tuned models": "indigo",
  "GPT-4": "emerald",
  "Image models": "sky",
  "Instruct models": "lime",

  // TODO: Might be deprecated
  "DALL-E API": "pink",
};

export const MODEL_TO_COLOR: Record<Snapshot, Color> = {
  // "gpt-3.5-turbo-0301": "amber",
  // "text-embedding-ada-002-v2": "rose",
  // "text-davinci:003": "lime",
  // "gpt-4-0314": "emerald",

  "gpt-4": "emerald",
  "gpt-4-0314": "emerald",
  "gpt-4-32k": "emerald",
  "gpt-4-32k-0314": "emerald",

  // Chat models per token (GPT-3)
  "gpt-3.5-turbo": "amber",
  "gpt-3.5-turbo-0301": "amber",

  // Embedding models per token
  "text-embedding-ada-002": "rose",
  "text-embedding-ada-002-v2": "rose",
  "text-search-ada-doc-001": "rose",

  // Completion models per token
  "text-ada-001": "lime",
  "text-babbage-001": "lime",
  "text-curie-001": "lime",
  "text-davinci-002": "lime",
  "text-davinci-003": "lime",
  "text-davinci:003": "lime",

  // TODO: Might be deprecated
  "text-davinci-edit-001": "lime",
  "code-davinci-edit-001": "lime",

  // Audio models per minute
  "whisper-1": "purple",
  "whisper-2": "purple",

  // Image models
  "256x256": "sky",
  "512x512": "sky",
  "1024x1024": "sky",
};

export const animationVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};

export type PricingPlan = "Developer" | "Startup";

interface PriceIds {
  [key: string]: {
    [key in PricingPlan]: {
      month: string;
      year: string;
    };
  };
}

export const priceIds: PriceIds = {
  test: {
    Developer: {
      month: "price_1N1fnCB24wj8TkEzsPjdXlFm",
      year: "price_1N1fnCB24wj8TkEz2UlQ6WvY",
    },
    Startup: {
      month: "price_1N1fnDB24wj8TkEzbmFVTz4U",
      year: "price_1N1fnDB24wj8TkEziDehJxEh",
    },
  },
  development: {
    Developer: {
      month: "price_1N1fnCB24wj8TkEzsPjdXlFm",
      year: "price_1N1fnCB24wj8TkEz2UlQ6WvY",
    },
    Startup: {
      month: "price_1N1fnDB24wj8TkEzbmFVTz4U",
      year: "price_1N1fnDB24wj8TkEziDehJxEh",
    },
  },
  production: {
    Developer: {
      month: "price_1N1l0VB24wj8TkEzpiEMiwC7",
      year: "price_1N1l0VB24wj8TkEzjIRPGpHV",
    },
    Startup: {
      month: "price_1N1l0WB24wj8TkEz5IsaCQyj",
      year: "price_1N1l0WB24wj8TkEzuomJxsqb",
    },
  },
};

export const LOCAL_STORAGE_KEY = "openai-key";
export const FIRST_VISIT_KEY = "first-visit";
export const FIRST_VISIT_AFTER_LOGIN = "first-visit-after-login";
export const SELECTION_KEY = "selection";

// https://openai.com/pricing
export const MODEL_COST: { [key in Snapshot]?: number } = {
  // Chat models per token (GPT-4)
  // TODO: GPT-4 Output is different
  // {
  //   prompt: 0.03 / 1000, // per 1 tokens
  //   completion: 0.06 / 1000, // per 1 tokens
  // },
  "gpt-4": 0.06 / 1000,
  "gpt-4-0314": 0.06 / 1000,
  "gpt-4-32k": 0.06 / 1000,
  "gpt-4-32k-0314": 0.06 / 1000,

  // Chat models per token (GPT-3)
  "gpt-3.5-turbo": 0.002 / 1000,
  "gpt-3.5-turbo-0301": 0.002 / 1000,

  // Embedding models per token
  "text-embedding-ada-002": 0.0004 / 1000,
  "text-embedding-ada-002-v2": 0.0004 / 1000,
  "text-search-ada-doc-001": 0.0004 / 1000,

  // Completion models per token
  "text-ada-001": 0.0004 / 1000,
  "text-babbage-001": 0.0005 / 1000,
  "text-curie-001": 0.002 / 1000,
  "text-davinci-002": 0.002 / 1000,
  "text-davinci-003": 0.002 / 1000,
  "text-davinci:003": 0.002 / 1000,

  // TODO: Might be deprecated
  "text-davinci-edit-001": 0.002 / 1000,
  "code-davinci-edit-001": 0.002 / 1000,

  // Audio models per minute
  "whisper-1": 0.006,
  "whisper-2": 0.006,
};

// https://openai.com/pricing
export const IMAGE_MODEL_COST: { [key in Resolution]: number } = {
  "256x256": 0.016, // per 1 image
  "512x512": 0.018, // per 1 image
  "1024x1024": 0.02, // per 1 image
};
