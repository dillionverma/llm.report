import { Flex, Text, Title } from "@tremor/react";

export default function FeatureRequest() {
  return (
    <div className="max-w-[1200px] space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Feature Requests</Title>
          </div>
          <Text>
            We use featurebase for feedback and bug reports. Login below to
            share feedback!
          </Text>
        </div>
      </Flex>

      <iframe
        style={{ background: "white" }}
        className="w-full h-[90vh] rounded-lg border"
        src="https://llmreport.featurebase.app"
      ></iframe>
    </div>
  );
}
