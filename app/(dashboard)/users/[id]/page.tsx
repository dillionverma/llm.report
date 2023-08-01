import RequestTable from "@/components/RequestTable";
import UserCostPerDayChart from "@/components/users/UserCostPerDayChart";
import { Callout, Card, Col, Grid, Subtitle, Title } from "@tremor/react";
import { ConstructionIcon } from "lucide-react";
import { Suspense } from "react";

export default function User({ params: { id } }: { params: { id: string } }) {
  // const router = useRouter();
  // const id = router.query.id as string;
  return (
    <Grid numItems={3} className="gap-4 w-full">
      <Col numColSpan={3}>
        <Callout title="Alpha feature" icon={ConstructionIcon} color="blue">
          This feature is in alpha and may change at any time.
        </Callout>
      </Col>
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <Title>User: {id}</Title>
          <Subtitle>Detailed information about the user.</Subtitle>
        </Card>
      </Col>
      <Col numColSpan={3}>
        <Card className="shadow-none">
          <Title>Cost</Title>
          <Subtitle>The total cost for user per day</Subtitle>
          <Suspense fallback={<>loading...</>}>
            <UserCostPerDayChart userId={id} />
          </Suspense>
        </Card>
      </Col>
      <Col numColSpan={3}>
        <Card className="shadow-none">
          <Title>Logs</Title>
          <Suspense fallback={<>loading...</>}>
            <RequestTable userId={id} />
          </Suspense>
        </Card>
      </Col>
    </Grid>
  );
}

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const { id } = context.query;
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   const requests = await prisma.request.findMany({
//     where: {
//       userId: session.user.id,
//       user_id: id as string,
//     },
//   });

//   if (requests.length === 0) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {},
//   };
// };
