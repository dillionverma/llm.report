import { Card, Flex, Title } from "@tremor/react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

const CostPlayground = () => {
  return (
    <div className="max-w-[800px] space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Cost Playground</Title>
          </div>
        </div>
      </Flex>

      <Card className="shadow-none"></Card>
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

export default CostPlayground;
