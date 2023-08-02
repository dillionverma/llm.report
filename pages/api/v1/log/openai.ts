import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("POST /api/v1/log/openai", req.body);

    const llmApikey = getLlmReportApiKey(req);
    if (!llmApikey) {
      return res.status(401).json({
        message: "Go to https://llm.report/ to get an API key.",
        error: "Missing API key in X-Api-Key header.",
      });
    }
    const user = await getUser(llmApikey);

    if (!user) {
      return res.status(401).json({
        message: "Go to https://llm.report/ to get an API key.",
        error: "User not found.",
      });
    }
    prisma.request.create({
      data: {
        openai_id: req.body.id,
        metadata: req.body.metadata,

        ip: "",

        url: req.body.url,
        method: req.body.method,
        status: req.body.status,
        cached: req.body.cached,
        streamed: req.body.streamed,
        user_id: req.body.user_id,

        model: req.body.model,
        prompt_tokens: req.body.prompt_tokens,
        completion_tokens: req.body.completion_tokens,

        request_headers: req.body.request_headers,
        request_body: req.body.request_body,

        response_headers: req.body.response_headers,
        response_body: req.body.response_body,
        streamed_response_body: req.body.streamed_response_body,

        completion: req.body.completion,
      },
    });
    return res.status(200).json({ success: true });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
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
