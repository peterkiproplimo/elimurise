import { Dialog, Transition } from "@headlessui/react";
import { Fragment, Dispatch, SetStateAction, ReactNode } from "react";

// Define the props type
type PopupDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  message: string;
  type?: "info" | "error"; // Optional with default "info"
};

export default function PopupDialog({
  isOpen,
  setIsOpen,
  title,
  message,
  type = "info",
}: PopupDialogProps) {
  const colors: Record<"info" | "error", string> = {
    info: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
  };

  const icons: Record<"info" | "error", ReactNode> = {
    info: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-6 h-6 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
        />
      </svg>
    ),
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center space-x-3">
                  <div className="shrink-0">{icons[type]}</div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {message}
                  </p>
                </div>

                <div className="mt-5 text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2 text-sm font-medium text-white hover:from-teal-600 hover:to-teal-700 focus:outline-none shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Okay
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
