import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { FontAwesome5 } from "@expo/vector-icons"; // Import icons
import LayoutContainer from './LayoutContainer';

export default function HomeScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation();

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); 
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <LayoutContainer>
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <FontAwesome5 name="user-circle" size={50} color="white" />
        <Text style={styles.title}>Welcome, {user.email}</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
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
