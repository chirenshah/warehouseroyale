import { FiUser, FiCalendar, FiUpload} from "react-icons/fi"
import { MdOutlineEmail, MdOutlineLocationOn } from "react-icons/md";
import { GiSmartphone } from "react-icons/gi";
import { Link } from "react-router-dom";
import "./user.css";

export default function User() {
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src="https://asu.pure.elsevier.com/files-asset/129976187/tkull.png?w=160&f=webp"
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">Het Mendpara</span>
              <span className="userShowUserTitle">Software Engineer</span>
            </div>
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
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
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
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="userUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
