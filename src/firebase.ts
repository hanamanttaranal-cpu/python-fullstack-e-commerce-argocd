import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, setLogLevel, doc, getDocFromServer } from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';

// Configure log level to avoid spamming benign iframe reconnection logs
setLogLevel('error');

// Resolve configuration dynamically: prioritize environment variables, fallback to local config
const metaEnv = (import.meta as any).env || {};

const config = {
  apiKey: (metaEnv.VITE_FIREBASE_API_KEY as string) || defaultFirebaseConfig.apiKey,
  authDomain: (metaEnv.VITE_FIREBASE_AUTH_DOMAIN as string) || defaultFirebaseConfig.authDomain,
  projectId: (metaEnv.VITE_FIREBASE_PROJECT_ID as string) || defaultFirebaseConfig.projectId,
  storageBucket: (metaEnv.VITE_FIREBASE_STORAGE_BUCKET as string) || defaultFirebaseConfig.storageBucket,
  messagingSenderId: (metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || defaultFirebaseConfig.messagingSenderId,
  appId: (metaEnv.VITE_FIREBASE_APP_ID as string) || defaultFirebaseConfig.appId,
  firestoreDatabaseId: (metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string) || defaultFirebaseConfig.firestoreDatabaseId,
};

// Initialize Firebase App
const app = initializeApp(config);

// Initialize Firebase Authentication & Firestore with robust connection settings
export const auth = getAuth(app);
export const db = initializeFirestore(
  app,
  { experimentalForceLongPolling: true },
  config.firestoreDatabaseId
);

// Google Auth Provider Setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google Popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Sign Out
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// Firestore Error Handling (as mandated by the Firebase Skill)
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: string | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errCode = (error as any)?.code;
  const errMessage = (error as any)?.message || String(error);

  // Ignore transient network/offline status errors gracefully so the app operates cleanly
  if (
    errCode === 'unavailable' ||
    errMessage.includes('unavailable') ||
    errMessage.includes('could not be completed') ||
    errMessage.includes('offline')
  ) {
    console.warn(`Firestore operating in offline/cache mode for ${operationType} on ${path}`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous ? 'true' : 'false',
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// Connectivity Validation (as mandated by the Firebase Skill)
// -------------------------------------------------------------
export async function testConnection() {
  try {
    // Tests connection quietly
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    console.log('Firebase connectivity verified successfully.');
  } catch (error: any) {
    // Gracefully handle connection status without throwing
    console.warn('Firebase connection currently operating in offline/cache mode.');
  }
}


