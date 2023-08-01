"use client";

import DeleteDialog from "@/app/(dashboard)/install/delete-dialog";
import KeyDialog from "@/app/(dashboard)/install/key-dialog";
import { fetcher } from "@/lib/utils";
import { Card } from "@tremor/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function KeysTable() {
  const router = useRouter();
  const { data, status } = useSession();
  if (status === "unauthenticated") {
    router.push("/");
  }

  const { data: keys, error, isLoading } = useSWR("/api/v1/keys", fetcher);

  return (
    <Card className="shadow-none">
      <div className="overflow-scroll p-2">
        {data?.user && !isLoading && keys?.keys && keys.keys.length > 0 && (
          <table className="w-full table-auto text-sm text-left">
            <thead className=" text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Key</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {!isLoading &&
                keys.keys &&
                keys.keys.map((key: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{key.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {key.sensitive_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(key.createdAt), "MMM dd, yyyy")}
                    </td>

                    <td className="text-right px-6 whitespace-nowrap">
                      <DeleteDialog id={key.id} hashed={key.sensitive_id} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <KeyDialog />
      </div>
    </Card>
  );
}
