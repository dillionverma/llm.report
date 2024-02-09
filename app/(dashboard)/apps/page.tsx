import UsersPage from "@/app/(dashboard)/apps/apps-page";
import { getUsersCode } from "@/lib/markdown-code";

export default async function Users() {
  const code = await getUsersCode();
  return <UsersPage code={code} />;
}
