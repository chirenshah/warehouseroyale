import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDocment } from '../../hooks/useDocment';
import { useLogout } from '../../hooks/useLogout';
// Components
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
import WarehouseLoader from '../ui/WarehouseLoader';
import WarehouseCard from '../ui/WarehouseCard';
// Constants
import { COLLECTION_USERS, PROFESSOR_AVATAR } from '../../utils/constants';
// Css
import './Topbar.css';

export default function Topbar() {
  const navigate = useNavigate();

  const { user: currentUser } = useAuthContext();

  const {
    document: user,
    isPending: isPendingUser,
    error: userError,
  } = useDocment(COLLECTION_USERS, currentUser?.uid);

  const { logout, isPending, error } = useLogout();

  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const avatar =
    currentUser?.role === 'admin'
      ? PROFESSOR_AVATAR
      : user?.avatar || '/assets/anonymous.png';

  const name = currentUser?.role === 'admin' ? 'Professor' : user?.fullName;

  return (
    <>
      <div className="topbar">
        <Link to="/">
          <span className="topbar__title">Dashboard</span>
        </Link>
        <div
          onClick={() => setShowUserProfile(!showUserProfile)}
          className="topbar__user"
        >
          <img src={avatar} alt="" className="topbar__userImage" />{' '}
          <span className="topbar__username">Hi, {name}</span>
          <span onClick={handleLogout} className="topbar__logout">
            Logout
          </span>
          {(isPending || isPendingUser) && <WarehouseLoader />}
          {error && <WarehouseSnackbar text={error} />}
          {/* {showUserProfile && <UserProfile className="topbar__userProfile" />} */}
        </div>
      </div>
    </>
  );
}

function UserProfile() {
  return <WarehouseCard className="userProfile">user profile</WarehouseCard>;
}
