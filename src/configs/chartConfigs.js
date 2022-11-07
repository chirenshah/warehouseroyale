const COLOR_1 = '#003f5c';
const COLOR_2 = '#58508d';
const COLOR_3 = '#bc5090';
const COLOR_4 = '#ff6361';
const COLOR_5 = '#ffa600';

const chartCommonOptions = {
  chart: {
    type: 'bar',
    height: 350,
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [],
  },
  colors: [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5],
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}`,
    },
  },
};

export const barChartOptions = {
  ...chartCommonOptions,
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: '45%',
      endingShape: 'rounded',
    },
  },
};

export const columnChartOptions = {
  ...chartCommonOptions,
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      endingShape: 'rounded',
    },
  },

  yaxis: {
    title: {
      text: 'Score',
    },
  },
};

export const pieChartOptions = {
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: [],
  colors: [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};

export const stackedColumnChartOptions = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    stackType: '100%',
  },
  colors: [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  xaxis: {
    categories: [],
  },
  fill: {
    opacity: 1,
  },
  legend: {
    show: false,
  },
};
