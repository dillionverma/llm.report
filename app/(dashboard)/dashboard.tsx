"use client";

import OnboardingDashboard from "@/components/OnboardingDashboard";
import Dashboard from "@/components/dashboard";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/services/openai";
import useLocalStorage from "@/lib/use-local-storage";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Callout } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [validKey, setValidKey] = useState(true);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  useEffect(() => {
    (async () => setValidKey(await openai.isValidKey(key)))();
  }, [key]);

  if (status != "authenticated") return null;

  return (
    <>
      <Callout
        title="OpenAI API changes"
        icon={ExclamationCircleIcon}
        color="blue"
        className="my-4"
      >
        OpenAI introduced a new change to their API this morning (July 20,
        2023). They no longer allow third party apps to access their /api/usage
        endpoint which we use to display this dashboard.{" "}
        <strong>
          We have introduced a new workaround to get around this issue. It
          requires you to enter your session token from the OpenAI website.
        </strong>
      </Callout>
      {(!key || !validKey) && <OnboardingDashboard />}
      {key && validKey && <Dashboard key={key} />}
    </>
  );
};

export default DashboardPage;
