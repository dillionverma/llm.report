import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { clickhouseClient } from "@/lib/clickhouse/clickhouseClient";
import { z } from "zod";

const schema = z.object({
  provider_id: z.string(),
  user_id: z.string().optional(),
  url: z.string(),
  method: z.string(),
  status: z.number(),
  cached: z.boolean().default(false),
  streamed: z.boolean().default(false),
  model: z.string(),
  prompt_tokens: z.number().default(0),
  completion_tokens: z.number().default(0),
  request_headers: z.string(),
  request_body: z.string(),
  response_headers: z.string(),
  response_body: z.string(),
  hashed_key: z.string().optional(),
  completion: z.string(),
  duration_in_ms: z.number(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate request body
  const response = schema.safeParse(req.body);
  if (!response.success) {
    const { errors } = response.error;
    console.log("errors", errors);

    return res.status(400).json({
      error: { message: "Invalid request", errors },
    });
  }

  // get llm.report api key
  const llmApikey = getLlmReportApiKey(req);
  if (!llmApikey) {
    return res.status(401).json({
      message: "Go to https://llm.report/ to get an API key.",
      error: "Missing API key in X-Api-Key header.",
    });
  }

  // get llm.report user from api key
  const user = await getUser(llmApikey);
  if (!user) {
    return res.status(401).json({
      message: "Go to https://llm.report/ to get an API key.",
      error: "User not found.",
    });
  }

  // insert request into clickhouse
  try {
    const body = {
      ...req.body,
      llm_report_user_id: user.id,
      provider: "openai",
    };
    await clickhouseClient.insert({
      table: "request",
      values: [body],
      format: "JSONEachRow",
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error inserting request into Clickhouse.",
      error,
    });
  }
}

const getLlmReportApiKey = (request: NextApiRequest) => {
  const headers = request.headers;
  const apiKey = headers["x-api-key"];

  if (!apiKey) return null;
  return apiKey as string;
};

const getUser = async (apiKey: string) => {
  const key = await prisma.apiKey.findUnique({
    where: {
      hashed_key: await sha256(apiKey),
    },
    include: {
      user: true,
    },
  });

  return key?.user;
};

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  // convert Buffer to Array
  const hashArray = Array.prototype.slice.call(new Uint8Array(hashBuffer));
  // convert bytes to hex string
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
