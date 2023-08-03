import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (req.method === "GET") {
    const totalCount = await prisma.request.count({
      where: {
        userId: session.user.id,
        user_id: {
          not: null,
        },
      },
    });

    console.log(totalCount);

    return res.status(200).json({
      totalCount,
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
