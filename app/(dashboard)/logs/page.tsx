import LogsPage from "@/app/(dashboard)/logs/logs-page";
import { getLogsCode } from "@/lib/markdown-code";

export default async function Logs() {
  const code = await getLogsCode();
  return <LogsPage code={code} />;
}
