import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';  // For React Native
import Constants from "expo-constants";
import { Platform } from "react-native";  // For platform checking

// Firebase Config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Check platform and set persistence accordingly
if (Platform.OS === 'web') {
  // For Web, use browserLocalPersistence
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence for web:", error);
  });
} else {
  // For React Native, use AsyncStorage for persistence
  setPersistence(auth, getReactNativePersistence(ReactNativeAsyncStorage)).catch((error) => {
    console.error("Error setting persistence for React Native:", error);
  });
}

export { app, auth };
