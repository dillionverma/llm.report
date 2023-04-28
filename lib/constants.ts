import { Color } from "@tremor/react";
import { Category } from "./types";

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
  "Total Cost ($)",
  "Audio models",
  "Chat models",
  "Embedding models",
  "Fine-tuned models",
  "GPT-4",
  "Image models",
  "Instruct models",
  "DALL-E API",
];

export const COLORS: Color[] = [
  "blue",
  "purple",
  "amber",
  "rose",
  "indigo",
  "emerald",
  "sky",
  "lime",
];

export const CATEGORY_TO_COLOR: Record<Category, Color> = {
  "Total Cost ($)": "blue",
  "Audio models": "purple",
  "Chat models": "amber",
  "Embedding models": "rose",
  "Fine-tuned models": "indigo",
  "GPT-4": "emerald",
  "Image models": "sky",
  "Instruct models": "lime",
  "DALL-E API": "pink",
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
