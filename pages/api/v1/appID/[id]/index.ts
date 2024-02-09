import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

type QueryParameters = {
  user_id?: string;
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
  ip: "ip",
  url: "url",
  method: "method",
  status: "status",
  cached: "cached",
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
    const {
      user_id = "",
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      pageSize = 10,
      pageNumber = 1,
      filter = "{}",
    }: QueryParameters = req.query as unknown as QueryParameters;

    const skip = (Number(pageNumber) - 1) * Number(pageSize);
    // const where = isEmpty(JSON.parse(filter)) ? { OR: JSON.parse(filter) } : {};
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

            // {
            //   response_body: {
            //     path: "$.choices[*].message.content",
            //     array_contains: `${search}`,
            //   },
            // },
            // {
            //   response_body: {
            //     path: "$.choices[*].text",
            //     array_contains: `${search}`,
            //   },
            // },
          ] as any[],
        }
      : {};

    const requests = await prisma.request.findMany({
      where: {
        userId: session.user.id,
        ...(user_id && { user_id: user_id }),
        // ...where,
        ...searchFilter,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: Number(pageSize),
      skip,
      include: {
        metadata: true,
      },
    });

    return res.status(200).json({
      requests,
      totalCount: requests.length,
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
