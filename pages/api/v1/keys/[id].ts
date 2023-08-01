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

  if (req.method === "DELETE") {
    const { id } = req.query;

    const key = await prisma.apiKey.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!key) {
      return res.status(404).json({ error: "Key not found" });
    }

    if (key.userId !== session.user.id) {
      return res.status(401).json({ error: "You do not own this key" });
    }

    await prisma.apiKey.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({ key });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
