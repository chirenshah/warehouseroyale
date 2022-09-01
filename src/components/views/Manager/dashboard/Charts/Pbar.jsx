/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, BarSeries, Inject, Category, Tooltip } from '@syncfusion/ej2-react-charts';
import { pbarCustomSeries, pbarPrimaryXAxis, pbarPrimaryYAxis } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Pbar = ({ width, height }) => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={pbarPrimaryXAxis}
      primaryYAxis={pbarPrimaryYAxis}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[BarSeries, Category, Tooltip]} />
      <SeriesCollectionDirective>
        { pbarCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} explode={2} />) }
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Pbar;
