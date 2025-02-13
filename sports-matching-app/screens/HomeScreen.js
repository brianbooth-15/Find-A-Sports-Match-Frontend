import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store"; // Secure storage for JWT tokens
import LayoutContainer from "./LayoutContainer";
import { jwtDecode } from "jwt-decode";
 // Decode JWT tokens

// Get screen width
const { width } = Dimensions.get("window");

// Determine if the platform is web or mobile
const isWeb = Platform.OS === "web";
const minWidth = isWeb ? 320 : width * 0.9;

// Utility functions to handle storage (supports web & mobile)
const getToken = async () => {
  if (Platform.OS !== "web") {
    return await SecureStore.getItemAsync("userToken");
  } else {
    return localStorage.getItem("userToken"); // Fallback for web
  }
};

const removeToken = async () => {
  if (Platform.OS !== "web") {
    await SecureStore.deleteItemAsync("userToken");
  } else {
    localStorage.removeItem("userToken"); // Fallback for web
  }
};

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Checking authentication status...");
      const token = await getToken();
      console.log("Token:", token);

      if (token) {
        try {
          const decodedToken = jwtDecode(token); // Decode JWT token
          console.log("Decoded Token:", decodedToken);
          setUserEmail(decodedToken.email); // Set email from token
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAuthenticated(false);
          setUserEmail(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await removeToken(); // Remove token from storage
      setIsAuthenticated(false);
      setUserEmail(null);
      navigation.replace("Login"); // Redirect to login screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <LayoutContainer>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <FontAwesome5 name="user-circle" size={50} color="white" />
          <Text style={styles.title}>Welcome, {userEmail || "User"}</Text>
        </View>

        {/* Options */}
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("Profile")}>
          <FontAwesome5 name="user-edit" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Configure Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("SearchForMatch")}>
          <FontAwesome5 name="search" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Search for Match</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("ManageEvents")}>
          <FontAwesome5 name="calendar-alt" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Manage Events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("ManageFriends")}>
          <FontAwesome5 name="users" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Manage Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("MatchSportsFriends")}>
          <FontAwesome5 name="handshake" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Match Sports Friends</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LayoutContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9", minWidth: minWidth },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9" },
  loadingText: { fontSize: 16, color: "#007AFF" },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 10,
  },
  title: { fontSize: 22, color: "white", fontWeight: "bold", marginTop: 10 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: { fontSize: 16, marginLeft: 10, color: "#007AFF" },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
