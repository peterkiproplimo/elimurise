import { twMerge } from "tailwind-merge";
import { createContext, useContext } from "react";

interface TableProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"table"> {
  dark?: boolean;
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
  sm?: boolean;
  variant?: "default" | "modern" | "minimal";
}

const tableContext = createContext<{
  dark: TableProps["dark"];
  bordered: TableProps["bordered"];
  hover: TableProps["hover"];
  striped: TableProps["striped"];
  sm: TableProps["sm"];
  variant: TableProps["variant"];
}>({
  dark: false,
  bordered: false,
  hover: false,
  striped: false,
  sm: false,
  variant: "default",
});

function Table({
  className,
  dark,
  bordered,
  hover,
  striped,
  sm,
  variant = "modern",
  ...props
}: TableProps) {
  return (
    <tableContext.Provider
      value={{
        dark: dark,
        bordered: bordered,
        hover: hover,
        striped: striped,
        sm: sm,
        variant: variant,
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table
          className={twMerge([
            "w-full text-left",
            dark && "bg-gray-900 text-white",
            className,
          ])}
          {...props}
        >
          {props.children}
        </table>
      </div>
    </tableContext.Provider>
  );
}

interface TheadProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"thead"> {
  variant?: "default" | "light" | "dark" | "modern";
}

const theadContext = createContext<{
  variant: TheadProps["variant"];
}>({
  variant: "default",
});

Table.Thead = ({ className, variant = "modern", ...props }: TheadProps) => {
  return (
    <theadContext.Provider
      value={{
        variant: variant,
      }}
    >
      <thead
        className={twMerge([
          "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600",
          variant === "light" && "bg-gray-50 dark:bg-gray-700",
          variant === "dark" && "bg-gray-900 text-white",
          variant === "modern" && "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600",
          className,
        ])}
        {...props}
      >
        {props.children}
      </thead>
    </theadContext.Provider>
  );
};

type TbodyProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<"tbody">
>;

Table.Tbody = ({ className, ...props }: TbodyProps) => {
  return <tbody className={className}>{props.children}</tbody>;
};

type TrProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"tr">;

Table.Tr = ({ className, ...props }: TrProps) => {
  const table = useContext(tableContext);
  return (
    <tr
      className={twMerge([
        "transition-all duration-200",
        table.hover &&
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-sm",
        table.striped &&
          "even:bg-gray-50/50 dark:even:bg-gray-700/30",
        className,
      ])}
      {...props}
    >
      {props.children}
    </tr>
  );
};

type ThProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"th">;

Table.Th = ({ className, ...props }: ThProps) => {
  const table = useContext(tableContext);
  const thead = useContext(theadContext);
  return (
    <th
      className={twMerge([
        "font-semibold px-6 py-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600",
        "text-sm uppercase tracking-wide",
        thead.variant === "light" && "text-gray-700 dark:text-gray-300",
        thead.variant === "dark" && "text-white",
        thead.variant === "modern" && "text-gray-700 dark:text-gray-300 font-bold",
        table.dark && "border-gray-600",
        table.bordered && "border border-gray-200 dark:border-gray-600",
        table.sm && "px-4 py-3 text-sm",
        className,
      ])}
      {...props}
    >
      {props.children}
    </th>
  );
};

type TdProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"td">;

Table.Td = ({ className, ...props }: TdProps) => {
  const table = useContext(tableContext);
  return (
    <td
      className={twMerge([
        "px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700",
        "transition-all duration-200",
        table.dark && "border-gray-600",
        table.bordered && "border border-gray-200 dark:border-gray-600",
        table.sm && "px-4 py-3 text-sm",
        className,
      ])}
      {...props}
    >
      {props.children}
    </td>
  );
};

export default Table;
