import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

const dateSchema = z
  .string()
  .refine(
    (value) => {
      const [year, month, day] = value.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid date format, expected 'yyyy-MM-dd'",
    }
  )
  .transform((value) => {
    const [year, month, day] = value.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  });

const QueryParameters = z.object({
  start: dateSchema.optional(),
  end: dateSchema.optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (req.method === "GET") {
    try {
      const { start = "", end = "" } = QueryParameters.parse(req.query);

      const dateFilter: Partial<{
        createdAt?: {
          gte?: Date;
          lte?: Date;
        };
      }> = {};

      if (start || end) {
        dateFilter.createdAt = {};
        if (start) {
          dateFilter.createdAt.gte = startOfDay(start);
        }
        if (end) {
          dateFilter.createdAt.lte = endOfDay(end);
        }
      }

      const count = await prisma.request.count({
        where: {
          userId: session.user.id,
          ...dateFilter,
        },
      });

      return res.status(200).json({
        count,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
