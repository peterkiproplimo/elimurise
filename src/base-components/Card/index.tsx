import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const baseStyles = [
      "bg-white dark:bg-gray-800 rounded-xl transition-all duration-200",
      "border border-gray-200 dark:border-gray-700",
    ];

    const variants = {
      default: [
        "shadow-sm hover:shadow-md",
      ],
      elevated: [
        "shadow-lg hover:shadow-xl",
      ],
      outlined: [
        "shadow-none border-2",
      ],
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={twMerge([
          baseStyles,
          variants[variant],
          paddings[padding],
          className,
        ])}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card; 