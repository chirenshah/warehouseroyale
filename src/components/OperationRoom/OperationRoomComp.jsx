import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import WarehouseAlert from '../../components/ui/WarehouseAlert';
import WarehouseButton from '../../components/ui/WarehouseButton';
import WarehouseLoader from '../../components/ui/WarehouseLoader';
// Firebase services
import { getDocument } from '../../Database/firestoreService';
// Utils
import { convertFirebaseTimestampToLocaleTime } from '../../utils/functions/convertFirebaseTimestampToLocaleTime';
import { convertFirebaseTimestampToMilliseconds } from '../../utils/functions/convertFirebaseTimestampToMilliseconds';

const isGameStarted = (startTime) => {
  return startTime < Date.now();
};

export default function OperationRoomComp({ currentUser }) {
  const navigate = useNavigate();

  const [configuration, setConfiguration] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);
      try {
        const res = await getDocument(
          `${currentUser.classId}`,
          'Configuration'
        );
        setConfiguration(res);
        setIsPending(false);
      } catch (error) {
        setError(error.message);
        setIsPending(false);
      }
    })();
  }, []);

  if (isPending) {
    return <WarehouseLoader />;
  }
  if (error) {
    return <WarehouseAlert text={error} severity="error" />;
  }

  return (
    <>
      {isGameStarted(
        convertFirebaseTimestampToMilliseconds(configuration?.start_time)
      ) ? (
        <WarehouseButton
          text="Join Operation Room"
          onClick={() => navigate('/game')}
        />
      ) : (
        <WarehouseAlert
          text={`The game is starting at ${convertFirebaseTimestampToLocaleTime(
            configuration?.start_time
          )}. Come back later.`}
        />
      )}
    </>
  );
}
