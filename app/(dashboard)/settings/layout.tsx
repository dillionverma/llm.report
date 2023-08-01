import { SidebarNav } from "@/components/settings/SidebarNav";
import { Flex, Text, Title } from "@tremor/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const SettingsLayout = ({ children }: { children: any }) => {
  return (
    <div className="max-w-4xl space-y-4">
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

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
