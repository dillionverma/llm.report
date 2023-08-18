import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { sha256 } from "../keys";

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
  let userId = null as string | null;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({
        error: "You must be logged in or provide an API key.",
      });
    }
    const user = await getUser(token);
    if (!user) {
      return res.status(401).json({
        error: "Invalid API key.",
      });
    }
    userId = user.id;
  } else {
    userId = session.user.id;
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
                path: ["$.prompt"],
                string_contains: `${search}`,
              },
            },
            {
              request_body: {
                path: ["$.messages[*].content"],
                array_contains: `${search}`,
              },
            },
            {
              completion: {
                contains: `${search}`,
                mode: "insensitive",
              },
            },
          ] as any[],
        }
      : {};

    const requests = await prisma.request.findMany({
      where: {
        userId,
        ...(user_id && { user_id: decodeURIComponent(user_id) }),
        // ...where,
        ...searchFilter,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: Number(pageSize),
      skip,
      // include: {
      //   metadata: true,
      // },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        ip: true,
        url: true,
        method: true,
        status: true,
        cached: true,
        streamed: true,
        // metadata: true,
        user_id: true,
        completion: true,
        model: true,
        openai_id: true,
        cost: true,

        prompt_tokens: true,
        completion_tokens: true,

        request_body: true,
        response_body: true,
        streamed_response_body: true,
      },
    });

    const totalCount = await prisma.request.count({
      where: {
        userId,
        ...(user_id && { user_id: user_id }),
        // ...where,
        ...searchFilter,
      },
    });

    return res.status(200).json({
      requests,
      totalCount,
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

const getBearerToken = (request: NextApiRequest) => {
  const headers = request.headers;
  const authorizationHeader = headers.authorization;

  if (!authorizationHeader) return null;
  const token = authorizationHeader.replace("Bearer ", "");
  return token;
};

const getUser = async (apiKey: string) => {
  const key = await prisma.apiKey.findUnique({
    where: {
      hashed_key: await sha256(apiKey),
    },
    include: {
      user: true,
    },
  });
  return key?.user;
};
