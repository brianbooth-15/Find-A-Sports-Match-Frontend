import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";  // Ensure the correct path
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigation = useNavigation(); // Navigation hook

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in");
      navigation.replace("Home"); // Redirect to Home after login
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.appName}>Find A Sports Match</Text>

      <Text style={styles.header}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          placeholder="Enter your password"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
          <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sign In" onPress={handleSignin} />

      <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 40,
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
  },
  showButton: {
    marginLeft: 10,
    padding: 10,
  },
  showText: {
    color: "blue",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});
