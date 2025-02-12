import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons"; // Import icons
import * as SecureStore from "expo-secure-store"; // To securely store the JWT token
import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

const minWidth = isWeb ? 320 : width * 0.9;

console.log("HomeScreen.js");

export default function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigation = useNavigation();

  // On initial render, check if the JWT token exists
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Checking authentication status...");
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Token:", token);

      if (token) {
        // You could decode the token here if you want to retrieve the user info from the token
        // const decodedToken = jwt.decode(token);
        // setUserEmail(decodedToken.email); // Assuming email is part of the JWT token payload
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken"); // Remove token from secure storage
      setIsAuthenticated(false);
      setUserEmail(null); // Clear user info
      navigation.replace("Login"); // Redirect to login screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  if (!isAuthenticated) {
    return <Text>Loading...</Text>; // or navigate directly to login screen if not authenticated
  }

  return (
    <LayoutContainer>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <FontAwesome5 name="user-circle" size={50} color="white" />
          <Text style={styles.title}>Welcome, {userEmail || "Loading..."}</Text> 
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

        {/* New Manage Friends Option */}
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("ManageFriends")}>
          <FontAwesome5 name="users" size={20} color="#007AFF" />
          <Text style={styles.optionText}>Manage Friends</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9", minWidth: minWidth },
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
