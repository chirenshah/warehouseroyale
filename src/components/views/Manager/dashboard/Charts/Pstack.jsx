import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Legend, LineSeries, DataLabel, Inject, Tooltip, Category } from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../contexts/ContextProvider';
import { pstackData1, pstackData2, pstackData3 } from '../data/dummy';

const Pstack = () => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id="charts"
      style={{ textAlign: 'center' }}
      primaryXAxis={{
        valueType: 'Category',
        title: 'Rounds',
      }}
      primaryYAxis={{
        labelFormat: '{value}',
        rangePadding: 'None',
        minimum: 0,
        maximum: 100,
        interval: 10,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
      }}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      width="700"
      height="550"
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
    >
      <Inject services={[Legend, Category, LineSeries, DataLabel, Tooltip]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={pstackData1}
          xName="x"
          yName="y"
          name="Player 3"
          width={2}
          marker={{ visible: true, width: 10, height: 10 }}
          type="Line"
          fill="#003f5c"
        />
        <SeriesDirective
          dataSource={pstackData2}
          xName="x"
          yName="y"
          name="Player 37"
          width={2}
          marker={{ visible: true, width: 10, height: 10 }}
          type="Line"
          fill="#ff6361"
        />
        <SeriesDirective
          dataSource={pstackData3}
          xName="x"
          yName="y"
          name="Player 15"
          width={2}
          marker={{ visible: true, width: 10, height: 10 }}
          type="Line"
          fill="#ffa600"
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Pstack;
