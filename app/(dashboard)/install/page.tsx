import Docs from "@/app/(dashboard)/install/docs";
import KeysTable from "@/app/(dashboard)/install/keys-table";
import { Heading } from "@/components/heading";
import { getUsersCode } from "@/lib/markdown-code";
import { Flex, Text, Title } from "@tremor/react";
import { Suspense } from "react";

export default async function Install() {
  const code = await getUsersCode();

  return (
    <div className="max-w-4xl space-y-4">
      {/* <Flex className="flex-col items-start space-y-4 xl:flex-row xl:items-center">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Installation</Title>
          </div>
          <Text>
            LLM Report uses API keys to authenticate your requests to the LLM
            Report proxy API.
          </Text>
        </div>
      </Flex> */}
      <Heading
        title="Installation"
        description="  LLM Report uses API keys to authenticate your requests to the LLM
            Report proxy API."
      />
      <Suspense fallback={<></>}>
        <KeysTable />
      </Suspense>

      <Suspense fallback={<></>}>
        <Docs code={code} />
      </Suspense>
    </div>
  );
}
