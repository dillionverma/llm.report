"use client";

import StripePortalButton from "@/components/StripePortalButton";
import { fetcher } from "@/lib/utils";
import { Card, Flex, Text, Title } from "@tremor/react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import useSWR from "swr";

const Billing = () => {
  const { data, isLoading } = useSWR("/api/v1/me", fetcher);

  return (
    <div className="max-w-[800px] space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Billing</Title>
          </div>
          <Text>Update your billing information</Text>
        </div>
      </Flex>

      {!isLoading && data?.user && (
        <Card className="shadow-none">
          <StripePortalButton customerId={data.user.stripe_customer_id}>
            Manage Billing
          </StripePortalButton>
        </Card>
      )}
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default Billing;
