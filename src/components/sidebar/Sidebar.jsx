import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Hooks
import { useNotificationContext } from '../../hooks/useNotificationContext';
// Material components
import Badge from '@mui/material/Badge';
// Components
import WarehouseLogo from '../ui/WarehouseLogo';
// Css
import './Sidebar.css';

export default function Sidebar({ sidebarConfig }) {
  const location = useLocation();

  const currentPage = location.pathname.split('/').splice(1)[0];

  const { notification } = useNotificationContext();

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
          {sidebarConfig.map(({ item, icon, path }) => {
            const showMyTeamNotificationBadge =
              item === 'My Team' && notification?.isMyTeamNotification;
            const showMessagNotificationeBadge =
              (item === 'Chat/Messenger' || item === 'Messenger') &&
              notification?.isMessageNotification;
            const showOffersNotificationBadge =
              item === 'Offers Acceptance' &&
              notification?.isOffersNotification;

            return (
              <Link key={item} to={path}>
                <li
                  className={`sidebar__item ${
                    activeMenu === path.substring(1) && 'active'
                  }`}
                  onClick={() => setActiveMenu(path.substring(1))}
                >
                  {showMessagNotificationeBadge ||
                  showMyTeamNotificationBadge ||
                  showOffersNotificationBadge ? (
                    <Badge color="success" badgeContent=" ">
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
            );
          })}
        </ul>
      </div>
    </div>
  );
}
