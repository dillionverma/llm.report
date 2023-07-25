import UserCostChart from "@/components/users/UserCostChart";
import UserTable from "@/components/users/UserTable";
import { Callout, Card, Col, Grid, Subtitle, Title } from "@tremor/react";
import { ConstructionIcon } from "lucide-react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Suspense } from "react";

export default function Users() {
  return (
    <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
      <Col numColSpan={1}>
        <Callout title="Alpha feature" icon={ConstructionIcon} color="blue">
          This feature is in alpha and may change at any time.
        </Callout>
      </Col>
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <Title>Cost per user</Title>
          <Subtitle>The total cost of each user in the last 30 days.</Subtitle>
          <Suspense fallback={<>loading...</>}>
            <UserCostChart />
          </Suspense>
        </Card>
      </Col>
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <Title>Users</Title>
          <Suspense fallback={<>loading...</>}>
            <UserTable />
          </Suspense>
        </Card>
      </Col>
    </Grid>
  );
}

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
