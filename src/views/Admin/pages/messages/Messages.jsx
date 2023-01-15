import { useState } from 'react';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
import { useFetchClassesAndTeams } from '../../../../hooks/useFetchClassesAndTeams';
// Material components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
// Firebase services
import { downloadChat } from '../../../../Database/firestoreService';
// Utils
import { downloadTextFile } from '../../../../utils/functions/downloadTextFile';
// Helpers
import { getTeamList } from '../home/helpers/getTeamList';
// Constants
import { COLLECTION_CLASSES } from '../../../../utils/constants';
// Css
import './Messages.css';

export default function Messages() {
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const {
    selectedClass,
    setSelectedClass,
    selectedTeam,
    setSelectedTeam,
    classCollection,
    teamMembers,
  } = useFetchClassesAndTeams();

  const { response, callFirebaseService } = useFirestore();

  const handleDownload = async () => {
    const member = teamMembers.document.find(
      (member) => member.fullName === selectedTeamMember
    );

    await callFirebaseService(downloadChat(member.email));

    downloadTextFile(response.document);
  };

  return (
    <div className="messages">
      <WarehouseHeader title="Download messages" />
      {classesPending ? (
        <WarehouseLoader />
      ) : classesError ? (
        <WarehouseAlert text={classesError} severity="error" />
      ) : !classes.length ? (
        <WarehouseAlert text="No classes found" />
      ) : (
        <WarehouseCard>
          <div className="roundManagement__inputs">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
              >
                {classes.map(({ id }) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {classesPending ? (
              <WarehouseLoader />
            ) : classesError ? (
              <WarehouseAlert text={classesError} severity="error" />
            ) : !classes.length ? (
              <WarehouseAlert text="No team found" />
            ) : (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Team</InputLabel>
                <Select
                  value={selectedTeam}
                  label="Team"
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                  }}
                >
                  {getTeamList(classCollection.document).map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {teamMembers.isPending ? (
              <WarehouseLoader />
            ) : teamMembers.error ? (
              <WarehouseAlert text={teamMembers.error} />
            ) : (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Member</InputLabel>
                <Select
                  value={selectedTeamMember}
                  label="Member"
                  onChange={(e) => setSelectedTeamMember(e.target.value)}
                >
                  {teamMembers?.document?.map(({ fullName, email }) => (
                    <MenuItem key={email} value={fullName}>
                      {fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedTeamMember && (
              <WarehouseButton
                onClick={handleDownload}
                text="Download"
                loading={response.isPending}
              />
            )}
          </div>
        </WarehouseCard>
      )}
    </div>
  );
}
