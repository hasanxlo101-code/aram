import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { VisitorUser } from '../types/wordCourses';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the provisioned firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Operation types for strict Firestore Error diagnostics
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
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Boot verification of connection to Firestore
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Checking network configuration.');
    } else {
      console.log('Firebase connection initialized:', (error as Error).message);
    }
    return false;
  }
}

// Auto-run connection check on initial boot
testConnection().catch((err) => console.log('Init check:', err));

// Persist student profile & XP to Firestore
export async function syncUserProfileToFirestore(
  user: VisitorUser,
  xp: number,
  completedCourses: string[] = []
): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(
      userDocRef,
      {
        id: user.id,
        email: user.email,
        displayName: user.name,
        role: user.email.includes('hasanxlo') || user.email.includes('hasan.xlo') ? 'admin' : 'student',
        xp: xp,
        level: xp > 1500 ? 'خبير سيبراني' : xp > 500 ? 'متوسط دفاعي' : 'مبتدئ واعد',
        enrolledCourses: user.enrolledCourseIds || [],
        completedCourses: completedCourses,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch student profile from Firestore
export async function fetchUserProfileFromFirestore(userId: string): Promise<any | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Record security audit scan to Firestore
export async function logScanToFirestore(
  userId: string,
  scanType: 'url' | 'email_breach' | 'phone_osint' | 'simulator',
  target: string,
  verdict: string
): Promise<void> {
  const scanId = `scan_${Date.now()}`;
  const path = `users/${userId}/scans/${scanId}`;
  try {
    const scanRef = doc(db, 'users', userId, 'scans', scanId);
    await setDoc(scanRef, {
      id: scanId,
      userId,
      scanType,
      target,
      verdict,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
