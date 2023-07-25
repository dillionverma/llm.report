import {
  AUDIO_MODELS,
  CHAT_MODELS,
  EMBEDDING_MODELS,
  IMAGE_RESOLUTIONS,
} from "@/lib/constants";
import {
  AudioModel,
  ChatCompletionModel,
  EmbeddingModel,
  ImageResolution,
  Snapshot,
} from "@/lib/types";

export type CompletionModelCost = {
  prompt: number;
  completion: number;
};

export type CostPerUnit = {
  [key in Snapshot | string]?: CompletionModelCost | number;
};

export const COST_PER_UNIT: CostPerUnit = {
  // gpt-4
  "gpt-4": {
    prompt: 0.03 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-0314": {
    prompt: 0.03 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-0613": {
    prompt: 0.03 / 1000,
    completion: 0.03 / 1000,
  },
  "gpt-4-32k": {
    prompt: 0.06 / 1000,
    completion: 0.12 / 1000,
  },
  "gpt-4-32k-0314": {
    prompt: 0.06 / 1000,
    completion: 0.12 / 1000,
  },

  // gpt-3.5-turbo
  "gpt-3.5-turbo": {
    prompt: 0.0015 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo-0301": {
    prompt: 0.0015 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo-0613": {
    prompt: 0.0015 / 1000,
    completion: 0.002 / 1000,
  },
  "gpt-3.5-turbo-16k-0613": {
    prompt: 0.003 / 1000,
    completion: 0.004 / 1000,
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

interface CostReq {
  model: Snapshot;
  input?: number;
  output?: number;
}

interface CostRes {
  // promptCost?: number;
  // completionCost?: number;
  cost: number;
}

export const calculateCost = ({ model, input, output }: CostReq): number => {
  if (!COST_PER_UNIT[model])
    throw new Error(`Cost for model ${model} not found`);

  if (CHAT_MODELS.includes(model as ChatCompletionModel)) {
    if (!input || !output)
      throw new Error("Input and output tokens are required");

    const { prompt, completion } = COST_PER_UNIT[model] as CompletionModelCost;
    const promptCost = prompt * input;
    const completionCost = completion * output;
    const cost = promptCost + completionCost;
    return cost;
  } else if (
    new Set([...EMBEDDING_MODELS, ...AUDIO_MODELS, ...IMAGE_RESOLUTIONS]).has(
      model as EmbeddingModel | AudioModel | ImageResolution
    )
  ) {
    if (!input) throw new Error("Input tokens are required");
    const costPerToken = COST_PER_UNIT[model] as number;
    const cost = costPerToken * input;
    return cost;
  }

  throw new Error(`Cost for model ${model} not found`);
};
