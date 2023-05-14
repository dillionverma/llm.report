import { FIRST_VISIT_KEY, LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import { Dialog, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

const features = [
  "📊 Complete overview of your API usage",
  "🔐 API keys stored securely in your browser",
];

const navigation = [
  // {
  //   onClick: () => {},
  //   name: "Account",
  //   icon: <UserCircleIcon className="w-5 h-5" />,
  // },
  {
    onClick: () => {},
    name: "Settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    onClick: () => {},
    name: "Feedback",
    icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
  },
];

const navigationFooter = [
  {
    onClick: () => signOut(),
    name: "Logout",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
      </svg>
    ),
  },
];

const navsFooter = [];

const DialogContext = createContext<{
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}>({
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
});

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    openDialog,
    closeDialog,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

const Feedback = () => {
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // save to local storage
    setKey(value);
  };

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="items-start justify-between py-4 md:flex">
            <div>
              <h3 className="text-gray-800 text-2xl font-bold">Feedback</h3>
            </div>
            <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex"></div>
          </div>
          <button
            onClick={() => {
              window.open("https://llmreport.featurebase.app/", "_blank");
            }}
            className="flex items-center justify-center gap-x-2 rounded-lg bg-black py-2 px-4 text-center font-medium text-white duration-150 hover:bg-black/80 hover:shadow-none"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </section>
  );
};

const Settings = () => {
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // save to local storage
    setKey(value);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5 mt-12 lg:pb-12 text-left"
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
          Note: We use your API key to generate the dashboard. API key is stored
          locally.
        </p>
      </div>
    </form>
  );
};

const Main = () => {
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <>
      <div className="relative text-gray-500 sm:hidden p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none w-5 h-5 absolute right-6 inset-y-0 my-auto"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
        <select
          value={navigation[selectedItem].name}
          className="p-3 w-full bg-transparent appearance-none outline-none border rounded-lg shadow-sm focus:border-indigo-600"
          onChange={(e) => {
            const idx = navigation.findIndex(
              (item) => item.name === e.target.value
            );

            setSelectedItem(idx);
            navigation[idx].onClick();
          }}
        >
          {navigation.map((item, idx) => (
            <option key={idx}>{item.name}</option>
          ))}
        </select>
      </div>
      <aside>
        <nav className="fixed top-0 left-0 w-full h-full border-r space-y-8 sm:w-64 transition-transform -translate-x-full md:translate-x-0">
          <div className="flex flex-col h-full">
            <div className="py-8 flex items-center px-8">
              <div className="flex items-center mx-auto">
                <Image src="/logo.svg" width={28} height={28} alt="Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap text-black">
                  LLM Report
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col h-full overflow-auto">
              <ul className="px-4 text-sm font-medium flex-1">
                {navigation.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        setSelectedItem(idx);
                        item.onClick();
                      }}
                      className={`flex w-full items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 ${
                        selectedItem == idx
                          ? "bg-gray-50 text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      <div className="text-gray-500">{item.icon}</div>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <hr />
              <div className="py-4">
                <ul className="px-4 text-sm font-medium flex-1">
                  {navigationFooter.map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => {
                          setSelectedItem(idx);
                          item.onClick();
                        }}
                        className={`flex w-full items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0`}
                      >
                        <div className="text-gray-500">{item.icon}</div>
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      <div className="p-4 md:ml-64 overflow-y-auto h-full min-h-[70vh]">
        {selectedItem === 0 && <Settings />}
        {selectedItem === 1 && <Feedback />}
        {/* {selectedItem === 2 && <Pricing />} */}
      </div>
    </>
  );
};

const Login = () => {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <div className=" w-full max-w-screen relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
            <stop stopColor="#d97706" />
            <stop offset={1} stopColor="#dc2626" />
          </radialGradient>
        </defs>
      </svg>
      <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Get clarity on your OpenAI API usage.
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Empower your team with insightful billing data visualizations and
          reporting tools.
        </p>
        <div className="mt-10 flex items-center flex-col lg:flex-row space-y-4 lg:space-y-0 justify-center gap-x-6 lg:justify-start">
          <button
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { callbackUrl: "/" });
            }}
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline flex space-x-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_17_40)">
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p>Continue with Google</p>
          </button>
          <button
            onClick={() => {
              setSignInClicked(true);
              signIn("github", { callbackUrl: "/" });
            }}
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline flex space-x-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              className="h-5 w-5"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <p>Continue with Github</p>
          </button>
          {/* <a
              href="#"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white"
            >
              Learn more <span aria-hidden="true">→</span>
            </a> */}
        </div>

        <ul className="p-4 space-y-3 text-white">
          <li className="pb-2 font-medium">
            <p>Features</p>
          </li>
          {features.map((featureItem, idx) => (
            <li key={idx} className="flex items-center gap-5 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              {featureItem}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-16 h-80 lg:mt-8">
        {/* <Card className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-gray-900 ring-1 ring-white/10">
            <MonthlyChart
              startDate={sub(new Date(), {
                days: 10,
              })}
              endDate={new Date()}
              categories={CATEGORIES}
              demo
            />
          </Card> */}
        <Image
          className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
          src="/screenshot.png"
          alt="App screenshot"
          rel="preload"
          priority
          width={1824}
          height={1080}
        />
      </div>
    </div>
  );
};

const SettingsModal = () => {
  const { isOpen, openDialog, closeDialog } = useDialog();
  const { data: session } = useSession();
  const [subscribed, setSubscribed] = useState(true);
  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   (async () => {
  //     if (!session?.user) return;
  //     const res = await axios.get("/api/v1/me");
  //     const isSubscribed =
  //       res.data.user.subscriptions.filter(
  //         (sub: any) => sub.status === "active" || sub.status === "trialing"
  //       ).length > 0 ||
  //       res.data.user.payments.filter(
  //         (payment: any) => payment.status === "succeeded"
  //       ).length > 0;

  //     // setSubscribed(isSubscribed);
  //     setUser(res.data.user);
  //   })();
  // }, [session?.user]);

  const [firstVisit, setFirstVisit] = useLocalStorage<boolean>(
    FIRST_VISIT_KEY,
    true
  );

  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  useEffect(() => {
    if (firstVisit) {
      toast("Hi there!", { icon: "👋", duration: 5000 });
    }
  }, [firstVisit]);

  useEffect(() => {
    setTimeout(() => {
      if (!firstVisit) return;
      if (session?.user) return;
      // if (subscribed) return;

      setFirstVisit(false);
      openDialog();
    }, 9000);
  }, [firstVisit, session?.user]);

  // useEffect(() => {
  //   if (session?.user && user && !subscribed && !key) {
  //     openDialog();
  //     toast("Choose a payment plan", { icon: "💳", duration: 5000 });
  //   }
  // }, [subscribed, key, session?.user, user]);

  const router = useRouter();

  useEffect(() => {
    if (session?.user && !key) {
      // openDialog();
      toast("Enter your API key", { icon: "🔑", duration: 5000 });
      // router.push("/settings");
    }
  }, [session?.user, key]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex flex-col h-screen  min-w-screen items-center justify-center p-8 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-400"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full  lg:w-[70vw] lg:max-w-[80vw] lg:max-h-[80vh] transform overflow-hidden rounded-2xl bg-white text-center align-middle shadow-xl transition-all ">
                  {session?.user ? (
                    <>
                      <Main />
                    </>
                  ) : (
                    <Login />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SettingsModal;
