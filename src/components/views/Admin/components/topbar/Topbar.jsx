import React from "react";
import "./topbar.css";
import {RiGovernmentFill} from "react-icons/ri";


export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <RiGovernmentFill className="logo"/> WareHouse Royale 
        </div>
        <div className="topRight">
          <img src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp" alt="" className="topAvatar" />
          {' '}
          <p>
              
              <span className="msg">Hi,</span>{' '}
              <span className="uname">
                Prof
              </span>
          </p>
        </div>
      </div>
    </div>
  );
}
