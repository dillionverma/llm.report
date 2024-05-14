export type GPT4Model =
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"
  | "gpt-4-1106-preview"
  | "gpt-4-1106-vision-preview"
  | "gpt-4-0125-preview"
  | "gpt-4-turbo-2024-04-09"
  | "gpt-4o-2024-05-13"
  | "gpt-4o";

export type GPT3Model =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k-0613"
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-0125";

export type ChatCompletionModel = GPT3Model | GPT4Model;

export type CompletionModel =
  | "text-ada-001"
  | "text-babbage-001"
  | "text-curie-001"
  | "text-davinci-002"
  | "text-davinci-003"
  | "text-davinci:003";

export type Snapshot = ChatCompletionModel | CompletionModel;

export type CompletionModelCost = {
  prompt: number;
  completion: number;
};

export type CostPerUnit = {
  [key in Snapshot | string]?: CompletionModelCost | number;
};

interface CostReq {
  model: Snapshot | string | null;
  input?: number | null;
  output?: number | null;
}

export const MODEL_COSTS: CostPerUnit = {
  "gpt-4o-2024-05-13": {
    prompt: 0.005 / 1000,
    completion: 0.015 / 1000,
  },
  "gpt-4o": {
    prompt: 0.005 / 1000,
    completion: 0.015 / 1000,
  },
  "gpt-4-turbo-2024-04-09": {
    prompt: 0.01 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-0125-preview": {
    prompt: 0.01 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-1106-preview": {
    prompt: 0.01 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-1106-vision-preview": {
    prompt: 0.01 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-3.5-turbo-0125": {
    prompt: 0.0005 / 1000,
    completion: 0.0015 / 1000,
  },
  "gpt-3.5-turbo-1106": {
    prompt: 0.001 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo": {
    prompt: 0.0015 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo-16k": {
    prompt: 0.001 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-4": {
    prompt: 0.03 / 1000,
    completion: 0.06 / 1000,
  },
  "gpt-4-32k": {
    prompt: 0.06 / 1000,
    completion: 0.12 / 1000,
  },
};

export const getModelCost = (model: string) => {
  const cost = MODEL_COSTS[model];

  if (cost) {
    return cost;
  }

  if (model.startsWith("gpt-3.5-turbo-16k")) {
    return MODEL_COSTS["gpt-3.5-turbo-16k"];
  } else if (model.startsWith("gpt-3.5-turbo-1106")) {
    return MODEL_COSTS["gpt-3.5-turbo-1106"];
  } else if (model.startsWith("gpt-3.5-turbo")) {
    return MODEL_COSTS["gpt-3.5-turbo"];
  } else if (model.startsWith("ft:gpt-3.5-turbo")) {
    return MODEL_COSTS["ft:gpt-3.5-turbo"];
  } else if (model.startsWith("gpt-4-32k")) {
    return MODEL_COSTS["gpt-4-32k"];
  } else if (model.startsWith("gpt-4-1106")) {
    return MODEL_COSTS["gpt-4-1106-preview"];
  } else if (model.startsWith("gpt-4-0125")) {
    return MODEL_COSTS["gpt-4-0125-preview"];
  } else if (model.startsWith("gpt-4o")) {
    return MODEL_COSTS["gpt-4o"];
  } else if (model.startsWith("gpt-4-turbo-2024-04-09")) {
    return MODEL_COSTS["gpt-4-turbo-2024-04-09"];
  } else if (model.startsWith("gpt-4")) {
    return MODEL_COSTS["gpt-4"];
  } else {
    throw new Error(`Cost for model ${model} not found`);
  }
};

export const calculateCost = ({ model, input, output }: CostReq): number => {
  if (!model || !input || !output) return 0;
  const cost = getModelCost(model)!;

  if (typeof cost === "number") {
    if (!input) throw new Error("Input tokens are required");
    return cost * input;
  } else {
    const promptCost = cost.prompt * input;
    const completionCost = cost.completion * output;
    return promptCost + completionCost;
  }
};
