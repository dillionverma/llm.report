interface PlanLinks {
  monthly: string;
  yearly: string;
}

interface SubscriptionPlan {
  free: PlanLinks;
  pro: PlanLinks;
}

export interface SubscriptionPlans {
  development: SubscriptionPlan;
  test: SubscriptionPlan;
  production: SubscriptionPlan;
}

export const subscriptionPlans = {
  development: {
    free: {
      monthly: "https://buy.stripe.com/test_9AQ7use7tcS5bhm289",
      yearly: "https://buy.stripe.com/test_fZe5mk9Rdg4h3OUaEH",
    },
    pro: {
      monthly: "https://buy.stripe.com/test_9AQ7use7tcS5bhm289",
      yearly: "https://buy.stripe.com/test_fZe5mk9Rdg4h3OUaEH",
    },
    // team: {
    //   monthly: "https://buy.stripe.com/test_9AQ4igbZl3hvdpu002",
    //   yearly: "https://buy.stripe.com/test_00gdSQ0gD9FT1GMeV0",
    // },
  },
  test: {
    free: {
      monthly: "https://buy.stripe.com/test_9AQ7use7tcS5bhm289",
      yearly: "https://buy.stripe.com/test_fZe5mk9Rdg4h3OUaEH",
    },
    pro: {
      monthly: "https://buy.stripe.com/test_9AQ7use7tcS5bhm289",
      yearly: "https://buy.stripe.com/test_fZe5mk9Rdg4h3OUaEH",
    },
    // team: {
    //   monthly: "https://buy.stripe.com/test_9AQ4igbZl3hvdpu002",
    //   yearly: "https://buy.stripe.com/test_00gdSQ0gD9FT1GMeV0",
    // },
  },
  production: {
    free: {
      monthly: "https://buy.stripe.com/fZe4hL0fWb7KdEI289",
      yearly: "https://buy.stripe.com/28o4hL0fW0t6dEI7su",
    },
    pro: {
      monthly: "https://buy.stripe.com/fZe4hL0fWb7KdEI289",
      yearly: "https://buy.stripe.com/28o4hL0fW0t6dEI7su",
    },
    // team: {
    //   monthly: "https://buy.stripe.com/fZeg0t2o41xa6cg6ot",
    //   yearly: "https://buy.stripe.com/28o6pT1k03FifMQbIO",
    // },
  },
};
