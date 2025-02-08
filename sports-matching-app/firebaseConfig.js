import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants';

// Access Firebase configuration from app.json
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// Check if required config is available, if not, log an error
if (!firebaseConfig.apiKey) {
  console.error("Firebase configuration is missing!");
}

// Initialize Firebase (even if some fields are missing, you can still proceed with the available ones)
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth };
