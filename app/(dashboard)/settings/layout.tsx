import { SidebarNav } from "@/app/(dashboard)/settings/sidebar-nav";
import { Flex, Text, Title } from "@tremor/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | llm.report",
  description: "Manage your billing, team, and OpenAI settings here.",
};

const SettingsLayout = ({ children }: { children: any }) => {
  return (
    <div className="max-w-5xl space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Settings</Title>
          </div>
          <Text>
            Change your settings below. You can also change your API key here.
          </Text>
        </div>
      </Flex>

      <div className="flex flex-col space-y-8">
        <SidebarNav />
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
