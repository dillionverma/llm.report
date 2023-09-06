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
    const metadataKeys: { metadata_key: string }[] = await prisma.$queryRaw`
      WITH keys AS (
          SELECT 
              jsonb_object_keys(request_headers) AS metadata_key
          FROM 
            "Request"
      )
      SELECT 
          metadata_key
      FROM 
          keys
      WHERE 
          metadata_key ILIKE 'x-metadata-%';
    `;

    // Strip the "x-metadata-" prefix from the metadata keys
    const metadata = [...new Set(metadataKeys.map((m) => m.metadata_key))];

    console.log(JSON.stringify(metadata, null, 2));

    return res.status(200).json(metadata);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
