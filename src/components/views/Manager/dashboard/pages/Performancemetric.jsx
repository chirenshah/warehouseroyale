import React from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { Pbar } from '../';
import { dropdownData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Performancemetric = () => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div className="m-15">
      <div className="flex gap-10 flex-wrap justify-center">

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-1000 shadow-xl ">
          <div className="flex justify-between">
            <p className="font-semibold text-4xl mr-2 ">Performance Metric</p>
            <DropDown currentMode={currentMode} />
          </div>
          <Pbar></Pbar>
        </div>
      </div>
    </div>
  );
};

export default Performancemetric;
