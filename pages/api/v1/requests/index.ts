import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export type QueryParameters = {
  search?: string;
  sortBy?: keyof typeof sortingFields;
  sortOrder?: "asc" | "desc";
  pageSize?: number;
  pageNumber?: number;
  filter?: string;
};

export const sortingFields = {
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
      take: Number(pageSize),
      skip,
      include: {
        metadata: true,
      },
    });

    const totalCount = await prisma.request.count({
      where: {
        userId: session.user.id,
        ...where,
        ...searchFilter,
      },
    });

    return res.status(200).json({
      requests,
      totalCount,
    });

    // // https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access
    // const requests = await prisma.$queryRawUnsafe(`
    //     SELECT * FROM "Request"

    //     WHERE

    //       userId = "${session.user.id}" AND

    //       (
    //         JSON_UNQUOTE(
    //           JSON_EXTRACT(request_body, "$.prompt")) LIKE "%${search}%"

    //         OR

    //         JSON_UNQUOTE(
    //           JSON_EXTRACT(request_body, "$.messages[*].content")) LIKE "%${search}%"

    //         OR
    //           completion LIKE "%${search}%"
    //       )

    //     ORDER BY ${sortBy} ${sortOrder}
    //     LIMIT ${pageSize}
    //     OFFSET ${skip};
    //     `);

    // const totalCount = await prisma.$queryRawUnsafe(`
    //     SELECT COUNT(*) FROM "Request"

    //     WHERE
    //       userId = "${session.user.id}" AND

    //       (
    //         JSON_UNQUOTE(
    //           JSON_EXTRACT(request_body, "$.prompt")) LIKE "%${search}%"

    //         OR

    //         JSON_UNQUOTE(
    //           JSON_EXTRACT(request_body, "$.messages[*].content")) LIKE "%${search}%"

    //         OR
    //           completion LIKE "%${search}%"
    //       )

    //     `);

    // console.log(totalCount);

    // return res.status(200).json({
    //   requests,
    //   totalCount: new Number((totalCount as any[])[0]["count(*)"]),
    // });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
