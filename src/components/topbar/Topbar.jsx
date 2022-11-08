import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDocment } from '../../hooks/useDocment';
import { useLogout } from '../../hooks/useLogout';
import { useOutsideClick } from '../../hooks/useOutsideClick';
// Material icons
import { MdModeEdit } from 'react-icons/md';
// Components
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
import WarehouseLoader from '../ui/WarehouseLoader';
import WarehouseCard from '../ui/WarehouseCard';
import WarehouseButton from '../ui/WarehouseButton';
import UploadProgress from '../../views/Admin/components/user/UploadProgress/UploadProgress';
// Constants
import { COLLECTION_USERS } from '../../utils/constants';
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

  const [file, setFile] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const userProfileRef = useRef();

  useOutsideClick(userProfileRef, () => {
    setShowUserProfile(false);
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="topbar">
      <Link to="/">
        <span className="topbar__title">Dashboard</span>
      </Link>
      <div onClick={() => setShowUserProfile(true)} className="topbar__user">
        <img
          src={user?.avatar || '/assets/anonymous.png'}
          alt={user?.fullName}
          className="topbar__userImage"
        />{' '}
        <span className="topbar__username">
          Hi, {currentUser?.role === 'admin' ? 'Professor' : user?.fullName}
        </span>
        {showUserProfile && (
          <UserProfile
            ref={userProfileRef}
            user={user}
            avatar={user?.avatar || '/assets/anonymous.png'}
            handleLogout={handleLogout}
            setFile={setFile}
            file={file}
            currentUser={currentUser}
          />
        )}
        {(isPending || isPendingUser) && <WarehouseLoader />}
        {error && <WarehouseSnackbar text={error} />}
      </div>
    </div>
  );
}

const UserProfile = React.forwardRef(
  ({ user, avatar, handleLogout, file, currentUser, setFile }, ref) => {
    const getFileName = (file, userId) =>
      `${userId}.${file.name.substr(file.name.lastIndexOf('.') + 1)}`;

    return (
      <div ref={ref}>
        <WarehouseCard className="userProfile">
          <div className="userProfile__top">
            <h4>User Profile</h4>
          </div>
          <div className="userProfile__user">
            <label className="userProfile__input">
              <img
                src={avatar}
                alt={user?.fullName || 'Professor'}
                className="userProfile__userImage"
              />
              <input
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
              />
              <div className="userProfile__overlay">
                <MdModeEdit />
              </div>
              {file && (
                <div className="userProfile__uploadProgress">
                  <UploadProgress
                    file={file}
                    setFile={setFile}
                    uploadPath={`avatars/${getFileName(
                      file,
                      currentUser?.uid
                    )}`}
                    userId={currentUser?.uid}
                  />
                </div>
              )}
            </label>
            <div className="userProfile__desc">
              <h3>{user?.fullName || 'Professor'}</h3>
              <span>{user?.email}</span>
            </div>
          </div>
          <hr />
          <WarehouseButton
            onClick={handleLogout}
            className="userProfile__logout"
            text="Logout"
          />
        </WarehouseCard>
      </div>
    );
  }
);
