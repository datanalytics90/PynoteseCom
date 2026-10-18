import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0
  ? initializeApp({
      credential: applicationDefault(),
      projectId: firebaseConfig.projectId,
    })
  : getApps()[0];

export const adminDb = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const adminAuth = getAuth(app);

export const admin = {
  firestore: {
    FieldValue,
  },
};

export { FieldValue };
export default admin;
