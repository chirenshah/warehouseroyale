import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useCreateUser } from '../../../../hooks/useCreateUser';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
// Constants
import {
  COLLECTION_CLASSES,
  COLLECTION_TEAMS,
} from '../../../../utils/constants';
// Css
import './NewUser.css';

export default function NewUser() {
  const navigate = useNavigate();

  const [classId, setClassId] = useState(null);
  const [role, setRole] = useState('manager');
  const [teamId, setTeamId] = useState(null);
  const [teamIdError, setTeamIdError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState('');

  const {
    documents: teams,
    isPending: areteamsPending,
    error: teamsError,
  } = useCollection(COLLECTION_TEAMS);

  const teamIds = teams?.map((team) => team.id);

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const classIds = classes?.map((elm) => elm.id);

  const isTeamIdAvailable = (teamId, teamIds) => {
    return teamIds?.includes(teamId);
  };

  useEffect(() => {
    setTeamIdError(null);

    if (role === 'manager') {
      if (isTeamIdAvailable(teamId, teamIds)) {
        setTeamIdError('Team ID is already occupied');
      }
    }
  }, [role, teamId, teamIds]);

  const {
    createUser,
    isPending: isCreateUserPending,
    createUserError,
  } = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Put validation checks
    if (teamIdError) {
      return;
    }

    await createUser({
      fullName,
      username,
      email,
      password,
      classId,
      teamId,
      phone,
      role,
      isNew: role === 'employee' ? true : null,
      share: role === 'manager' ? 100 : 0,
    });

    navigate('/users');
  };

  return (
    <div className="newUser">
      {classesError && <WarehouseAlert text={classesError} severity="error" />}
      {teamsError && <WarehouseAlert text={teamsError} severity="error" />}
      {createUserError && <WarehouseSnackbar text={createUserError} />}
      <WarehouseHeader title="New User" />
      {classesPending ? (
        <WarehouseLoader />
      ) : !classIds.length ? (
        <WarehouseAlert text="Please create a class first" />
      ) : (
        <WarehouseCard>
          <form className="newUser__form" onSubmit={handleSubmit}>
            <div className="newUser__items">
              <div className="newUser__item">
                <label>Class</label>
                <select
                  onChange={(e) => {
                    setClassId(e.target.value);
                  }}
                  value={classId}
                  name="classId"
                  id="classId"
                >
                  {classIds.map((elm) => (
                    <option key={elm} value={elm}>
                      {elm}
                    </option>
                  ))}
                </select>
              </div>
              <div className="newUser__item">
                <label>Role</label>
                <select
                  onChange={(e) => {
                    setRole(e.target.value);
                    setTeamId(null);
                  }}
                  value={role}
                  name="role"
                  id="role"
                >
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <div className="newUser__item">
                <label>Team ID</label>
                {areteamsPending ? (
                  <WarehouseLoader sm left />
                ) : role === 'employee' ? (
                  <select
                    onChange={(e) => setTeamId(e.target.value)}
                    value={teamId}
                    name="teamId"
                    id="teamId"
                    required
                  >
                    <option value="" disabled selected>
                      Select Team ID
                    </option>
                    {teamIds?.map((teamId) => (
                      <option key={teamId} value={teamId}>
                        {teamId}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    onChange={(e) => setTeamId(e.target.value)}
                    value={teamId}
                    type="number"
                    placeholder="Enter team id"
                    required
                  />
                )}
                {teamIdError && (
                  <span className="inputError">{teamIdError}</span>
                )}
              </div>
              <div className="newUser__item">
                <label>Full Name</label>
                <input
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="newUser__item">
                <label>Username</label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Enter a username"
                  required
                />
              </div>
              <div className="newUser__item">
                <label>Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="newUser__item">
                <label>Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text" // Keep it text type
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>

              <div className="newUser__item">
                <label>Phone</label>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
            <WarehouseButton
              text="Create"
              success
              type="submit"
              loading={isCreateUserPending}
            />
          </form>
        </WarehouseCard>
      )}
    </div>
  );
}
