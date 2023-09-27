import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseISO } from "date-fns";
import { json2csv } from "json-2-csv";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required" });
  }

  const startDate = parseISO(start as string);
  const endDate = parseISO(end as string);

  const requests = await prisma.request.findMany({
    select: {
      createdAt: true,
      id: true,
      ip: true,
      url: true,
      method: true,
      status: true,
      cost: true,
      cached: true,
      streamed: true,
      metadata: true,
      prompt: true,
      completion: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      userId: session.user.id,
    },
  });

  const csv = await json2csv(requests, {
    expandNestedObjects: false,
    keys: [
      "createdAt",
      "id",
      "ip",
      "url",
      "method",
      "status",
      "cost",
      "cached",
      "streamed",
      "metadata",
      "prompt",
      "completion",
    ],
  });

  // Send the CSV file to the client
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=requests.csv");
  res.status(200).send(csv);
}
