import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { Stacked, Pie, Button } from "../";
import { dropdownEmpData, dropdownData } from "../data/dummy";

import { useStateContext } from "../contexts/ContextProvider";
import { deleteOffer, makeOffer, readOffer } from "../../../../../Database/firestore";
import Dashboard from "../Dashboard";

const Recruitmentroom = () => {
    const [employeeOffer, setemployeeOffer] = useState({});
    const { currentMode } = useStateContext();
    const [activeoffers,setActiveoffers] = useState([]);
    useEffect(() => {
        readOffer().then((val)=>{
            setActiveoffers(val)
        });
    }, [employeeOffer])
    
    // console.log(employeeOffer);
    return (
        <Dashboard>
        <div className="m-15">
            <div className="flex gap-10 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
                    <div>
                        <p className="font-semibold text-2xl mr-2 ">
                            Hire Employee
                        </p>
                    </div>
                    <div className="flex justify-evenly items-center gap-10 mt-10">
                        <div className="w-30">
                            <div className="w-50 border-4 border-slate-500 px-3 py-1 rounded-md">
                                <DropDownListComponent
                                    id="emp_id"
                                    fields={{ text: "emp_id", value: "emp_id" }}
                                    style={{
                                        border: "none",
                                        color:
                                            currentMode === "Dark" && "white",
                                    }}
                                    dataSource={dropdownEmpData}
                                    popupWidth="160px"
                                    placeholder="Select the Employee"
                                    onChange={(value) => {
                                        setemployeeOffer((prevState) => {
                                            let new_state = Object.assign(
                                                {},
                                                prevState
                                            );
                                            new_state.emp_id = value.value;
                                            return new_state;
                                        });
                                    }}
                                />
                            </div>
                            {/* <p className="text-gray-400"> Employees</p> */}
                        </div>
                        <div className="w-30">
                            <div className="w-50 border-4 border-slate-500 px-3 py-1 rounded-md">
                                <DropDownListComponent
                                    id="pshare"
                                    fields={{
                                        text: "percentage",
                                        value: "percentage",
                                    }}
                                    style={{
                                        border: "none",
                                        color:
                                            currentMode === "Dark" && "white",
                                    }}
                                    popupWidth="160px"
                                    dataSource={dropdownEmpData}
                                    placeholder="Select the % Share"
                                    onChange={(value) => {
                                        setemployeeOffer((prevState) => {
                                            let new_state = Object.assign(
                                                {},
                                                prevState
                                            );
                                            new_state.share = value.value;
                                            return new_state;
                                        });
                                    }}
                                />
                                {/* <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder= "% Share To Offer" required> */}
                            </div>
                            {/* <p className="text-gray-400"> Employees</p> */}
                        </div>
                        <div className="w-30">
                            <Button
                                color="white"
                                bgColor="#70F570"
                                text="Make an Offer"
                                borderRadius="10px"
                                onclick = {()=>{makeOffer(employeeOffer)
                                    readOffer().then((val)=>{
                                        setActiveoffers(val)
                                    });}}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="ml-3 text-sm text-gray-400">
                            *Offer is good only until next Round
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
                    <div className="mt-4">
                        <p className="font-semibold text-2xl mr-2 ">
                            {" "}
                            Active Offers :
                        </p>
                        {/* Remove Next 4 lines while actual Implementation */}
                        <div className="mt-10 ">
                            {Object.entries(activeoffers).map((item,key) => (
                                <div key={item}>
                                    {console.log(item)}
                                    <p className="text-gray-600 dark:text-gray-400 m-4 mt-4 uppercase">
                                        {item[0]}: <span style={{
                                            padding:"5%"
                                        }}>{item[1]['Percentage']}</span>
                                        <button onClick={() => {
                                            if(deleteOffer(item[0])){
                                                console.log(activeoffers)
                                                setActiveoffers((prevState)=> {
                                                    let temp = {};
                                                    Object.assign(temp, prevState);
                                                    delete temp[item[0]]
                                                    return temp;
                                                })
                                                // setActiveoffers((prevState)=> {
                                                //     prevState.filter((x)=>{ x == item[0]})
                                                // })
                                            }
                                            
                                            }} className="h-8 px-4 m-2 ml-4 text-sm text-indigo-100 transition-colors duration-150 bg-red-600 rounded-lg focus:shadow-outline ">
                                            Deactivate
                                        </button>
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Up until this */}
                    </div>
                </div>
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-1000 p-8 m-1  shadow-xl">
                    <div>
                        <p className="font-semibold text-2xl mr-2 ">
                            Down size the team
                        </p>
                    </div>
                    <div className="flex justify-evenly items-center gap-10 mt-10">
                        <div className="w-30">
                            <div className="w-50 border-4 border-slate-500 px-3 py-1 rounded-md">
                                <DropDownListComponent
                                    id="emp_id"
                                    fields={{ text: "emp_id", value: "emp_id" }}
                                    style={{
                                        border: "none",
                                        color:
                                            currentMode === "Dark" && "white",
                                    }}
                                    dataSource={dropdownEmpData}
                                    popupWidth="160px"
                                    placeholder="Select the Employee"
                                    onChange={(value) => {
                                        {
                                            setemployeeOffer((prevState) => {
                                                let new_state = Object.assign(
                                                    {},
                                                    prevState
                                                );
                                                new_state.emp_id = value.value;
                                                return new_state;
                                            });
                                        }
                                    }}
                                />
                            </div>
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
        </Dashboard>
    );
};

export default Recruitmentroom;
