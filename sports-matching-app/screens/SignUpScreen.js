import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

const minWidth = isWeb ? 320 : width * 1;

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Handle Sign Up
  const handleSignUp = async () => {
    console.log("Signing up with email:", email);
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    console.log("Passwords match!");

    setIsLoading(true);

    const payload = {
      email,
      password,
    };
    console.log("Signing up with payload  ", payload);  

    try {
      console.log("Signing up with payload:", payload);
      // Send the sign-up request to your Lambda function
      const response = await fetch("https://hg14rciwsd.execute-api.eu-west-1.amazonaws.com/dev/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Response:", response);

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
        navigation.navigate("Login"); // Navigate to Login screen on success
      } else {
        Alert.alert("Error", data.message || "An error occurred while signing up.");
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      Alert.alert("Error", "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutContainer>
      <View style={styles.container}>
        <Text style={styles.header}>Sign Up</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
        />

        <Button title={isLoading ? "Creating..." : "Sign Up"} onPress={handleSignUp} disabled={isLoading} />

        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Already have an account? Login
        </Text>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    minWidth: minWidth,
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  link: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});
