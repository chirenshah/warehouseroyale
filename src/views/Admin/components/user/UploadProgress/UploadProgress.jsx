import { useEffect } from 'react';
// Hooks
import { useFirestore } from '../../../../../hooks/useFirestore';
import { useStorage } from '../../../../../hooks/useStorage';
// Components
import WarehouseCircularPercentage from '../../../../../components/ui/WarehouseCircularPercentage';
// Constants
import { COLLECTION_USERS } from '../../../../../utils/constants';
import WarehouseSnackbar from '../../../../../components/ui/WarehouseSnackbar';

export default function UploadProgress({ file, setFile, uploadPath, userId }) {
  const { downloadUrl, progress, error } = useStorage(file, uploadPath);

  const { response, updateDocument } = useFirestore();

  useEffect(() => {
    (async () => {
      if (downloadUrl) {
        await updateDocument(COLLECTION_USERS, userId, {
          avatar: downloadUrl,
        });

        setFile(null);
      }
    })();
  }, [downloadUrl, setFile]);

  return (
    <>
      <WarehouseCircularPercentage value={progress} text={`${progress}%`} />
      {(error || response.error) && (
        <WarehouseSnackbar text={error || response.error} />
      )}
    </>
  );
}
