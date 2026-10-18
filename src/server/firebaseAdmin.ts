import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any;
try {
  if (getApps().length === 0) {
    try {
      app = initializeApp({
        credential: applicationDefault(),
        projectId: firebaseConfig.projectId,
      });
    } catch {
      app = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  } else {
    app = getApps()[0];
  }
} catch (e) {
  console.warn('Firebase admin app initialization warning:', e);
}

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
