import './polyfill';  // Import polyfill.js

// Polyfill for util.promisify
if (typeof util === 'undefined') {
  global.util = require('util');  // Polyfill for `util.promisify`
}

if (typeof util.promisify === 'undefined') {
  global.util.promisify = function(fn) {
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };
  };
}

// Import polyfill for web streams
import "web-streams-polyfill";

// Importing other necessary libraries for your React Native application
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth"; // Only import authentication methods
import { auth } from "./firebaseConfig";  // Import Firebase auth

import PropTypes from 'prop-types'; // Import PropTypes for prop validation

import EditEventScreen from "./screens/EditEventScreen";
import ManageEventsScreen from "./screens/ManageEventsScreen";
import SearchForMatchScreen from './screens/SearchForMatchScreen';
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import HomeScreen from "./screens/HomeScreen";
import ManageFriendsScreen from "./screens/ManageFriendsScreen";
import SearchFriendsScreen from "./screens/SearchFriendsScreen";
import MatchSportsFriendsScreen from "./screens/MatchSportsFriendsScreen";
import { DivOverlay } from 'leaflet';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.innerHTML = `
    html, body {
      height: 100%;
      overflow: auto; /* Allow scrolling on web */
      margin: 0; /* Remove default margin */
      overflow-x: hidden; /* Prevent horizontal overflow */
    }

    #root {
      display: flex;
      height: 100%;
      flex: 1;
      overflow-y: scroll; /* Ensure vertical scroll is available */
    }
  `;
  document.head.appendChild(style);
}

const Stack = createStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` initially to avoid unnecessary renders
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Set authentication status to true if user is logged in
      } else {
        setIsAuthenticated(false); // Set false if not authenticated
      }

      setIsLoading(false); // Stop loading once check is complete
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Conditionally navigate based on the authentication state
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        {/* Login and SignUp screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        {/* Home screen */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

        {/* Other Screens */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="ManageFriends" component={ManageFriendsScreen} />
        <Stack.Screen name="MatchSportsFriends" component={MatchSportsFriendsScreen} />
        <Stack.Screen name="SearchFriends" component={SearchFriendsScreen} />
        <Stack.Screen name="SearchForMatch" component={SearchForMatchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Fix: Adding PropTypes for validation
App.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default App;
