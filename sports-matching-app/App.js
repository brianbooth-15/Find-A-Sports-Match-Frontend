import "web-streams-polyfill"; // Add polyfill for React Native fetch issues
import { fetch } from "react-native-fetch-api"; // Alternative fetch library
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Import Firebase auth

import EditEventScreen from "./screens/EditEventScreen"; // Import the new screen
import ManageEventsScreen from "./screens/ManageEventsScreen"; // Import the new screen
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateEventScreen from "./screens/CreateEventScreen"; // Import the CreateEvent screen
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set auth state based on user presence
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
