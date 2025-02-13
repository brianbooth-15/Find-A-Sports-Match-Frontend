import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform
} from "react-native";
import * as SecureStore from "expo-secure-store"; // Securely store JWT token
import * as Location from "expo-location";
import { jwtDecode } from "jwt-decode"; // Correct way to import
import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const minWidth = isWeb ? 320 : width;

const API_URL = "https://u4tp9u32pc.execute-api.eu-west-1.amazonaws.com/dev/profile";

const sportsList = [
  "Walking (for fitness)", "Swimming", "Football (Soccer)", "Cycling",
  "Running/Jogging", "Golf", "Tennis", "Badminton", "Rugby (Union & League)", "Basketball",
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const genderOptions = ["Male", "Female", "Both"];

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [availability, setAvailability] = useState("");
  const [selectedSports, setSelectedSports] = useState({});
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    requestLocationPermission();
  }, []);

  const getToken = async (key) => {
    if (Platform.OS !== "web") {
      return await SecureStore.getItemAsync(key);
    } else {
      return localStorage.getItem(key); // Fallback for web
    }
  };

  // ✅ Fetch Profile from AWS Lambda
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        navigation.replace("Login");
        return;
      }

      // ✅ Decode the JWT token safely
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.email);

      const response = await fetch(`${API_URL}/${decodedToken.email}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      if (data) {
        setName(data.name || "");
        setDob(data.dob || "");
        setAvailability(data.availability || "");
        setSelectedSports(data.selectedSports || {});
        setRadius(data.radius || 10);
        setLocation(data.location || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Request Location Permissions
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is required for better matches.");
      return;
    }
    let userLocation = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude });
  };

  // ✅ Handle DOB Change & Calculate Age
  const handleDobChange = (input) => {
    let cleanedInput = input.replace(/\D/g, "");
    if (cleanedInput.length > 2 && cleanedInput.length <= 4) {
      cleanedInput = `${cleanedInput.slice(0, 2)}/${cleanedInput.slice(2)}`;
    } else if (cleanedInput.length > 4) {
      cleanedInput = `${cleanedInput.slice(0, 2)}/${cleanedInput.slice(2, 4)}/${cleanedInput.slice(4, 8)}`;
    }
    setDob(cleanedInput);

    if (cleanedInput.length === 10) {
      const [day, month, year] = cleanedInput.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  // ✅ Handle Sport Selection
  const toggleSport = (sport) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: prev[sport]
        ? undefined
        : { level: "Beginner", gender: "Both" },
    }));
  };

  const updateSkillLevel = (sport, level) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: { ...prev[sport], level },
    }));
  };

  const updateGenderPreference = (sport, gender) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: { ...prev[sport], gender },
    }));
  };

  // ✅ Save Profile to AWS Lambda
  const saveProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        navigation.replace("Login");
        return;
      }

      const profileData = {
        email, name, dob, availability, selectedSports, radius, location
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      Alert.alert("Success", "Profile saved successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContainer>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Create Your Profile</Text>

          <TextInput style={styles.input} placeholder="Your Name" value={name} onChangeText={setName} />

          <View style={styles.dobContainer}>
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="DD/MM/YYYY"
              value={dob}
              onChangeText={handleDobChange}
              keyboardType="numeric"
              maxLength={10}
            />
            {age !== null && <Text style={styles.ageText}>Age: {age}</Text>}
            </View>
            <Text style={styles.label}>Availability</Text>
          <TextInput style={styles.input} placeholder="Availability" value={availability} onChangeText={setAvailability} />

          <Text style={styles.subHeader}>Select Your Sports & Preferences</Text>
          {sportsList.map((sport) => (
            <View key={sport} style={styles.sportItem}>
              <TouchableOpacity style={[styles.sportButton, selectedSports[sport] && styles.sportButtonSelected]} onPress={() => toggleSport(sport)}>
                <Text style={[styles.sportText, selectedSports[sport] && styles.sportTextSelected]}>
                  {sport} {selectedSports[sport] ? `(${selectedSports[sport].level})` : ""}
                </Text>
              </TouchableOpacity>

              {selectedSports[sport] && (
                <>
                  <View style={styles.skillContainer}>
                    {skillLevels.map((level) => (
                      <TouchableOpacity key={level} style={[styles.skillButton, selectedSports[sport].level === level && styles.skillButtonSelected]} onPress={() => updateSkillLevel(sport, level)}>
                        <Text style={[styles.skillText, selectedSports[sport].level === level && styles.skillTextSelected]}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.genderContainer}>
                    {genderOptions.map((gender) => (
                      <TouchableOpacity key={gender} style={[styles.genderButton, selectedSports[sport].gender === gender && styles.genderButtonSelected]} onPress={() => updateGenderPreference(sport, gender)}>
                        <Text style={[styles.genderText, selectedSports[sport].gender === gender && styles.genderTextSelected]}>{gender}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          ))}

          <Button title={loading ? "Saving..." : "Save & Continue"} onPress={saveProfile} disabled={loading} />
        </View>
      </ScrollView>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
    minHeight: "100vh", // Ensure full height
    minWidth: minWidth,
  },
  scrollContainer: {
    flexGrow: 1,
    overflowY: 'auto', // Ensure scrolling is enabled
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 
  },
  subHeader: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginVertical: 10 
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
  dobContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 15 
  },
  dobInput: { flex: 1 },
  ageText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginLeft: 10, 
    color: "#007AFF" 
  },
  sportItem: { marginBottom: 10 },
  sportButton: { 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    backgroundColor: "#eee", 
    marginBottom: 5 
  },
  sportButtonSelected: { 
    backgroundColor: "#007AFF" 
  },
  sportTextSelected: { 
    color: "white", 
    fontWeight: "bold" 
  },
  skillContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 5 
  },
  skillButton: { 
    padding: 5, 
    borderWidth: 1, 
    borderColor: "#007AFF", 
    borderRadius: 5 
  },
  skillButtonSelected: { 
    backgroundColor: "#007AFF" 
  },
  skillText: { 
    fontSize: 14, 
    color: "#007AFF", 
    fontWeight: "bold" 
  },
  skillTextSelected: { 
    color: "white", 
    fontWeight: "bold" 
  },
  genderContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 5 
  },
  genderButton: { 
    padding: 5, 
    borderWidth: 1, 
    borderColor: "#FF9500", 
    borderRadius: 5 
  },
  genderButtonSelected: { 
    backgroundColor: "#FF9500" 
  },
  genderText: { 
    fontSize: 14, 
    color: "#FF9500", 
    fontWeight: "bold" 
  },
  genderTextSelected: { 
    color: "white" 
  },
});