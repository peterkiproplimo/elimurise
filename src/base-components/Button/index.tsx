import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark"
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin";

type Elevated = boolean;
type Size = "sm" | "lg";
type Rounded = boolean;

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    as?: C extends string ? "button" | "a" : C;
    variant?: Variant;
    elevated?: Elevated;
    size?: Size;
    rounded?: Rounded;
  }
>;

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ButtonProps<C>
) => React.ReactElement | null;

const Button: ButtonComponent = forwardRef(
  <C extends React.ElementType>(
    {
      as,
      size,
      variant,
      elevated,
      rounded,
      children,
      ...props
    }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "button";

    // General Styles
    const generalStyles = [
      "transition-all duration-200 border shadow-sm inline-flex items-center justify-center py-2.5 px-4 rounded-lg font-medium cursor-pointer",
      "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none",
      "hover:shadow-md active:scale-95",
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
      "[&:not(button)]:text-center",
    ];

    // Sizes
    const small = ["text-sm py-2 px-3"];
    const large = ["text-lg py-3 px-6"];

    // Main Colors - OrbitNest Theme
    const primary = [
      "bg-primary hover:bg-primary/90 border-primary hover:border-primary/90 text-white",
      "dark:bg-primary dark:hover:bg-primary/80 dark:border-primary dark:hover:border-primary/80",
    ];
    const secondary = [
      "bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300 text-gray-700",
      "dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200",
    ];
    const success = [
      "bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white",
      "dark:bg-green-500 dark:hover:bg-green-600 dark:border-green-500 dark:hover:border-green-600",
    ];
    const warning = [
      "bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600 text-white",
      "dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:border-yellow-400 dark:hover:border-yellow-500",
    ];
    const pending = [
      "bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-white",
      "dark:bg-orange-400 dark:hover:bg-orange-500 dark:border-orange-400 dark:hover:border-orange-500",
    ];
    const danger = [
      "bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white",
      "dark:bg-red-500 dark:hover:bg-red-600 dark:border-red-500 dark:hover:border-red-600",
    ];
    const dark = [
      "bg-gray-800 hover:bg-gray-900 border-gray-800 hover:border-gray-900 text-white",
      "dark:bg-gray-700 dark:hover:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-800",
    ];

    // Social Media
    const facebook = [
      "bg-[#3b5998] hover:bg-[#344e86] border-[#3b5998] hover:border-[#344e86] text-white",
    ];
    const twitter = [
      "bg-[#4ab3f4] hover:bg-[#3aa2e3] border-[#4ab3f4] hover:border-[#3aa2e3] text-white",
    ];
    const instagram = [
      "bg-[#517fa4] hover:bg-[#406e93] border-[#517fa4] hover:border-[#406e93] text-white",
    ];
    const linkedin = [
      "bg-[#0077b5] hover:bg-[#0066a4] border-[#0077b5] hover:border-[#0066a4] text-white",
    ];

    // Outline - OrbitNest Theme
    const outlinePrimary = [
      "border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
      "dark:border-primary dark:text-primary",
    ];
    const outlineSecondary = [
      "border-gray-300 text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/20",
      "dark:border-gray-600 dark:text-gray-300",
    ];
    const outlineSuccess = [
      "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20",
      "dark:border-green-400 dark:text-green-400",
    ];
    const outlineWarning = [
      "border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
      "dark:border-yellow-400 dark:text-yellow-400",
    ];
    const outlinePending = [
      "border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20",
      "dark:border-orange-400 dark:text-orange-400",
    ];
    const outlineDanger = [
      "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
      "dark:border-red-400 dark:text-red-400",
    ];
    const outlineDark = [
      "border-gray-800 text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/20",
      "dark:border-gray-600 dark:text-gray-300",
    ];

    // Soft Color - OrbitNest Theme
    const softPrimary = [
      "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30",
      "dark:bg-primary/20 dark:border-primary/30 dark:text-primary",
    ];
    const softSecondary = [
      "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30",
      "dark:bg-gray-800/20 dark:border-gray-700 dark:text-gray-300",
    ];
    const softSuccess = [
      "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30",
      "dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    ];
    const softWarning = [
      "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      "dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    ];
    const softPending = [
      "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30",
      "dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300",
    ];
    const softDanger = [
      "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30",
      "dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    ];
    const softDark = [
      "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/30",
      "dark:bg-gray-800/20 dark:border-gray-700 dark:text-gray-300",
    ];

    return (
      <Component
        {...props}
        ref={ref}
        className={twMerge([
          generalStyles,
          size == "sm" && small,
          size == "lg" && large,
          variant == "primary" && primary,
          variant == "secondary" && secondary,
          variant == "success" && success,
          variant == "warning" && warning,
          variant == "pending" && pending,
          variant == "danger" && danger,
          variant == "dark" && dark,
          variant == "outline-primary" && outlinePrimary,
          variant == "outline-secondary" && outlineSecondary,
          variant == "outline-success" && outlineSuccess,
          variant == "outline-warning" && outlineWarning,
          variant == "outline-pending" && outlinePending,
          variant == "outline-danger" && outlineDanger,
          variant == "outline-dark" && outlineDark,
          variant == "soft-primary" && softPrimary,
          variant == "soft-secondary" && softSecondary,
          variant == "soft-success" && softSuccess,
          variant == "soft-warning" && softWarning,
          variant == "soft-pending" && softPending,
          variant == "soft-danger" && softDanger,
          variant == "soft-dark" && softDark,
          variant == "facebook" && facebook,
          variant == "twitter" && twitter,
          variant == "instagram" && instagram,
          variant == "linkedin" && linkedin,
          rounded && "rounded-full",
          elevated && "shadow-lg hover:shadow-xl",
          props.className,
        ])}
      >
        {children}
      </Component>
    );
  }
);

export default Button;
