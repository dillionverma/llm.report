import { Snapshot } from "@/lib/types";

export type CompletionModelCost = {
  prompt: number;
  completion: number;
};

export type CostPerUnit = {
  [key in Snapshot | string]?: CompletionModelCost | number;
};

interface CostReq {
  model: Snapshot;
  input?: number;
  output?: number;
}

export const MODEL_COSTS: CostPerUnit = {
  "gpt-3.5-turbo": {
    prompt: 0.0015 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo-16k": {
    prompt: 0.003 / 1000,
    completion: 0.004 / 1000,
  },
  "gpt-4": {
    prompt: 0.03 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-32k": {
    prompt: 0.06 / 1000,
    completion: 0.12 / 1000,
  },
  // Embedding models per token
  "text-embedding-ada-002": 0.0001 / 1000,
  "text-embedding-ada-002-v2": 0.0001 / 1000,
  // Dalle
  "1024x1024": 0.02, // per 1 image
  "512x512": 0.018, // per 1 image
  "256x256": 0.016, // per 1 image
  // Audio models per minute
  "whisper-1": 0.006,
  "whisper-2": 0.006,
};

export const getModelCost = (model: string) => {
  const cost = MODEL_COSTS[model];

  if (cost) {
    return cost;
  }

  if (model.startsWith("gpt-3.5-turbo-16k")) {
    return MODEL_COSTS["gpt-3.5-turbo-16k"];
  } else if (model.startsWith("gpt-3.5-turbo")) {
    return MODEL_COSTS["gpt-3.5-turbo"];
  } else if (model.startsWith("gpt-4-32k")) {
    return MODEL_COSTS["gpt-4-32k"];
  } else if (model.startsWith("gpt-4")) {
    return MODEL_COSTS["gpt-4"];
  } else {
    throw new Error(`Cost for model ${model} not found`);
  }
};

export const calculateCost = ({ model, input, output }: CostReq): number => {
  const cost = getModelCost(model)!;

  if (typeof cost === "number") {
    if (!input) throw new Error("Input tokens are required");
    return cost * input;
  } else {
    if (!input || !output)
      throw new Error("Input and output tokens are required");

    const promptCost = cost.prompt * input;
    const completionCost = cost.completion * output;
    return promptCost + completionCost;
  }
};
