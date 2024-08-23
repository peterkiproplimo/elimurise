import { useMemo } from "react";
import { ChartData, ChartOptions } from "chart.js/auto";
import Chart from "../../base-components/Chart";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";

interface ReportDonutChartProps {
  height: number;
  className?: string;
  learners?: { value: number; color: string }[];
}

const ReportDonutChart: React.FC<ReportDonutChartProps> = ({ height, className, learners }) => {
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const chartData = useMemo(() => {
    return learners ? learners.map(learner => learner.value) : [];
  }, [learners]);

  const chartColors = () => learners ? learners.map(learner => learner.color) : [];

  const data: ChartData = useMemo(() => ({
    labels: learners ? learners.map((_, index) => `Label ${index + 1}`) : [],
    datasets: [
      {
        data: chartData,
        backgroundColor: colorScheme ? chartColors() : "",
        hoverBackgroundColor: colorScheme ? chartColors() : "",
        borderWidth: 5,
        borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
      },
    ],
  }), [colorScheme, darkMode, chartData, learners]);

  const options: ChartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "80%",
  }), [colorScheme, darkMode]);

  return (
    <Chart
      type="doughnut"
     
      height={height}
      data={data}
      options={options}
      className={className}
    />
  );
};

export default ReportDonutChart;
