import prisma from "@/lib/prisma";
import stringify from "csv-stringify";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { QueryParameters } from ".";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Fetch data from your database
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "You must be logged in." });
      }

      const {
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        pageSize = 10,
        pageNumber = 1,
        filter = "{}",
      }: QueryParameters = req.query as unknown as QueryParameters;

      const skip = (Number(pageNumber) - 1) * Number(pageSize);
      const where = JSON.parse(filter);
      const searchFilter = search
        ? {
            OR: [
              {
                request_body: {
                  path: "$.prompt",
                  string_contains: `${search}`,
                },
              },
              {
                request_body: {
                  path: "$.messages[*].content",
                  array_contains: `${search}`,
                },
              },
              {
                completion: {
                  contains: `${search}`,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {};

      const requests = await prisma.request.findMany({
        where: {
          userId: session.user.id,
          ...where,
          ...searchFilter,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        // take: Number(pageSize),
        // skip,
        include: {
          metadata: true,
        },
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="export.csv"');

      // Stringify data to CSV
      stringify(requests, { header: true })
        .pipe(res)
        .on("finish", function () {
          res.status(200).end();
        });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
