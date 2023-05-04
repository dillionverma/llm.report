import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import { Card, Flex, Text, Title } from "@tremor/react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";

const Settings = () => {
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // save to local storage
    setKey(value);
  };

  return (
    <div className="max-w-[800px] space-y-4">
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

      <Card className="shadow-none">
        {/* <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <Text className="text-xl">Open AI Api Key</Text>
          </div>
        </div> */}

        <form
          onSubmit={(e) => e.preventDefault()}
          // className="space-y-5 mt-12 lg:pb-12 text-left"
        >
          <div>
            <label className="font-medium text-gray-500">OpenAI API Key</label>
            <input
              type="text"
              name={LOCAL_STORAGE_KEY}
              onChange={onChange}
              required
              value={key as string}
              className="w-full my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
              placeholder="sk-5q293fh..."
            />

            <p className="text-sm text-gray-500  mt-1 inline-block">
              Find API Key{" "}
              <Link
                href="https://beta.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                here.
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Note: The initial load may take up to 30 seconds.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Note: We use your API key to generate the dashboard. API key is
              stored locally.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default Settings;
