"use client";

import LogsOnboarding from "@/app/(dashboard)/logs/logs-onboarding";
import RequestTable from "@/components/RequestTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCopyCode } from "@/lib/copyCode";
import { useLogCount } from "@/lib/hooks/useLogCount";
import { Col, Grid } from "@tremor/react";
import { Suspense } from "react";

export default function LogsPage({ code }: { code: any }) {
  useCopyCode();
  const { data, isLoading, refetch } = useLogCount({});
  const logCount = data?.count;

  return (
    <Suspense>
      {!isLoading && logCount < 1 && (
        <LogsOnboarding code={code} onRefresh={refetch} />
      )}
      {!isLoading && logCount >= 1 && (
        <Grid numItems={1} numItemsLg={1} className="gap-6 w-full">
          <Col numColSpan={1}>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Logs</CardTitle>
                <CardDescription>
                  Analyze your logs and see how your prompts are performing.
                </CardDescription>
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
      )}
    </Suspense>
  );
}
