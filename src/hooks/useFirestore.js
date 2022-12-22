import { useReducer } from 'react';
import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../Database/firestore';

const IS_PENDING = 'IS_PENDING';
const ADD_DOCUMENT = 'ADD_DOCUMENT';
const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';
const DELETE_DOCUMENT = 'DELETE_DOCUMENT';
const ERROR = 'ERROR';
const FIREBASE_SERVICE = 'FIREBASE_SERVICE';

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case IS_PENDING:
      return { document: null, isPending: true, success: false, error: null };
    case ADD_DOCUMENT:
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      };
    case UPDATE_DOCUMENT:
      return {
        document: null,
        isPending: false,
        success: true,
        error: null,
      };
    case DELETE_DOCUMENT:
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      };
    case ERROR:
      return {
        document: null,
        isPending: false,
        success: false,
        error: action.payload,
      };
    case FIREBASE_SERVICE:
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      };

    default:
      return state;
  }
};

export function useFirestore() {
  const [response, dispatch] = useReducer(firestoreReducer, {
    document: null,
    isPending: false,
    error: null,
    success: null,
  });

  const addDocument = async (collectionName, documentId, document) => {
    dispatch({ type: IS_PENDING });

    try {
      document.createdAt = serverTimestamp(Date.now());

      const addedDocument = await setDoc(
        doc(db, collectionName, documentId),
        document,
        { merge: true }
      );

      dispatch({ type: ADD_DOCUMENT, payload: addedDocument });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
      console.error('Error: ', error);
    }
  };

  const updateDocument = async (collectionName, documentId, document) => {
    dispatch({ type: IS_PENDING });

    try {
      const updatedDocument = await updateDoc(
        doc(db, collectionName, documentId),
        document
      );

      dispatch({ type: UPDATE_DOCUMENT, payload: updatedDocument });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
      console.error('Error: ', error);
    }
  };

  const deleteDocument = async (collectionName, documentId) => {
    dispatch({ type: IS_PENDING });

    try {
      await deleteDoc(doc(db, collectionName, documentId));

      dispatch({ type: DELETE_DOCUMENT });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
      console.error('Error: ', error);
    }
  };

  const callFirebaseService = async (firebaseService) => {
    dispatch({ type: IS_PENDING });

    try {
      const res = await firebaseService;

      dispatch({ type: FIREBASE_SERVICE, payload: res });
    } catch (error) {
      dispatch({ type: ERROR, payload: error.message });
      console.error('Error: ', error);
    }
  };

  return {
    response,
    dispatch,
    addDocument,
    updateDocument,
    deleteDocument,
    callFirebaseService,
  };
}
