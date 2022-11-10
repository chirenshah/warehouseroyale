import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// Hooks
import { useDocment } from '../../../../hooks/useDocment';
import { useFirestore } from '../../../../hooks/useFirestore';
// Material Icons
import { FiUser, FiUpload } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { GiSmartphone } from 'react-icons/gi';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
import UploadProgress from '../../components/user/UploadProgress/UploadProgress';
// Constants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './User.css';

const getFileName = (file, userId) =>
  `${userId}.${file.name.substr(file.name.lastIndexOf('.') + 1)}`;

export default function User() {
  const { id: userId } = useParams();

  const {
    document: user,
    isPending,
    error,
  } = useDocment(COLLECTION_USERS, userId);

  const { response, updateDocument } = useFirestore();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    setFullName(user?.fullName);
    setUsername(user?.username);
    setEmail(user?.email);
    setPhone(user?.phone);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Put validation checks

    await updateDocument(COLLECTION_USERS, userId, {
      fullName,
      username,
      email,
      phone,
    });
  };

  return (
    <div className="user">
      <WarehouseHeader title="Edit user">
        <Link to="/new-user">
          <WarehouseButton text="Create new user" />
        </Link>{' '}
      </WarehouseHeader>
      {isPending && <WarehouseLoader />}
      {error && <WarehouseSnackbar text={error || response.error} />}
      {user && (
        <div className="userContainer">
          <WarehouseCard className="userShow">
            <div className="userShowTop">
              <img
                src={user.avatar || '/assets/anonymous.png'}
                alt={user.fullName}
                className="userShowImg"
              />
              <span className="userShowUsername">{user.fullName}</span>
            </div>
            <div className="userShowBottom">
              <div className="userShowInfo">
                <FiUser className="userShowIcon" />
                <span className="userShowInfoTitle">{user.username}</span>
              </div>
              <div className="userShowInfo">
                <GiSmartphone className="userShowIcon" />
                <span className="userShowInfoTitle">{user.phone}</span>
              </div>
              <div className="userShowInfo">
                <MdOutlineEmail className="userShowIcon" />
                <span className="userShowInfoTitle">{user.email}</span>
              </div>
            </div>
          </WarehouseCard>
          <WarehouseCard className="userUpdate">
            <form className="userUpdateForm" onSubmit={handleSubmit}>
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={user.avatar || '/assets/anonymous.png'}
                    alt={user.fullName}
                  />
                  <label htmlFor="file">
                    <FiUpload className="userUpdateIcon" />
                  </label>
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    id="file"
                    style={{ display: 'none' }}
                  />
                  {file && (
                    <UploadProgress
                      file={file}
                      setFile={setFile}
                      uploadPath={`avatars/${getFileName(file, userId)}`}
                      userId={userId}
                    />
                  )}
                </div>
                <WarehouseButton
                  text="Update"
                  success
                  type="submit"
                  loading={response.isPending}
                />
              </div>
            </form>
          </WarehouseCard>
        </div>
      )}
    </div>
  );
}
