import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyA5V0jxojd5z1sRukUkM0tWuv3kjf_-coM",
  authDomain: "merge-images-75174.firebaseapp.com",
  projectId: "merge-images-75174",
  // The storage bucket should be the project's appspot bucket
  storageBucket: "merge-images-75174.appspot.com",
  messagingSenderId: "908748226365",
  appId: "1:908748226365:web:955d9107eee7ec26ac8f54",
  measurementId: "G-51LNQKBHJ3"
};

// Ensure a single app instance across hot reloads / StrictMode
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Use long polling to avoid AbortError in some environments (proxies/VPNs)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});
export const storage = getStorage(app);

export default app;


