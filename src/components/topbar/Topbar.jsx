import { Link } from 'react-router-dom';
// Css
import './Topbar.css';

export default function Topbar() {
  return (
    <div className="topbar">
      <Link to="/">
        <span className="topbar__title">Dashboard</span>
      </Link>
      <Link to="/user">
        <div className="topbar__user">
          <img
            src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp"
            alt=""
            className="topbar__userImage"
          />{' '}
          <span className="topbar__username">Hi, Professor</span>
        </div>
      </Link>
    </div>
  );
}
