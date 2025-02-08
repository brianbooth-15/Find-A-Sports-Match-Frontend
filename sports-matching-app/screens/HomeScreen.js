import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function HomeScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation();

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // Redirect to Login screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user.email}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <Button title="Configure Profile" onPress={() => navigation.navigate("Profile")} />
        <Button title="Search for Match" onPress={() => Alert.alert("Search Match Clicked")} />
        {/* <Button title="Create Event" onPress={() => navigation.navigate("CreateEvent")} /> Update to navigate to CreateEvent */}
        <Button title="Manage Events" onPress={() => navigation.navigate("ManageEvents")} />

      </View>

      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  title: { fontSize: 22, color: "white", fontWeight: "bold" },
  optionsContainer: {
    marginBottom: 20,
  },
});
