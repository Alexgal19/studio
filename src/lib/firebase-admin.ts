
import * as admin from 'firebase-admin';

// This check prevents re-initializing the app in hot-reload environments.
if (!admin.apps.length) {
  try {
    // Make sure to set these environment variables in your .env.local file
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });
    } else {
        if (process.env.NODE_ENV !== 'production') {
            console.warn("Firebase Admin SDK not initialized. Missing environment variables.");
        }
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const auth = admin.apps.length ? admin.auth() : null;
export const db = admin.apps.length ? admin.firestore() : null;
