import UsersPage from "@/app/(dashboard)/users/users-page";
import { getUsersCode } from "@/lib/markdown-code";

export default async function Users() {
  const code = await getUsersCode();
  return <UsersPage code={code} />;
}
