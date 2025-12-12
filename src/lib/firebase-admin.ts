
import * as admin from 'firebase-admin';

let app: admin.app.App;

// This check prevents re-initializing the app in hot-reload environments.
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key must be formatted correctly (replace \\n with \n)
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Check if all required service account details are present
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    } else {
        // In a development environment, log a warning if the config is incomplete.
        if (process.env.NODE_ENV !== 'production') {
            console.warn(
`********************************************************************************
** Firebase Admin SDK Not Initialized!                                        **
** -------------------------------------------------------------------------- **
** The server-side Firebase features (like user registration) will not work.  **
** To fix this, you need to:                                                  **
** 1. Create a '.env.local' file in the root of your project.                 **
** 2. Add the following environment variables with your service account key:  **
**    FIREBASE_PROJECT_ID="..."                                               **
**    FIREBASE_CLIENT_EMAIL="..."                                             **
**    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n" **
**                                                                            **
** You can get your service account key from the Firebase Console:            **
** Project Settings > Service accounts > Generate new private key.            **
********************************************************************************`
            );
        }
    }
  } catch (error: any) {
    console.error('Firebase Admin SDK Initialization Error:', error.stack);
  }
} else {
    app = admin.app();
}

export const auth = admin.apps.length ? admin.auth() : null;
export const db = admin.apps.length ? admin.firestore() : null;
