import {
  BarChart,
  Callout,
  Card,
  Col,
  Grid,
  Subtitle,
  Title,
} from "@tremor/react";
import { ConstructionIcon } from "lucide-react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Suspense } from "react";

const chartdata = [
  {
    name: "Amphibians",
    cost: 2488,
  },
  {
    name: "Birds",
    cost: 1445,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
  {
    name: "Crustaceans",
    cost: 743,
  },
];

const dataFormatter = (number: number) => {
  return `$ ${Intl.NumberFormat("us").format(number).toString()}`;
};

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
          <Suspense fallback={<></>}>
            <BarChart
              data={chartdata}
              index="name"
              categories={["cost"]}
              colors={["amber"]}
              valueFormatter={dataFormatter}
            />
          </Suspense>
        </Card>
      </Col>
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <Title>Users</Title>
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
