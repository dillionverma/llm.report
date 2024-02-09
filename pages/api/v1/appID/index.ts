import { authOptions } from "@/lib/auth";
import { calculateCost } from "@/lib/llm/calculateCost";
import prisma from "@/lib/prisma";
import { Snapshot } from "@/lib/types";
import { Request } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

type ExtendedRequest = Partial<Request> & {
  app_id?: string; // Assuming app_id can be optional
  cost: number; // Since you're adding this property manually
};

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
                app_id: {
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
          app_id: true,
          model: true,
          prompt_tokens: true,
          completion_tokens: true,
        },
      });

      const filteredUsers: ExtendedRequest[] = requests
        .filter(
          (request: any) =>
            request.app_id !== null &&
            request.app_id !== "" &&
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

      const costsByAppId = filteredUsers.reduce(
        (acc, currentRequest) => {
          const appId = currentRequest.app_id; // Corrected way to access app_id of the current request

          if (!appId) return acc; // Skip if app_id is not present

          if (!acc[appId]) {
            acc[appId] = {
              app_id: appId,
              total_requests: 0,
              total_prompt_tokens: 0,
              total_completion_tokens: 0,
              total_cost: 0,
            };
          }

          acc[appId].total_requests += 1;
          acc[appId].total_prompt_tokens += currentRequest.prompt_tokens!;
          acc[appId].total_completion_tokens +=
            currentRequest.completion_tokens!;
          acc[appId].total_cost += currentRequest.cost;

          return acc;
        },
        {} as {
          [key: string]: {
            app_id: string;
            total_requests: number;
            total_prompt_tokens: number;
            total_completion_tokens: number;
            total_cost: number;
          };
        }
      );

      // console.log(costsByAppId);

      // Sort by total_cost in descending order
      const costsArray = Object.values(costsByAppId).sort(
        (a, b) => b.total_cost - a.total_cost
      );

      // Calculate skip based on pageNumber and pageSize
      const skip = (pageNumber - 1) * pageSize;

      // Implement pagination logic if necessary
      const paginatedCosts = costsArray.slice(skip, skip + pageSize);

      const totalCount = costsArray.length;

      return res.status(200).json({
        apps: paginatedCosts,
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
