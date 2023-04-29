import { PricingPlan, priceIds } from "@/lib/constants";
import getStripe from "@/lib/stripe/getStripe";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StripePortalButton from "./StripePortalButton";

type BillingInterval = "year" | "month";

const plans = [
  {
    name: "Developer",
    desc: "For solo developers / founders",
    price: 10,
    isMostPop: true,
    features: ["Real-time analytics"],
  },
  {
    name: "Startup",
    desc: "For fast growing startups",
    price: 50,
    isMostPop: false,
    features: [
      "Real-time analytics",
      "Email alerts (coming soon)",
      "Slack alerts (coming soon)",
      "Weekly reports (coming soon)",
      "Priority support",
      "Feature requests",
    ],
  },
  // {
  //   name: "Enterprise",
  //   desc: "For large companies",
  //   price: 500,
  //   isMostPop: false,
  //   features: [
  //     "Curabitur faucibus",
  //     "massa ut pretium maximus",
  //     "Sed posuere nisi",
  //     "Pellentesque eu nibh et neque",
  //     "Suspendisse a leo",
  //     "Praesent quis venenatis ipsum",
  //     "Duis non diam vel tortor",
  //   ],
  // },
];

const Pricing = () => {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [subscribed, setSubscribed] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);
  const { data } = useSession();

  const handleCheckout = async (name: PricingPlan) => {
    const priceId = priceIds[process.env.NODE_ENV][name][billingInterval];

    try {
      const {
        data: { sessionId },
      } = await axios.post<{ sessionId: string }>("/api/v1/stripe/checkout", {
        priceId,
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      // setPriceIdLoading(undefined);
    }
  };

  const [user, setUser] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (!data?.user) return;
      const res = await axios.get("/api/v1/me");
      console.log(res);

      const isSubscribed =
        res.data.user.subscriptions.filter(
          (sub: any) => sub.status === "active"
        ).length > 0;

      const isLifetime =
        res.data.user.payments.filter(
          (payment: any) => payment.status === "succeeded"
        ).length > 0;

      setSubscribed(isSubscribed);
      setIsLifetime(isLifetime);
      setUser(res.data.user);
    })();
  }, [data?.user]);

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        {!subscribed && !isLifetime && (
          <>
            <div className="relative max-w-xl mx-auto sm:text-center mb-8">
              <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                Choose a plan
              </h3>
            </div>

            {process.env.NODE_ENV === "production" && (
              <>
                {/* @ts-ignore */}
                <stripe-pricing-table
                  client-reference-id={data?.user.id}
                  customer-email={data?.user.email}
                  pricing-table-id="prctbl_1N2Eb9B24wj8TkEzaJUNfSjS"
                  publishable-key="pk_live_51N1AtxB24wj8TkEz3li5RqdgbYON9DXrSudOzmMc80gegb5h8CFPpXIUEvIur8yckJlmsbR8sqKrN58O5m6h8uOW00Syk5n0vt"
                />
              </>
            )}

            {process.env.NODE_ENV === "development" && (
              <>
                {/* @ts-ignore */}
                <stripe-pricing-table
                  client-reference-id={data?.user.id}
                  customer-email={data?.user.email}
                  pricing-table-id="prctbl_1N1vPHB24wj8TkEzwXcFhcOS"
                  publishable-key="pk_test_51N1AtxB24wj8TkEzMfn8iSqXkThvyKEaiWrGe7L8DQaGhojJpaud2xWyCQfzymmK7ZPwsewSYzg0i1fSkSpnMpjG00w9h7rhtj"
                />
              </>
            )}
          </>
        )}

        {(subscribed || isLifetime) && (
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between py-4 md:flex">
              <div>
                <h3 className="text-gray-800 text-2xl font-bold">Account</h3>
              </div>
              <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex"></div>
            </div>

            {isLifetime && (
              <div className="flex animate">
                WOOHOO! You have lifetime access 🎉 🥳
              </div>
            )}
            {subscribed && !isLifetime && (
              <StripePortalButton customerId={user.stripe_customer_id}>
                Manage Subscription
              </StripePortalButton>
            )}
          </div>
        )}

        {/* <div className="mt-16 justify-center gap-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-2">
          {plans.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex-1 flex items-stretch flex-col rounded-xl border-2 mt-6 sm:mt-0 ${
                item.isMostPop ? "mt-10" : ""
              }`}
            >
              {item.isMostPop ? (
                <span className="w-32 absolute -top-5 left-0 right-0 mx-auto px-3 py-2 rounded-full border shadow-md bg-white text-center text-gray-700 text-sm font-semibold">
                  Most popular
                </span>
              ) : (
                ""
              )}
              <div className="p-8 space-y-4 border-b">
                <span className="text-blue-600 font-medium">{item.name}</span>
                <div className="text-gray-800 text-3xl font-semibold">
                  ${item.price}{" "}
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
                <p>{item.desc}</p>
                <button
                  onClick={() => handleCheckout(item.name as PricingPlan)}
                  className="px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
                >
                  Get Started
                </button>
              </div>
              <ul className="p-8 space-y-3">
                <li className="pb-2 text-gray-800 font-medium">
                  <p>Features</p>
                </li>
                {item.features.map((featureItem, idx) => (
                  <li key={idx} className="flex items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {featureItem}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Pricing;
