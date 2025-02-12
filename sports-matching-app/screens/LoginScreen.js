import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";  // Ensure the correct path
import { useNavigation } from "@react-navigation/native";
import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

const minContainerWidth = isWeb ? 320 : width * 1;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error messages
  const [emailError, setEmailError] = useState(""); // For email input error
  const [passwordError, setPasswordError] = useState(""); // For password input error
  const navigation = useNavigation(); // Navigation hook

  // Validate email format using regular expression
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSignin = async () => {
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in");
      navigation.replace("Home"); // Redirect to Home after login
    } catch (error) {
      console.error("Error signing in:", error.message);
      
      // Custom error handling based on Firebase error codes
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email.");
        setEmailError("No account found.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
        setPasswordError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address format.");
        setEmailError("Invalid email address.");
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <LayoutContainer>
    <View style={styles.container}>
      {/* App Name */}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
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
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      {/* Display error message if there is one */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Button title="Sign In" onPress={handleSignin} />

      <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
        Don't have an account? Sign Up
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
