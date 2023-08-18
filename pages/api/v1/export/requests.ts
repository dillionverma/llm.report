import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { parseISO } from "date-fns";
import { getServerSession } from "next-auth";
import { json2csv } from "json-2-csv";

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
  });

  // Send the CSV file to the client
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=requests.csv");
  res.status(200).send(csv);
}
