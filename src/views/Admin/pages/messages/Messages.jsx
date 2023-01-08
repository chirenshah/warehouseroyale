import { useState, useEffect } from 'react';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
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
import { getCollection } from '../../../../Database/firestoreService';
// Utils
// Constants
import {
  COLLECTION_CLASSES,
  COLLECTION_USERS,
} from '../../../../utils/constants';
// Css
import './Messages.css';

export default function Messages() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const { response: members, callFirebaseService } = useFirestore();

  useEffect(() => {
    (async () => {
      await callFirebaseService(
        getCollection(COLLECTION_USERS, [
          {
            fieldPath: 'classId',
            queryOperator: '==',
            value: selectedClass,
          },
        ])
      );
    })();
  }, [selectedClass]);

  const handleDownload = async () => {};

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
                  setSelectedMember('');
                }}
              >
                {classes.map(({ id }) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!selectedClass ? (
              <WarehouseAlert text="Select a class" />
            ) : members.isPending ? (
              <WarehouseLoader />
            ) : members.error ? (
              <WarehouseAlert text={members.error} />
            ) : !members.document.length ? (
              <WarehouseAlert text="No members found" />
            ) : (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Member</InputLabel>
                <Select
                  value={selectedMember}
                  label="Member"
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  {members?.document?.map(({ fullName, email }) => (
                    <MenuItem key={email} value={fullName}>
                      {fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedMember && (
              <WarehouseButton onClick={handleDownload} text="Download" />
            )}
          </div>
        </WarehouseCard>
      )}
    </div>
  );
}
