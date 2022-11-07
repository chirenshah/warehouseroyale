import { useState } from 'react';
// Hooks
import useCreateUser from '../../../../hooks/useCreateUser';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
// Constants
import { COLLECTION_USERS } from '../../../../utils/constants';
// Css
import './NewUser.css';

export default function NewUser() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('employee');

  const { createUser, isPending, error } = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Put validation checks

    createUser(COLLECTION_USERS, {
      fullName,
      username,
      email,
      password,
      phone,
      role,
    });
  };

  return (
    <div className="newUser">
      <WarehouseHeader title="New User" />
      <WarehouseCard>
        <form className="newUser__form" onSubmit={handleSubmit}>
          <div className="newUser__items">
            <div className="newUser__item">
              <label>Full Name</label>
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                placeholder="Enter full name"
              />
            </div>
            <div className="newUser__item">
              <label>Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="Enter a username"
              />
            </div>
            <div className="newUser__item">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter email address"
              />
            </div>
            <div className="newUser__item">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="text" // Keep it text type
                placeholder="Enter password"
              />
            </div>
            <div className="newUser__item">
              <label>Phone</label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="Enter phone number"
              />
            </div>
            <div className="newUser__item">
              <label>Role</label>
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                name="role"
                id="role"
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>
          {error && <WarehouseSnackbar text={error} />}
          <WarehouseButton
            text="Create"
            success
            type="submit"
            loading={isPending}
          />
        </form>
      </WarehouseCard>
    </div>
  );
}
