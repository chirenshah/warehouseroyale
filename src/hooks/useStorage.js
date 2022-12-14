import { useState, useEffect } from 'react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../Database/config';

export function useStorage(file, uploadPath) {
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setError(null);
      setProgress(0);

      // TODO: Delete old one

      try {
        const uploadTask = uploadBytesResumable(ref(storage, uploadPath), file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            setError(error.message);
            console.log('Error: ', error);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadUrl(downloadUrl);
          }
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    })();
  }, [file, uploadPath]);

  return { downloadUrl, progress, error };
}
