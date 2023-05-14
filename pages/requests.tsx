import RequestTable from "@/components/RequestTable";
import { Callout, Card, Col, Grid, Title } from "@tremor/react";
import { FlaskConical } from "lucide-react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function Requests() {
  return (
    <>
      <Callout
        title="This feature is currently in alpha"
        icon={FlaskConical}
        color="blue"
      >
        Get your API key{" "}
        <Link href="/api-keys" className="underline">
          here
        </Link>
        .
      </Callout>
      <Grid numCols={1} numColsLg={1} className="gap-6 mt-4 w-full">
        <Col numColSpan={1}>
          <Card className="shadow-none">
            <Title>OpenAI Requests</Title>
            <RequestTable />
          </Card>
        </Col>
        {/* <Col>
        <Card className="shadow-none">
          <Title>OpenAI Requests Details</Title>
      
        </Card>
      </Col> */}
      </Grid>
    </>
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
