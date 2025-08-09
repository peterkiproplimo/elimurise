import { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";

interface FormSelectProps extends React.ComponentPropsWithoutRef<"select"> {
  formSelectSize?: "sm" | "lg";
}

type FormInputRef = React.ComponentPropsWithRef<"select">["ref"];
const FormSelect = forwardRef((props: FormSelectProps, ref: FormInputRef) => {
  const formInline = useContext(formInlineContext);
  const { formSelectSize, ...computedProps } = props;
  return (
    <select
      {...computedProps}
      ref={ref}
      className={twMerge([
        "transition-all duration-200 ease-in-out w-full text-sm border-gray-300 shadow-sm rounded-lg py-2.5 px-3 pr-8",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 focus:outline-none",
        "dark:bg-gray-800 dark:border-gray-600 dark:text-white",
        "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200",
        "dark:disabled:bg-gray-700 dark:disabled:border-gray-600",
        "[&[readonly]]:bg-gray-50 [&[readonly]]:cursor-not-allowed [&[readonly]]:border-gray-200",
        "dark:[&[readonly]]:bg-gray-700 dark:[&[readonly]]:border-gray-600",
        props.formSelectSize == "sm" && "text-xs py-2 px-3 pr-8",
        props.formSelectSize == "lg" && "text-lg py-3 px-4 pr-8",
        formInline && "flex-1",
        props.className,
      ])}
    >
      {props.children}
    </select>
  );
});

export default FormSelect;
