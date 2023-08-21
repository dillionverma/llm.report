import { authOptions } from "@/lib/auth";
import { calculateCost } from "@/lib/llm/calculateCost";
import prisma from "@/lib/prisma";
import { Snapshot } from "@/lib/types";
import { Request } from "@prisma/client";
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
  search: z.string().optional(),
  sortBy: z.enum(["id", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  pageSize: z.coerce.number().optional(),
  pageNumber: z.coerce.number().optional(),
  filter: z.string().optional(),
  start: dateSchema.optional(),
  end: dateSchema.optional(),
});

const sortingFields = {
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

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
      const {
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        pageSize = 10,
        pageNumber = 1,
        filter = "{}",
        start = "",
        end = "",
      } = QueryParameters.parse(req.query);

      // const skip = (Number(pageNumber) - 1) * Number(pageSize);
      const where = JSON.parse(filter);
      const searchFilter = search
        ? {
            OR: [
              {
                user_id: {
                  search,
                },
              },
            ],
          }
        : {};

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

      const requests = await prisma.request.findMany({
        where: {
          userId: session.user.id,
          ...where,
          ...searchFilter,
          ...dateFilter,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        // take: Number(pageSize),
        // skip,
        select: {
          user_id: true,
          model: true,
          prompt_tokens: true,
          completion_tokens: true,
        },
      });

      const filteredUsers: (Partial<Request> & { cost: number })[] = requests
        .filter(
          (request: any) =>
            request.user_id !== null &&
            request.user_id !== "" &&
            request.model !== null &&
            request.prompt_tokens !== null &&
            request.completion_tokens !== null
        )
        .map((request: any) => {
          return {
            ...request,
            cost: calculateCost({
              model: request.model as Snapshot,
              input: request.prompt_tokens!,
              output: request.completion_tokens!,
            }),
          };
        });

      const users = filteredUsers.reduce(
        (
          acc: {
            [key: string]: {
              user_id: string;
              total_requests: number;
              total_prompt_tokens: number;
              total_completion_tokens: number;
              total_cost: number;
            };
          },
          user
        ) => {
          if (!user.user_id) return acc;

          if (!acc[user.user_id]) {
            acc[user.user_id] = {
              user_id: user.user_id,
              total_cost: 0,
              total_requests: 0,
              total_prompt_tokens: 0,
              total_completion_tokens: 0,
            };
          }

          acc[user.user_id].total_cost += user.cost;
          acc[user.user_id].total_requests += 1;
          acc[user.user_id].total_prompt_tokens += user.prompt_tokens!;
          acc[user.user_id].total_completion_tokens += user.completion_tokens!;

          return acc;
        },
        {}
      );

      const sortedUsers = Object.values(users).sort(
        (a, b) => b.total_cost - a.total_cost
      );

      const skip = (Number(pageNumber) - 1) * Number(pageSize);
      const take = Number(pageSize);
      const paginatedUsers = sortedUsers.slice(skip, skip + take);

      const totalCount = sortedUsers.length;

      return res.status(200).json({
        users: paginatedUsers,
        totalCount,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
