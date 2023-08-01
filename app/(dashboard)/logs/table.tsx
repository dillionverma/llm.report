import RequestTable from "@/components/RequestTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Col, Grid } from "@tremor/react";
import { Suspense } from "react";

export default function Table() {
  return (
    <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
      <Col numColSpan={1}>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>OpenAI Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <Title>OpenAI Logs</Title> */}
            <Suspense fallback={<></>}>
              <RequestTable />
            </Suspense>
          </CardContent>
        </Card>
      </Col>
    </Grid>
  );
}
