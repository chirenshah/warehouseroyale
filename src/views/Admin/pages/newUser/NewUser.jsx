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
import { COLLECTION_CLASSES } from '../../../../utils/constants';
// Css
import './NewUser.css';
import { useFirestore } from '../../../../hooks/useFirestore';
import {
  getCollection,
  getDocument,
} from '../../../../Database/firestoreService';
import { getTeams } from './helpers/getTeams';

export default function NewUser() {
  const navigate = useNavigate();

  const [classId, setClassId] = useState('');
  const [role, setRole] = useState('');
  const [teamId, setTeamId] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const { response: classCollection, callFirebaseService: callGetCollection } =
    useFirestore();

  useEffect(() => {
    classId &&
      (async () => {
        await callGetCollection(getCollection(classId));
      })();
  }, [classId]);

  const { response: team, callFirebaseService } = useFirestore();

  useEffect(() => {
    teamId &&
      (async () => {
        await callFirebaseService(
          getDocument(`${classId}/teams/teams`, teamId.split(' ')[1])
        );
      })();
  }, [classId, teamId]);

  useEffect(() => {
    const teamDoc = team.document;
    const teamError = team.error;

    let role = '';

    if (!teamDoc || teamError === 'No such document exists') {
      role = 'Manager';
    } else {
      role = 'Employee';
    }

    setRole(role);
  }, [team]);

  const {
    createUser,
    isPending: isCreateUserPending,
    createUserError,
  } = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Put validation checks
    if (
      !classId ||
      !teamId ||
      !role ||
      !fullName ||
      !username ||
      !email ||
      !password ||
      !phone
    )
      return;

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
      {classCollection.error && (
        <WarehouseAlert text={classCollection.error} severity="error" />
      )}
      {team.error && team.error !== 'No such document exists' && (
        <WarehouseAlert text={team.error} severity="error" />
      )}
      {createUserError && <WarehouseSnackbar text={createUserError} />}
      <WarehouseHeader title="New User" />
      {classesPending ? (
        <WarehouseLoader />
      ) : !classes.length ? (
        <WarehouseAlert text="Please create a class first" />
      ) : (
        <WarehouseCard>
          <form className="newUser__form">
            <div className="newUser__items">
              <div className="newUser__item">
                <label>Class</label>
                <select
                  onChange={(e) => {
                    setClassId(e.target.value);
                  }}
                  value={classId}
                >
                  <option value="" disabled>
                    Select class
                  </option>
                  {classes.map(({ id }) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              {classCollection.isPending ? (
                <div className="newUser__item">
                  <WarehouseLoader sm />
                </div>
              ) : (
                <div className="newUser__item">
                  <label>Team ID</label>
                  <select
                    onChange={(e) => setTeamId(e.target.value)}
                    value={teamId}
                    required
                    disabled={!classId}
                  >
                    <option value="" disabled>
                      Select Team ID
                    </option>
                    {getTeams(classCollection.document)?.map((teamId) => (
                      <option key={teamId} value={teamId}>
                        {teamId}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="newUser__item">
                <label>Role</label>
                {team.isPending ? (
                  <WarehouseLoader sm />
                ) : (
                  <input type="text" value={role} required disabled />
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
              onClick={handleSubmit}
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
