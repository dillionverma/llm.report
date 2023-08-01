import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe/stripe";
import { getURL } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { createOrRetrieveCustomer } from "./checkout";

export default async function billingPortalRedirectHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: "You must be logged in." });
      }

      const user = session.user;

      if (!user) throw Error("Could not get user");

      const customer = await createOrRetrieveCustomer({
        uuid: user.id || "",
        email: user.email || "",
      });

      if (!customer) throw Error("Could not get customer");

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}`,
      });
      res.redirect(301, url);
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
