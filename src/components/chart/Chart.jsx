import ApexChart from 'react-apexcharts';
import {
  barChartOptions,
  columnChartOptions,
  pieChartOptions,
  donutChartOptions,
  stackedColumnChartOptions,
} from '../../configs/chartConfigs';
import './Chart.css';

export default function Chart({ type, chartType, series, xAxis }) {
  const getChartConfig = (type) => {
    switch (type) {
      case 'bar':
        return barChartOptions;
      case 'column':
        return columnChartOptions;
      case 'pie':
        return pieChartOptions;
      case 'donut':
        return donutChartOptions;
      case 'stacked':
        return stackedColumnChartOptions;
      default:
        return columnChartOptions;
    }
  };

  let options = getChartConfig(type);
  if (type === 'bar' || type === 'stacked') {
    options.xaxis.categories = xAxis;
  }
  if (type === 'pie' || type === 'donut') {
    options.labels = xAxis;
  }

  return (
    <ApexChart
      options={options}
      series={series}
      type={chartType}
      height={350}
    />
  );
}
