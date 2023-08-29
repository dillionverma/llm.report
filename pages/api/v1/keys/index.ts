import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const generateKey = (size: number = 32, format: BufferEncoding = "hex") => {
  const buffer = randomBytes(size);
  return buffer.toString(format);
};

export async function sha256(message: string) {
  const hash = createHash("sha256"); // Use createHash to create a hash object
  hash.update(message, "utf8"); // Update the hash with the message
  const hashHex = hash.digest("hex"); // Get the hash digest in hex format
  return hashHex;
}

const sensitizeKey = (key: string, numStars: number = 16) => {
  const stars = "*".repeat(numStars);
  return `${key.slice(0, 4)}${stars}${key.slice(-4)}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const { name } = req.body;

  if (req.method === "POST") {
    const key = generateKey(32);
    const hashedKey = await sha256(key);
    const sensitizedKey = sensitizeKey(key, 8);

    const k = await prisma.apiKey.create({
      data: {
        name: name || "",
        sensitive_id: sensitizedKey,
        hashed_key: hashedKey,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return res.status(200).json({ key });
  } else if (req.method === "GET") {
    const keys = await prisma.apiKey.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
    });

    const keysResponse = keys.map((key: any) => {
      return {
        ...key,
        hashed_key: undefined,
      };
    });

    return res.status(200).json({ keys: keysResponse });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
