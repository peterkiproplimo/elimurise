import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useMemo } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
  data: number[]; // Array of numbers for graph data
  labels: string[]; // Array of strings for graph labels
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const data: ChartData = useMemo(() => {
    return {
      labels: props.labels,
      datasets: [
        {
          label: "Learners Per Grade",
          barPercentage: 0.5,
          barThickness: 8,
          maxBarThickness: 10,
          minBarLength: 3,
          data: props.data,
          backgroundColor: colorScheme ? "#4A90E2" : "#50E3C2", // Blue for primary, Green for secondary
          borderColor: darkMode ? "#ffffff" : "#4A90E2", // Light borders in dark mode
          borderWidth: 2,
        },
        // Optionally, add another dataset for comparison or alternative visualization
        // {
        //   label: "Alternative Dataset",
        //   barPercentage: 0.5,
        //   barThickness: 6,
        //   maxBarThickness: 8,
        //   minBarLength: 2,
        //   data: props.data,
        //   backgroundColor: darkMode
        //     ? "#2E3B4E"
        //     : "#FFB74D", // A soft orange for contrast
        //   borderColor: "#FFB74D",
        //   borderWidth: 2,
        // },
      ],
    };
  }, [colorScheme, darkMode, props]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: darkMode ? "#f5f5f5" : "#1C1C1C", // Light legend in dark mode, dark in light mode
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
              weight: "bold",
            },
            color: getColor("slate.600", 0.8), // Dark color for readability
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            stepSize: 1,
            font: {
              size: 12,
              weight: "bold",
            },
            color: getColor("slate.600", 0.8), // Dark color for readability
            callback: function (value) {
              return `${value}`; // Format tick labels as numbers
            },
          },
          grid: {
            color: darkMode ? "#616161" : "#E0E0E0", // Subtle grid lines based on mode
            borderDash: [2, 2], // Dashed grid lines for a clean look
            drawBorder: false,
          },
        },
      },
    };
  }, [colorScheme, darkMode]);

  return (
    <Chart
      type="bar"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
