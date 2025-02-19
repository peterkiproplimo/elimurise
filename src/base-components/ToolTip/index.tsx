import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Tooltip({ text, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      {/* Trigger Element */}
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {/* Tooltip Content */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg">
          {text}
        </div>
      </Transition>
    </div>
  );
}
