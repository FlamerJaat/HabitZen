
import * as admin from 'firebase-admin';

interface FirebaseAdmin {
  app: admin.app.App;
  db: admin.firestore.Firestore;
  auth: admin.auth.Auth;
}

let firebaseAdmin: FirebaseAdmin | null = null;

export function getFirebaseAdmin(): FirebaseAdmin {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  if (admin.apps.length === 0) {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('Firebase service account credentials are not set in environment variables.');
    }
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing Firebase service account credentials:', error);
      throw new Error('Failed to parse Firebase service account credentials.');
    }
  }
  
  const app = admin.app();
  const db = admin.firestore(app);
  const auth = admin.auth(app);

  firebaseAdmin = { app, db, auth };
  return firebaseAdmin;
}
