import React from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Stacked, Pie, Button } from '../';
import { dropdownEmpData, dropdownData, activeoffers } from '../data/dummy';

import { useStateContext } from '../contexts/ContextProvider';

const DropDown = ({ currentMode }) => (
  <div className="w-50 border-4 border-slate-500 px-3 py-1 rounded-md">
    <DropDownListComponent id="emp_id" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} dataSource={dropdownEmpData} popupWidth='160px' placeholder="Select the Employee" />
  </div>
);

const DropDown1 = ({ currentMode }) => (
  <div className="w-50 border-4 border-slate-500 px-3 py-1 rounded-md">
    <DropDownListComponent id="pshare" fields={{ text: 'Id', value: 'Time' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} popupWidth='160px' dataSource={dropdownEmpData} placeholder="Select the % Share" />
    {/* <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder= "% Share To Offer" required> */}
  </div>
  );

const Recruitmentroom = () => {
  const { currentMode } = useStateContext();

  return (
    <div className="m-15">
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
          <div>
            <p className="font-semibold text-2xl mr-2 ">Hire Employee</p>
          </div>
          <div className='flex justify-evenly items-center gap-10 mt-10'>
            <div className="w-30">
              <DropDown />
              {/* <p className="text-gray-400"> Employees</p> */}
            </div>
            <div className="w-30">
              <DropDown1 />
              {/* <p className="text-gray-400"> Employees</p> */}
            </div>
            <div className="w-30">
              <Button
                color="white"
                bgColor="#70F570"
                text="Make an Offer"
                borderRadius="10px"
              />
            </div>
          </div> 
          <div className="mt-4">
            <p className="ml-3 text-sm text-gray-400">*Offer is good only until next Round</p>
          </div> 
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
          <div className='mt-4'>
            <p className="font-semibold text-2xl mr-2 "> Active Offers :</p>
            {/* Remove Next 4 lines while actual Implementation */}
            <div className="mt-10 ">
            {activeoffers.map((item) => (
              <div key={item.name}>
                <p className="text-gray-600 dark:text-gray-400 m-4 mt-4 uppercase">
                  {item.name}
                  <button class="h-8 px-4 m-2 ml-4 text-sm text-indigo-100 transition-colors duration-150 bg-red-600 rounded-lg focus:shadow-outline ">Deactivate</button>
                </p>
              </div>
            ))}
          </div>
            {/* Up until this */}
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
          <div>
            <p className="font-semibold text-2xl mr-2 ">Down size the team</p>
          </div>
          <div className='flex justify-evenly items-center gap-10 mt-10'>
            <div className="w-30">
              <DropDown />
              {/* <p className="text-gray-400"> Employees</p> */}
            </div>
            <div className="w-30">
              <Button
                color="white"
                bgColor="#e82525"
                text="Fire the Employee"
                borderRadius="10px"
              />
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default Recruitmentroom;
