import { Link } from 'react-router-dom';
// Hooks
import useLogout from '../../hooks/useLogout';
// Components
import WarehouseSnackbar from '../ui/WarehouseSnackbar';
// Css
import './Topbar.css';

export default function Topbar() {
  const { logout, isPending, error } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="topbar">
      <Link to="/">
        <span className="topbar__title">Dashboard</span>
      </Link>
      <div className="topbar__user">
        <img
          src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp"
          alt=""
          className="topbar__userImage"
        />{' '}
        <span className="topbar__username">Hi, Professor</span>
        <span onClick={handleLogout} className="topbar__logout">
          Logout
        </span>
      </div>
      {error && <WarehouseSnackbar text={error} />}
    </div>
  );
}
