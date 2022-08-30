import React from 'react';
import { messages } from '../data/dummy';
function messengersidebar() {
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <RiGovernmentFill /> <span>Messages</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {messages.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-4 mt-4 uppercase">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export default messengersidebar;