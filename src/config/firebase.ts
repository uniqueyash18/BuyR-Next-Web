import { initializeApp, getApps } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBWXI9A_rFIrG1IcYTGH9PlhGg93WNYrLA",
  authDomain: "roash-deals.firebaseapp.com",
  projectId: "roash-deals",
  storageBucket: "roash-deals.firebasestorage.app",
  messagingSenderId: "445125567251",
  appId: "1:445125567251:web:62102c6b8fce6ea3bb70e6",
  measurementId: "G-ZMNN74WPC7"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const messaging = getMessaging(app);

export { app, messaging }; 