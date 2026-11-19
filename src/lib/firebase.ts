import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAXZnetE95gn7Sr95CxsQnwXiwo9_o5L-8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "falso-9-27aae.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://falso-9-27aae-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "falso-9-27aae",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "falso-9-27aae.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "867905155971",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:867905155971:web:cf630d9f259a6117a3bcb6",
};

export const isFirebaseConfigured = true;

let app: FirebaseApp | null = null;
let db: Database | null = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getDatabase(app, firebaseConfig.databaseURL);
  } catch (error) {
    console.error('[Falso 9] Erro Firebase:', error);
  }
}

export { app, db };
