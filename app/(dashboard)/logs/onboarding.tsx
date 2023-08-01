"use client";

import Onboarding from "@/components/Onboarding";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingView({ code }: { code: any }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(1); // set default to 1 for now
  const { status } = useSession();
  const router = useRouter();
  const handleRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  if (status === "unauthenticated") {
    router.push("/");
  }

  useEffect(() => {
    if (status === "authenticated") {
      const apiUrl = `/api/v1/requests`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setTotalCount(data.totalCount);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [refreshKey, status]);

  return (
    <>
      {!loading && totalCount < 1 && (
        <Onboarding code={code} onRefresh={handleRefresh} />
      )}
    </>
  );
}
