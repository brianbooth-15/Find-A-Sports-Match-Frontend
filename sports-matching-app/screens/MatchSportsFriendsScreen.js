import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Dimensions, Platform, Image } from "react-native";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import LayoutContainer from "./LayoutContainer";
import * as SecureStore from "expo-secure-store"; // Securely store JWT token
import { jwtDecode } from "jwt-decode"; // Correct way to import

// Get the user's email (this can be dynamically set based on logged-in user)
const userEmail = "player1@example.com";  // Replace with dynamic email from authentication or context

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const API_URL = "https://hdouebc6id.execute-api.eu-west-1.amazonaws.com/dev/matchFriends";

export default function MatchSportsFriendsScreen() {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const getToken = async () => {
    if (Platform.OS !== "web") {
      return await SecureStore.getItemAsync("userToken");
    } else {
      return localStorage.getItem("userToken"); // Fallback for web
    }
  };

  // Fetch matches from the API when the component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      console.log("Checking token");
      const token = await getToken();
      console.log("Token:", token);
      if (!token) {
        console.log("No token found, redirecting to login...");
        Alert.alert("Error", "User not authenticated");
        navigation.replace("Login");
        return;
      }

      console.log("we have a token");

      // Decode the JWT token safely
      const decodedToken = jwtDecode(token);

      console.log("Email:", decodedToken.email);
      
      console.log("Fetching matches for user:", userEmail);
      try {
        console.log("token", token);

        console.log(JSON.stringify({ email: decodedToken.email }));
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ email: decodedToken.email }), // Sending the user's email to the backend
        });
        console.log("Response:", response);
        
        const data = await response.json();
        if (response.ok) {
          console.log("Fetched matches:", data.matches);
          setMatches(data.matches); // Store the fetched matches in state
        } else {
          console.error("Failed to fetch matches:", data.message);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
    
    fetchMatches();
  }, []);

  const moveToNextProfile = () => {
    console.log("Moving to next profile... Current index:", currentIndex);
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      console.log("New profile index:", newIndex);
      return newIndex;
    });
  };

  // Gesture handling logic
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      console.log("Gesture Update:", event.translationX);
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      console.log("Gesture End:", event.translationX);
      if (event.translationX > 100) {
        console.log("Matched:", matches[currentIndex]?.name);
        runOnJS(moveToNextProfile)();
      } else if (event.translationX < -100) {
        console.log("No Match:", matches[currentIndex]?.name);
        runOnJS(moveToNextProfile)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (currentIndex >= matches.length) {
    console.log("No more profiles available");
    return (
      <LayoutContainer>
        <View style={styles.container}>
          <Text style={styles.noProfilesText}>No more profiles to show!</Text>
        </View>
      </LayoutContainer>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LayoutContainer>
        <View style={styles.container}>
          {isWeb ? (
            <View style={styles.webContainer}>
              <Image source={{ uri: currentMatch.image }} style={styles.profileImage} />
              <Text style={styles.profileText}>
                {currentMatch.name}
              </Text>
              <Text style={styles.detailsText}>{currentMatch.distance} away</Text>
              {currentMatch.matchedSports.map((sport, index) => (
                <Text key={index} style={styles.detailsText}>
                  {sport.sport} ({sport.level})
                </Text>
              ))}
              <View style={styles.buttonContainer}>
                <Button title="❌ No Match" color="red" onPress={moveToNextProfile} />
                <Button title="✅ Match" color="green" onPress={moveToNextProfile} />
              </View>
            </View>
          ) : (
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.profileCard, animatedStyle]}>
                <Image source={{ uri: currentMatch.image }} style={styles.profileImage} />
                <Text style={styles.profileText}>{currentMatch.name}</Text>
                <Text style={styles.detailsText}>{currentMatch.distance} away</Text>
                {currentMatch.matchedSports.map((sport, index) => (
                  <Text key={index} style={styles.detailsText}>
                    {sport.sport} ({sport.level})
                  </Text>
                ))}
              </Animated.View>
            </GestureDetector>
          )}
        </View>
      </LayoutContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  webContainer: { alignItems: "center" },
  buttonContainer: { flexDirection: "row", marginTop: 20 },
  profileCard: {
    width: 300,
    height: 450,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileText: { fontSize: 20, fontWeight: "bold" },
  detailsText: { fontSize: 16, color: "gray" },
  bioText: { fontSize: 14, fontStyle: "italic", marginTop: 5, textAlign: "center" },
  noProfilesText: { fontSize: 22, fontWeight: "bold", color: "gray" },
});
