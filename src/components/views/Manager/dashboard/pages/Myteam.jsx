import React from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Stacked, Pstack, Pie } from '../';
import { ecomPieChartData, dropdownData } from '../data/dummy';

import { useStateContext } from '../contexts/ContextProvider';
import Dashboard from '../Dashboard';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Myteam = () => {
  const { currentMode } = useStateContext();

  return (
    <Dashboard>
    <div className="m-15">
      <div className="flex gap-10 flex-wrap justify-center">

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 h-100 p-8 m-4 flex justify-evenly items-center gap-10 shadow-xl">
          <div className="w-30">
            <p className="text-4xl font-semibold text-{#393145}">Team 3</p>
          </div>

          <div className="w-100">
            <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={false} height="400px" />
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-1000 shadow-xl ">
          <div className="flex justify-between">
            <p className="font-semibold text-3xl mr-2 ">Team Performance Comparisson Metric</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="grid place-items-center">
            <Pstack currentMode={currentMode} />
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-1000 shadow-xl ">
          <div className="flex justify-between">
            <p className="font-semibold text-4xl mr-2 ">Accuracy Metric</p>
          </div>
          <div className="grid place-items-center">
            <Stacked currentMode={currentMode} width="500px" height="550px" />
          </div>
        </div>
      </div>
    </div>
    </Dashboard>
  );
};

export default Myteam;
