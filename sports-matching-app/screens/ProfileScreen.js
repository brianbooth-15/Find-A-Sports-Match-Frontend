import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity 
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import Slider from "@react-native-community/slider";

const sportsList = [
  "Walking (for fitness)", "Swimming", "Football (Soccer)", "Cycling", 
  "Running/Jogging", "Golf", "Tennis", "Badminton", 
  "Rugby (Union & League)", "Basketball"
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const genderOptions = ["Male", "Female", "Both"];

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); 
  const [age, setAge] = useState(null); 
  const [availability, setAvailability] = useState("");
  const [selectedSports, setSelectedSports] = useState({});
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState(null);
  const [mapHeight, setMapHeight] = useState(300);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    })();
  }, []);

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

      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  // Toggle sports on/off
  const toggleSport = (sport) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: prev[sport] ? undefined : { level: "Beginner", gender: "Both" },
    }));
  };

  // Update skill level
  const updateSkillLevel = (sport, level) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: { ...prev[sport], level },
    }));
  };

  // Update gender selection
  const updateGenderPreference = (sport, gender) => {
    setSelectedSports((prev) => ({
      ...prev,
      [sport]: { ...prev[sport], gender },
    }));
  };

  // Handle map tap
  const handleMapPress = (event) => {
    setLocation(event.nativeEvent.coordinate);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Create Your Profile</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Your Name" 
          value={name} 
          onChangeText={setName} 
        />

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

        <TextInput 
          style={styles.input} 
          placeholder="Availability (e.g. Friday 7-8PM)" 
          value={availability} 
          onChangeText={setAvailability} 
        />

        <View style={styles.section}>
          <Text style={styles.label}>Search Radius: {radius} km</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={radius}
            onValueChange={(value) => setRadius(value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#007AFF"
          />
        </View>

        <Text style={styles.subHeader}>Set Your Location</Text>
        <View style={[styles.mapContainer, { height: mapHeight }]}>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onPress={handleMapPress}
            >
              <Marker coordinate={location} title="Your Location" />
              <Circle
                center={location}
                radius={radius * 1000}
                strokeColor="rgba(0, 122, 255, 0.5)"
                fillColor="rgba(0, 122, 255, 0.2)"
              />
            </MapView>
          ) : (
            <Text>Loading Map...</Text>
          )}
        </View>

        <Text style={styles.subHeader}>Select Your Sports & Preferences</Text>
        {sportsList.map((sport) => (
          <View key={sport} style={styles.sportItem}>
            <TouchableOpacity 
              style={[styles.sportButton, selectedSports[sport] && styles.sportButtonSelected]} 
              onPress={() => toggleSport(sport)}
            >
              <Text style={[styles.sportText, selectedSports[sport] && styles.sportTextSelected]}>
                {sport} {selectedSports[sport] ? `(${selectedSports[sport].level})` : ""}
              </Text>
            </TouchableOpacity>

            {selectedSports[sport] && (
              <>
                <View style={styles.skillContainer}>
                  {skillLevels.map((level) => (
                    <TouchableOpacity 
                      key={level} 
                      style={[
                        styles.skillButton, 
                        selectedSports[sport].level === level && styles.skillButtonSelected
                      ]} 
                      onPress={() => updateSkillLevel(sport, level)}
                    >
                      <Text style={[
                        styles.skillText, 
                        selectedSports[sport].level === level && styles.skillTextSelected
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.genderContainer}>
                  {genderOptions.map((gender) => (
                    <TouchableOpacity 
                      key={gender} 
                      style={[
                        styles.genderButton, 
                        selectedSports[sport].gender === gender && styles.genderButtonSelected
                      ]} 
                      onPress={() => updateGenderPreference(sport, gender)}
                    >
                      <Text style={[
                        styles.genderText, 
                        selectedSports[sport].gender === gender && styles.genderTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        ))}

        <Button title="Save & Continue" onPress={() => navigation.navigate("Home")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9" },
  scrollContainer: { flexGrow: 1 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, fontSize: 16, borderRadius: 5, backgroundColor: "#fff", marginBottom: 15 },
  dobContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  dobInput: { flex: 1 },
  ageText: { fontSize: 16, fontWeight: "bold", marginLeft: 10, color: "#007AFF" },
  mapContainer: { height: 300, borderRadius: 10, overflow: "hidden", marginBottom: 20 },
  map: { width: "100%", height: "100%" },
  sportItem: { marginBottom: 10 },
  sportButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#eee", marginBottom: 5 },
  sportButtonSelected: { backgroundColor: "#007AFF" },
  sportTextSelected: { color: "white", fontWeight: "bold" },
  skillContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 5 },
  skillButton: { padding: 5, borderWidth: 1, borderColor: "#007AFF", borderRadius: 5 },
  skillButtonSelected: { backgroundColor: "#007AFF" },
  skillText: { fontSize: 14, color: "#007AFF", fontWeight: "bold" },
  skillTextSelected: { color: "white", fontWeight: "bold" },
  genderContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 5 },
  genderButton: { padding: 5, borderWidth: 1, borderColor: "#FF9500", borderRadius: 5 },
  genderButtonSelected: { backgroundColor: "#FF9500" },
  genderText: { fontSize: 14, color: "#FF9500", fontWeight: "bold" },
  genderTextSelected: { color: "white" },
});
