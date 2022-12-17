import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Material components
import Badge from '@mui/material/Badge';
// Components
import WarehouseLogo from '../ui/WarehouseLogo';
// import SwitchUser from '../SwitchUser';
// Css
import './Sidebar.css';

export default function Sidebar({ sidebarConfig }) {
  const location = useLocation();

  const currentPage = location.pathname.split('/').splice(1)[0];

  const [activeMenu, setActiveMenu] = useState(currentPage);

  return (
    <div className="sidebar">
      <Link to="/">
        <div className="sidebar__logo">
          <WarehouseLogo />
        </div>
      </Link>
      <div className="sidebar__menu">
        <ul className="sidebar__menuItems">
          {sidebarConfig.map(({ item, icon, path, showBadge }) => (
            <Link key={item} to={path}>
              <li
                className={`sidebar__item ${
                  activeMenu === path.substring(1) && 'active'
                }`}
                onClick={() => setActiveMenu(path.substring(1))}
              >
                {showBadge ? (
                  <Badge color="primary" badgeContent={2}>
                    {icon}
                    {item}
                  </Badge>
                ) : (
                  <>
                    {icon}
                    {item}
                  </>
                )}
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
