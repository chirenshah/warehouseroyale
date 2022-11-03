import { Link } from 'react-router-dom';
// Material components
import { FiUser, FiCalendar, FiUpload } from 'react-icons/fi';
import { MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md';
import { GiSmartphone } from 'react-icons/gi';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Css
import './User.css';
import WarehouseCard from '../../../../components/ui/WarehouseCard';

export default function User() {
  return (
    <div className="user">
      <WarehouseHeader title="Edit user">
        <Link to="/new-user">
          <WarehouseButton text="Create new user" />
        </Link>{' '}
      </WarehouseHeader>
      <div className="userContainer">
        <WarehouseCard className="userShow">
          <div className="userShowTop">
            <img
              src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp"
              alt=""
              className="userShowImg"
            />
            <span className="userShowUsername">
              Het <br /> Mendpara
            </span>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <FiUser className="userShowIcon" />
              <span className="userShowInfoTitle">hmendpar</span>
            </div>
            <div className="userShowInfo">
              <FiCalendar className="userShowIcon" />
              <span className="userShowInfoTitle">10.12.1999</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <GiSmartphone className="userShowIcon" />
              <span className="userShowInfoTitle">+1 123 456 6789</span>
            </div>
            <div className="userShowInfo">
              <MdOutlineEmail className="userShowIcon" />
              <span className="userShowInfoTitle">hmendpar@gmail.com</span>
            </div>
            <div className="userShowInfo">
              <MdOutlineLocationOn className="userShowIcon" />
              <span className="userShowInfoTitle">Arizona | USA</span>
            </div>
          </div>
        </WarehouseCard>
        <WarehouseCard className="userUpdate">
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="hmendpar"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Het Mendpara"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="het9@gmail.com"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="+1 123 456 6789"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Arizona State | USA"
                  className="userUpdateInput"
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp"
                  alt=""
                />
                <label htmlFor="file">
                  <FiUpload className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: 'none' }} />
              </div>
              <WarehouseButton text="Update" success />
            </div>
          </form>
        </WarehouseCard>
      </div>
    </div>
  );
}
