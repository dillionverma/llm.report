import { Color } from "@tremor/react";
import {
  AudioModel,
  Category,
  ChatCompletionModel,
  CompletionModel,
  EditModel,
  EmbeddingModel,
  FineTunedModel,
  ImageResolution,
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
  "Embedding models",
  "Fine-tuning models",
  "GPT-4",
  "GPT-4 Turbo",
  "GPT-3.5 Turbo",
  "InstructGPT",
  "Base models",
  "Image models",
];

export const IMAGE_RESOLUTIONS: ImageResolution[] = [
  "256x256",
  "512x512",
  "1024x1024",
];

export const CHAT_GPT4_MODELS: ChatCompletionModel[] = [
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-1106-preview",
  "gpt-4-1106-vision-preview",
];
export const CHAT_GPT3_MODELS: ChatCompletionModel[] = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k-0613",
  "gpt-3.5-turbo-0125",
];

export const CHAT_MODELS: ChatCompletionModel[] = [
  ...CHAT_GPT3_MODELS,
  ...CHAT_GPT4_MODELS,
];

export const COMPLETION_MODELS: CompletionModel[] = [
  "text-ada-001",
  "text-babbage-001",
  "text-curie-001",
  "text-davinci-002",
  "text-davinci-003",
];

export const EDIT_MODELS: EditModel[] = [
  "text-davinci-edit-001",
  "code-davinci-edit-001",
];

export const FINE_TUNED_MODELS: FineTunedModel[] = [
  "text-davinci-003",
  "text-davinci-002",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001",
];

export const EMBEDDING_MODELS: EmbeddingModel[] = [
  "text-embedding-ada-002",
  "text-embedding-ada-002-v2",
  "text-search-ada-doc-001",
];

export const AUDIO_MODELS: AudioModel[] = ["whisper-1", "whisper-2"];

export const COLORS: Color[] = [
  "blue",
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
  "GPT-3.5 Turbo": "amber",
  "Embedding models": "rose",
  "Fine-tuning models": "indigo",
  "GPT-4": "emerald",
  "GPT-4 Turbo": "blue",
  "Image models": "sky",
  InstructGPT: "lime",
  "Base models": "pink",
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
  "gpt-4-0613": "emerald",
  "gpt-4-1106-preview": "emerald",
  "gpt-4-1106-vision-preview": "emerald",
  "gpt-4-0125-preview": "emerald",
  "gpt-4-turbo-2024-04-09": "emerald",
  "gpt-4o-2024-05-13": "emerald",
  "gpt-4o": "emerald",

  // Chat models per token (GPT-3)
  "gpt-3.5-turbo": "amber",
  "gpt-3.5-turbo-0301": "amber",
  "gpt-3.5-turbo-0613": "amber",
  "gpt-3.5-turbo-16k-0613": "amber",
  "gpt-3.5-turbo-1106": "amber",
  "gpt-3.5-turbo-0125": "amber",

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
export const LOCAL_STORAGE_ORG_ID = "openai-org-id";
export const FIRST_VISIT_KEY = "first-visit";
export const FIRST_VISIT_AFTER_LOGIN = "first-visit-after-login";
export const SELECTION_KEY = "selection";
export const CATEGORIES_KEY = "categories";

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
  "gpt-4-0613": 0.06 / 1000,
  "gpt-4-1106-preview": 0.01 / 1000,
  "gpt-4-1106-vision-preview": 0.01 / 1000,
  "gpt-4-0125-preview": 0.01 / 1000,
  "gpt-4-turbo-2024-04-09": 0.01 / 1000,
  "gpt-4o-2024-05-13": 0.005 / 1000,
  "gpt-4o": 0.005 / 1000,

  // Chat models per token (GPT-3)
  "gpt-3.5-turbo-0125": 0.0005 / 1000,
  "gpt-3.5-turbo": 0.0015 / 1000,
  "gpt-3.5-turbo-0301": 0.0015 / 1000,
  "gpt-3.5-turbo-0613": 0.0015 / 1000,
  "gpt-3.5-turbo-16k-0613": 0.003 / 1000,

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
export const IMAGE_MODEL_COST: { [key in ImageResolution]: number } = {
  "1024x1024": 0.02, // per 1 image
  "512x512": 0.018, // per 1 image
  "256x256": 0.016, // per 1 image
};
