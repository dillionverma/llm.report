// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";

import { stripe } from "@/lib/stripe/stripe";
// import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import prisma from "@/lib/prisma";
import { getURL } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email?: string;
  uuid: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: uuid,
    },
  });

  if (!user || !user.stripe_customer_id) {
    const customerData: { metadata: { id: string } } = {
      // email: user?.email,
      metadata: {
        id: uuid,
      },
    };

    const customer = await stripe.customers.create(customerData);

    await prisma.user.update({
      where: {
        id: uuid,
      },
      data: {
        stripe_customer_id: customer.id,
      },
    });
    return customer.id;
  }
  return user.stripe_customer_id;
};

const CreateCheckoutSession: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { priceId, quantity = 1, metadata = {} } = req.body;

    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: "You must be logged in." });
      }

      const customer = await createOrRetrieveCustomer({
        uuid: session.user?.id || "",
        email: session.user?.email || "",
      });

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer,
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata,
        },
        success_url: `${getURL()}/`,
        cancel_url: `${getURL()}/`,
      });

      return res.status(200).json({ sessionId: stripeSession.id });
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
};

export default CreateCheckoutSession;
