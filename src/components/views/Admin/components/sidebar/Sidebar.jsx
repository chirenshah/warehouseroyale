import "./sidebar.css";
import { Link } from "react-router-dom";
import {FcConferenceCall,FcPositiveDynamic, FcServices} from "react-icons/fc";
import { TiMessages } from "react-icons/ti";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem active">
              <FcPositiveDynamic className="sidebarIcon" />
              Home
            </li>
            </Link>
          </ul>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <FcConferenceCall  className="sidebarIcon" />
                Manage Users
              </li>
            </Link>
            <Link to="/gamesetup" className="link">
              <li className="sidebarListItem">
                <FcServices className="sidebarIcon" />
                Game Setup
              </li>
            </Link>
          </ul>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <TiMessages className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
