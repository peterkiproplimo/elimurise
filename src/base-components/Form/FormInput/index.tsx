import { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
}

type FormInputRef = React.ComponentPropsWithRef<"input">["ref"];

const FormInput = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const formInline = useContext(formInlineContext);
  const inputGroup = useContext(inputGroupContext);
  const { formInputSize, rounded, ...computedProps } = props;
  return (
    <input
      {...computedProps}
      ref={ref}
      className={twMerge([
        "transition-all duration-200 ease-in-out w-full text-sm border-gray-300 shadow-sm rounded-lg placeholder:text-gray-400",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 focus:outline-none",
        "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500",
        "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200",
        "dark:disabled:bg-gray-700 dark:disabled:border-gray-600",
        "[&[readonly]]:bg-gray-50 [&[readonly]]:cursor-not-allowed [&[readonly]]:border-gray-200",
        "dark:[&[readonly]]:bg-gray-700 dark:[&[readonly]]:border-gray-600",
        props.formInputSize == "sm" && "text-xs py-2 px-3",
        props.formInputSize == "lg" && "text-lg py-3 px-4",
        props.rounded && "rounded-full",
        formInline && "flex-1",
        inputGroup &&
          "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l-lg last:rounded-r-lg z-10",
        props.className,
      ])}
    />
  );
});

export default FormInput;
