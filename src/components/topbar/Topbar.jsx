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
import WarehouseButton from '../ui/WarehouseButton';
// Constants
import { COLLECTION_USERS, PROFESSOR_AVATAR } from '../../utils/constants';
// Css
import './Topbar.css';
import { useEffect } from 'react';

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
          <img
            src={avatar}
            alt={user?.fullName}
            className="topbar__userImage"
          />{' '}
          <span className="topbar__username">Hi, {name}</span>
          {(isPending || isPendingUser) && <WarehouseLoader />}
          {error && <WarehouseSnackbar text={error} />}
          {showUserProfile && (
            <UserProfile
              className="topbar__userProfile"
              user={user}
              avatar={avatar}
              logout={handleLogout}
              showUserProfile={showUserProfile}
              setShowUserProfile={setShowUserProfile}
            />
          )}
        </div>
      </div>
    </>
  );
}

function UserProfile({ user, avatar, logout }) {
  return (
    <WarehouseCard className="userProfile">
      <div className="userProfile__top">
        <h4>User Profile</h4>
        {/* <div className="userProfile__close">X</div> */}
      </div>
      <div className="userProfile__user">
        <img
          src={avatar}
          alt={user?.fullName || 'Professor'}
          className="userProfile__userImage"
        />
        <div className="userProfile__desc">
          <h3>{user?.fullName || 'Professor'}</h3>
          <span>{user?.email}</span>
        </div>
      </div>
      <hr />
      <WarehouseButton
        onClick={logout}
        className="userProfile__logout"
        text="Logout"
      />
    </WarehouseCard>
  );
}
