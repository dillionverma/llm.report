import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (req.method === "POST") {
    const user_id = req.body.user_id || null;
    const request = await prisma.request.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        // userId: session.user.id!,
        openai_id: "chatcmpl-7G9QEu1GBxFU6HRkEPwPAa9PtdLC1",
        ip: "34.83.41.12",
        url: "https://api.openai.com/v1/chat/completions",
        method: "POST",
        status: 200,
        cached: false,
        streamed: false,
        prompt_tokens: 356,
        completion_tokens: 54,
        user_id,
        model: "gpt-3.5-turbo-0125",
        request_headers: {
          host: "api.cachemyai.com",
          accept: "*/*",
          "cf-ray": "7c786010fa57a20a",
          "x-api-key": "Bearer REDACTED",
          "x-real-ip": "98.229.248.62",
          "cf-visitor": '{"scheme":"http"}',
          connection: "Keep-Alive",
          "user-agent": "Chrome/7.31.1",
          "cf-ipcountry": "CA",
          "content-type": "application/json",
          authorization: "Bearer REDACTED",
          "cache-control": "public",
          "content-length": "202",
          "accept-encoding": "gzip",
          "cf-connecting-ip": "98.229.248.62",
          "x-forwarded-proto": "http",
        },
        response_headers: {
          date: "Mon, 15 May 2023 03:43:24 GMT",
          "cf-ray": "7c786014409ba20a-YYZ",
          server: "cloudflare",
          connection: "keep-alive",
          "content-type": "application/json",
          "openai-model": "gpt-3.5-turbo-0125",
          "x-request-id": "253c83918a2c94ga8c3et0fc901beccf",
          "cache-control": "public, max-age=2592000",
          "content-length": "692",
          "openai-version": "2020-10-01",
          "cf-cache-status": "DYNAMIC",
          "openai-organization": "user-ji6lpnyrrso6fawiy5iijdca",
          "openai-processing-ms": "11994",
          "x-ratelimit-limit-tokens": "90000",
          "x-ratelimit-reset-tokens": "21ms",
          "strict-transport-security": "max-age=15724800; includeSubDomains",
          "x-ratelimit-limit-requests": "3500",
          "x-ratelimit-reset-requests": "17ms",
          "access-control-allow-origin": "*",
          "x-ratelimit-remaining-tokens": "89968",
          "x-ratelimit-remaining-requests": "3499",
        },

        response_body: {
          id: "chatcmpl-7GJP6n55ttn97fWiqJlQ82k8oLf5E",
          model: "gpt-3.5-turbo-0125",
          usage: {
            total_tokens: 166,
            prompt_tokens: 27,
            completion_tokens: 139,
          },
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content:
                  "Here are the names of the last 10 Presidents of the United States in reverse chronological order: \n\n1. Donald Trump (2017-2021)\n2. Barack Obama (2009-2017)\n3. George W. Bush (2001-2009)\n4. Bill Clinton (1993-2001)\n5. George H. W. Bush (1989-1993)\n6. Ronald Reagan (1981-1989)\n7. Jimmy Carter (1977-1981)\n8. Gerald Ford (1974-1977)\n9. Richard Nixon (1969-1974)\n10. Lyndon B. Johnson (1963-1969)",
              },
              finish_reason: "stop",
            },
          ],
          created: 1684122192,
        },
        request_body: {
          model: "gpt-3.5-turbo",
          stream: false,
          messages: [
            { role: "system", content: "You are a very helpful AI." },
            { role: "user", content: "List last 10 presidents of the US" },
          ],
        },
        completion:
          "Here are the names of the last 10 Presidents of the United States in reverse chronological order: \n\n1. Donald Trump (2017-2021)\n2. Barack Obama (2009-2017)\n3. George W. Bush (2001-2009)\n4. Bill Clinton (1993-2001)\n5. George H. W. Bush (1989-1993)\n6. Ronald Reagan (1981-1989)\n7. Jimmy Carter (1977-1981)\n8. Gerald Ford (1974-1977)\n9. Richard Nixon (1969-1974)\n10. Lyndon B. Johnson (1963-1969)",
      },
    });

    return res.status(200).json({
      request,
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
