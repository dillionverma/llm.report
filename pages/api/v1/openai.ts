import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import log from "@/lib/log";

type Data = {
  message: string;
};

const configuration = new Configuration({
  apiKey: "sk-...",
});
const openai = new OpenAIApi(configuration);

log();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  });
  const openaiMessage = chatCompletion.data.choices[0].message?.content ?? "";
  res.status(200).json({ message: openaiMessage });
}
