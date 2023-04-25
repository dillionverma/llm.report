import { Card, Grid, Text, Title } from "@tremor/react";

export default function KpiCardGrid() {
  // useEffect(() => {
  //   (async () => {
  //     const response = await axios.get(
  //       "https://api.openai.com/v1/usage?date=2023-04-19",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //         },
  //       }
  //     );
  //   })();
  // });

  return (
    <main className="h-screen bg-slate-50 p-6 sm:p-10">
      <Title>OpenAI Dashboard</Title>
      <Text>Let&apos;s see how we&apos;re doing today</Text>

      {/* Main section */}
      <Card className="mt-6">
        <div className="h-96" />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
      </Grid>
    </main>
  );
}
