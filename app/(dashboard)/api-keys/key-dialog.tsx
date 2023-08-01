"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@tremor/react";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

const KeyDialog = () => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);

    setTimeout(() => {
      setName("");
      setKey("");
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [name, setName] = useState<string>();
  const [key, setKey] = useState<string>();

  const handleSubmit = async () => {
    const res = await fetch("/api/v1/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(json);

    toast.success("Key generated successfully!");

    setKey(json.key);
    mutate("/api/v1/keys");
    // closeModal();
  };

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  return (
    <>
      <Button type="button" onClick={openModal}>
        Create
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {!key ? "Create a new key" : "Your key"}
                  </Dialog.Title>

                  {!key ? (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={handleChange}
                          placeholder="My key"
                          className="w-full px-2 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={handleSubmit}
                        >
                          Create
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          This is your key. Keep it safe. You won&apos;t be able
                          to see it again.
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            name="name"
                            value={key}
                            // onChange={handleChange}
                            // placeholder="My key"
                            className="w-full px-2 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                          />
                          {/* Icon button to copy on click */}
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ml-2"
                            onClick={() => {
                              navigator.clipboard.writeText(key);
                              toast.success("Copied to clipboard!");
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Done
                        </button>
                      </div>
                    </>
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

export default KeyDialog;
