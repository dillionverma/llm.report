import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { clickhouseClient } from "@/lib/clickhouse/clickhouseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
    } catch (error) {
      console.log("error", error);
    }
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
