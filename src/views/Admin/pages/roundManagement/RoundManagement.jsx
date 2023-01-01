import { useState, useEffect } from 'react';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseSnackbar from '../../../../components/ui/WarehouseSnackbar';
// Firestore services
import { getDocument } from '../../../../Database/firestoreService';
// Utils
import { getCurrentTime } from '../../../../utils/functions/getCurrentTime';
import { convertFirebaseTimestampToMilliseconds } from '../../../../utils/functions/convertFirebaseTimestampToMilliseconds';
// Constants
import {
  COLLECTION_CLASSES,
  DOC_CONFIGURATION,
} from '../../../../utils/constants';
// Css
import './RoundManagement.css';

export default function RoundManagement() {
  const { response, addDocument } = useFirestore();

  const [classId, setClassId] = useState('');
  const [startTime, setStartTime] = useState(getCurrentTime());

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const classIds = classes?.map((elm) => elm.id);

  const {
    response: {
      document: currentConfiguration,
      isPending: currentConfigurationPending,
      error: currentConfigurationError,
    },
    callFirebaseService,
  } = useFirestore();

  useEffect(() => {
    (async () => {
      if (!classId) return;

      await callFirebaseService(getDocument(`${classId}`, DOC_CONFIGURATION));
    })();
  }, [classId]);

  const handleSubmit = async () => {
    const newRound = Number(currentConfiguration.current_round) + 1;

    await addDocument(`${classId}`, DOC_CONFIGURATION, {
      current_round: newRound,
      start_time: startTime,
    });
  };

  return (
    <div className="roundManagement">
      {response.error && <WarehouseSnackbar text={response.error} />}
      <WarehouseHeader title="Round Management" />
      {classesPending ? (
        <WarehouseLoader />
      ) : classesError ? (
        <WarehouseAlert text={classesError} severity="error" />
      ) : (
        <WarehouseCard>
          <div className="roundManagement__inputs">
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={classId}
                label="Class"
                onChange={(e) => {
                  setClassId(e.target.value);
                }}
              >
                {classIds.map((elm) => (
                  <MenuItem key={elm} value={elm}>
                    {elm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!classId ? (
              <WarehouseAlert text="Select a class" />
            ) : currentConfigurationPending ? (
              <WarehouseLoader />
            ) : currentConfigurationError ? (
              <WarehouseAlert
                text={currentConfigurationError}
                severity="error"
              />
            ) : convertFirebaseTimestampToMilliseconds(
                currentConfiguration?.start_time
              ) > Date.now() ? (
              <WarehouseAlert
                text={`Round ${currentConfiguration.current_round} is yet to be completed. New round only can be added after it's completion!`}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  defaultValue={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <WarehouseButton
                  onClick={handleSubmit}
                  text="Submit"
                  loading={response.isPending}
                />
              </div>
            )}
          </div>
        </WarehouseCard>
      )}
    </div>
  );
}
