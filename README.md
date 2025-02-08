# **Find-A-Sports-Match-Frontend**

## Overview
**Find-A-Sports-Match** is a mobile app built with **Expo** and **React Native** to help users connect with others for one-off or regular sports activities. The app allows users to create profiles, list sports activities, and match with others based on their availability, skill levels, and location preferences.

## Features
- **User Authentication**: Sign up or log in via Firebase.
- **Profile Creation**: Users can set up a bio, sports preferences, availability, and location.
- **Activity Listings**: Users can create sports activities with time, venue, and skill level.
- **Matchmaking**: Users are matched based on availability, skill level, and location.
- **Interactive Map**: Users can set their location and define a search radius.
- **Event Management**: Users can create, edit, and delete events.
- **Push Notifications**: Real-time notifications about new matches or updates (Future Feature).

## Installation

### Prerequisites:
- **Node.js** (>=14.x.x)
- **Expo CLI** (If not installed: `npm install -g expo-cli`)
- **Firebase** (For authentication and notifications)

### Steps to Run Locally:

1. Clone the repo:
    ```bash
    git clone https://github.com/your-username/Find-A-Sports-Match-Frontend.git
    cd Find-A-Sports-Match-Frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. **Configure Firebase:**  
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Add Firebase Authentication to your project.
   - Copy your Firebase configuration and **add it to `app.json`** under the `extra` field:

    ```json
    "extra": {
      "firebaseApiKey": "YOUR_API_KEY",
      "firebaseAuthDomain": "YOUR_PROJECT_ID.firebaseapp.com",
      "firebaseProjectId": "YOUR_PROJECT_ID",
      "firebaseStorageBucket": "YOUR_PROJECT_ID.appspot.com",
      "firebaseMessagingSenderId": "YOUR_SENDER_ID",
      "firebaseAppId": "YOUR_APP_ID"
    }
    ```

4. Start the development server:
    ```bash
    expo start
    ```

    This will open the Expo Developer Tools in your browser. Scan the QR code using the **Expo Go** app on your mobile device to run the app.

---

## Project Structure

    /Find-A-Sports-Match-Frontend
    │
    ├── App.js                  # Main app entry, sets up navigation
    ├── /screens                # Contains the different app screens (Login, Profile, Home)
    │   ├── LoginScreen.js
    │   ├── ProfileScreen.js
    │   └── HomeScreen.js
    ├── /firebaseConfig.js      # Firebase configuration and setup
    ├── /node_modules           # Node modules for dependencies
    ├── package.json            # Project dependencies and scripts
    └── /assets                 # Images, icons, and other assets


    /Find-A-Sports-Match-Frontend 
    │ 
    ├── App.js # Main app entry, sets up navigation 
    ├── /screens # Contains the different app screens
    │ ├── LoginScreen.js 
    │ ├── SignUpScreen.js 
    │ ├── ProfileScreen.js 
    │ ├── HomeScreen.js 
    │ ├── ManageEventScreen.js 
    │ ├── EditEventScreen.js 
    │ └── CreateEventScreen.js 
    │ ├── /firebaseConfig.js # Firebase configuration (Loads from app.json) 
    ├── /node_modules # Node modules for dependencies 
    ├── package.json # Project dependencies and scripts 
    ├── app.json # Expo configuration (Firebase credentials stored here) 
    └── /assets # Images, icons, and other assets


---


---

## Firebase Configuration
Your Firebase credentials are now stored in **`app.json`**, and the app loads them dynamically.

**Updated `firebaseConfig.js`:**
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

// Load Firebase configuration from app.json
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
```


### Future Features
    Push Notifications: Implement Firebase Cloud Messaging (FCM) for real-time alerts.
    Real-time Matching: Use a backend to handle real-time activity matching.
    Social Features: Allow users to see mutual friends or connections.
    Premium Features: Add features such as booking, ratings, etc.


### Contact
    Project Brian Booth
    Email: brianbooth915@gmail.com