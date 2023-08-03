"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUserCount = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0); // set default to 1 for now
  const { status } = useSession();
  const handleChange = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  useEffect(() => {
    if (status === "authenticated") {
      const apiUrl = `/api/v1/requests/user-count`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setUserCount(data.totalCount);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [refreshKey, status]);

  return { userCount, loading, handleChange };
};
