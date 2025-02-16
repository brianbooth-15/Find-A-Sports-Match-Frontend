import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LayoutContainer from './LayoutContainer';
import * as SecureStore from "expo-secure-store"; // To securely store the JWT token


const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const minContainerWidth = isWeb ? 320 : width * 1;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error messages
  const [emailError, setEmailError] = useState(""); // For email input error
  const [passwordError, setPasswordError] = useState(""); // For password input error
  const navigation = useNavigation(); // Navigation hook

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Use SecureStore only on native platforms
  const setToken = async (key, value) => {
    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync(key, value);
    } else {
      localStorage.setItem(key, value); // Fallback for web
    }
  };

  const handleSignin = async () => {
    console.log("Logging in with email:", email);
    setErrorMessage(""); // Clear previous errors
    setEmailError(""); // Clear email error
    setPasswordError(""); // Clear password error

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      if (!email) setEmailError("Email is required.");
      if (!password) setPasswordError("Password is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setEmailError("Invalid email address format.");
      return;
    }

    try {
      // Replace Firebase authentication logic with an API call to Lambda
      console.log("Logging in with email:", email);
      const response = await fetch("https://hg14rciwsd.execute-api.eu-west-1.amazonaws.com/dev/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Response:", response);

      const data = await response.json();

      if (response.status !== 200) {
        setErrorMessage(data.message || "Error logging in");
        return;
      }

      // Store the JWT token in local storage or app state
      const token = data.token;
      console.log("Logged in with JWT:", token);
      await setToken("userToken", token);


      // Navigate to Home after login
      navigation.replace("Home");
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An unknown error occurred. Please try again.");
    }
  };

  return (
    <LayoutContainer>
      <View style={styles.container}>
        <Text style={styles.appName}>Find A Sports Match</Text>
        <Text style={styles.header}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={[styles.input, emailError && styles.inputError]} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none"
          placeholder="Enter your email"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Enter your password"
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Button title="Sign In" onPress={handleSignin} />

        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          Don&apos;t have an account? Sign Up
        </Text>
      </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignSelf: "center",  // Center the content
    minWidth: minContainerWidth,
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
  inputError: {
    borderColor: "red", // Red border color for inputs with errors
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
  errorText: {
    color: "red", // Error text color
    marginBottom: 15,
    textAlign: "center",
  },
});
