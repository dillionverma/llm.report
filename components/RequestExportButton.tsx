import { Button } from "@/components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import axios from "axios";
import { endOfDay, format, startOfMonth, sub } from "date-fns";
import { Download } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";

const dateSelectOptions = [
  {
    value: "w",
    text: "Last 7 days",
    from: sub(new Date(), { days: 7 }),
    to: endOfDay(new Date()),
  },
  {
    value: "mtd",
    text: "Month to date",
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  },
  {
    value: "m",
    text: "Last 30 days",
    from: sub(new Date(), { days: 30 }),
    // utc end date
    to: endOfDay(new Date()),
  },
];

export const RequestExportButton = () => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
    selectValue: "mtd",
  });

  const [loading, setLoading] = useState(false);

  const downloadCsv = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.from) {
        params.append("start", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange.to) {
        params.append("end", format(dateRange.to, "yyyy-MM-dd"));
      }
      const response = await axios.get(
        `/api/v1/export/requests?${params.toString()}`,
        {
          responseType: "blob", // Set the response type to blob
        }
      );

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", "requests.csv"); // Set the file name

      // Append the link to the document body and click it to trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV file:", error);
      toast.error("Error downloading CSV file");
    } finally {
      setLoading(false);
      closeModal();
      toast.success("Downloaded CSV file");
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={openModal}>
        Export
        <Download className="w-4 h-4 ml-2" />
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
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg p-6 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Export requests
                  </Dialog.Title>
                  <DateRangePicker
                    value={dateRange}
                    onValueChange={setDateRange}
                    selectPlaceholder="Select"
                    className="mt-4 z-100"
                  >
                    {dateSelectOptions.map((option, index) => (
                      <DateRangePickerItem key={index} {...option}>
                        {option.text}
                      </DateRangePickerItem>
                    ))}
                  </DateRangePicker>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={downloadCsv}
                    >
                      {loading ? "Downloading..." : "Download CSV"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
