import { COST_PER_UNIT, CompletionModelCost } from "@/lib/llm/calculateCost";
import prisma from "@/lib/prisma";
import { Snapshot } from "@/lib/types";
import { Request } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

type QueryParameters = {
  search?: string;
  sortBy?: keyof typeof sortingFields;
  sortOrder?: "asc" | "desc";
  pageSize?: number;
  pageNumber?: number;
  filter?: string;
};

const sortingFields = {
  id: "id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  // ip: "ip",
  // url: "url",
  // method: "method",
  // status: "status",
  // cached: "cached",
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
      }: QueryParameters = req.query as unknown as QueryParameters;

      const skip = (Number(pageNumber) - 1) * Number(pageSize);
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

      // const requests = await prisma.request.groupBy({
      //   by: ["user_id", "id"],
      //   where: {
      //     userId: session.user.id,
      //     ...where,
      //     ...searchFilter,
      //   },
      //   _count: {
      //     _all: true,
      //   },
      //   _sum: {
      //     prompt_tokens: true,
      //     completion_tokens: true,
      //   },
      //   orderBy: {
      //     // [sortBy]: sortOrder,
      //   },
      //   take: Number(pageSize),
      //   skip,
      // });

      // const users = requests.map((item) => ({
      //   user_id: item.user_id,
      //   num_requests: item._count._all,
      //   total_prompt_tokens: item._sum.prompt_tokens,
      //   total_completion_tokens: item._sum.completion_tokens,
      // }));

      const requests = await prisma.request.findMany({
        where: {
          userId: session.user.id,
          ...where,
          ...searchFilter,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: Number(pageSize),
        skip,
        select: {
          // userId: true,
          user_id: true,
          model: true,
          prompt_tokens: true,
          completion_tokens: true,
        },
      });

      const filteredUsers: (Partial<Request> & { cost: number })[] = requests
        .filter(
          (request) =>
            request.user_id !== null &&
            request.model !== null &&
            request.prompt_tokens !== null &&
            request.completion_tokens !== null
        )
        .map((request) => {
          const costPerUnit = COST_PER_UNIT[
            request.model as Snapshot
          ] as CompletionModelCost;

          return {
            ...request,
            cost:
              costPerUnit.prompt * request.prompt_tokens! +
              costPerUnit.completion * request.completion_tokens!,
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

      const totalCount = await prisma.request.count({
        where: {
          userId: session.user.id,
          ...where,
        },
      });

      return res.status(200).json({
        users: sortedUsers,
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
