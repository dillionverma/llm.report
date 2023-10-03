import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Request } from "@prisma/client";
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

  const requests: Request[] = await prisma.request.findMany({
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
      prompt: true,
      completion: true,
      request_headers: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      userId: session.user.id,
    },
  });

  const results = requests.map((request: Request) => {
    const metadata = Object.entries(request.request_headers!).filter(
      ([key, _]) => key.startsWith("x-metadata")
    );

    const { request_headers, ...updatedRequest } = request;

    const columns = [
      ...Object.keys(updatedRequest),
      ...metadata.map(([key, _]) => key),
    ];

    return {
      request: {
        ...updatedRequest,
        ...Object.fromEntries(metadata),
      },
      columns,
    };
  });

  const filteredRequests = results.map((result: any) => result.request);

  const columns = [
    ...new Set(results.flatMap((result: any) => result.columns)),
  ];

  const csv = await json2csv(filteredRequests, {
    expandNestedObjects: false,
    emptyFieldValue: "",
    keys: columns,
  });

  // Send the CSV file to the client
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=requests.csv");
  res.status(200).send(csv);
}
