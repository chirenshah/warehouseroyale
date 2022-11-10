import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
// Components
import WarehouseLogo from "../ui/WarehouseLogo";
import SwitchUser from "../SwitchUser";
// Css
import "./Sidebar.css";

export default function Sidebar({ sidebarConfig }) {
    const [activeMenu, setActiveMenu] = useState(sidebarConfig[0].item);

    return (
        <div className="sidebar">
            <Link to="/">
                <div className="sidebar__logo">
                    <WarehouseLogo />
                </div>
            </Link>
            <div className="sidebar__menu">
                <ul className="sidebar__menuItems">
                    {sidebarConfig.map(({ item, icon, path }) => (
                        <Link key={item} to={path}>
                            <li
                                className={`sidebar__item ${
                                    activeMenu === item && "active"
                                }`}
                                onClick={() => setActiveMenu(item)}
                            >
                                {icon}
                                {item}
                            </li>
                        </Link>
                    ))}
                </ul>
                {/* {process.env.NODE_ENV === 'development' && (
          <div className="sidebar__switchUser">
            <SwitchUser />
          </div>
        )} */}
            </div>
        </div>
    );
}
