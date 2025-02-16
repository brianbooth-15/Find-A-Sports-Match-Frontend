import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Dimensions, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
// import Slider from "@react-native-community/slider";

import PropTypes from 'prop-types';  // Import PropTypes for validation

import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

const minWidth = isWeb ? 320 : width * 1;

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params; // Get event data

  // State for the form
  const [selectedSport, setSelectedSport] = useState(event.sport);
  const [selectedSkill, setSelectedSkill] = useState(event.skill);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [numParticipants, setNumParticipants] = useState(event.participants.toString());
  const [selectedGender, setSelectedGender] = useState(event.gender);
  const [cost, setCost] = useState(event.cost || 0); // Default to Free (£0) if no cost exists

  const handleSaveChanges = () => {
    console.log("Updated Event:", {
      selectedSport, selectedSkill, date, startTime, endTime, numParticipants, selectedGender, cost,
    });
    navigation.goBack(); // Navigate back after saving
  };

  return (
    <LayoutContainer>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Event</Text>

      {/* Sport Selection */}
      <Text style={styles.label}>Sport</Text>
      <Picker selectedValue={selectedSport} onValueChange={setSelectedSport} style={styles.picker}>
        {["Tennis", "Football", "Swimming", "Basketball"].map((sport) => (
          <Picker.Item key={sport} label={sport} value={sport} />
        ))}
      </Picker>

      {/* Skill Level Selection */}
      <Text style={styles.label}>Skill Level</Text>
      <Picker selectedValue={selectedSkill} onValueChange={setSelectedSkill} style={styles.picker}>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <Picker.Item key={level} label={level} value={level} />
        ))}
      </Picker>

      {/* Date Input */}
      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      {/* Start Time Input */}
      <Text style={styles.label}>Start Time</Text>
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />

      {/* End Time Input */}
      <Text style={styles.label}>End Time</Text>
      <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} />

      {/* Participants Input */}
      <Text style={styles.label}>Participants</Text>
      <TextInput style={styles.input} value={numParticipants} onChangeText={setNumParticipants} keyboardType="numeric" />

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <Picker selectedValue={selectedGender} onValueChange={setSelectedGender} style={styles.picker}>
        {["Male", "Female", "Both"].map((gender) => (
          <Picker.Item key={gender} label={gender} value={gender} />
        ))}
      </Picker>

      {/* Cost Selection */}
      <Text style={styles.label}>Event Cost (£)</Text>
      <Text style={styles.costValue}>£{cost}</Text>
      {/* <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={200}
        step={5}
        value={cost}
        onValueChange={(value) => setCost(value)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#007AFF"
      /> */}

      {/* Save Changes Button */}
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </ScrollView>
    </LayoutContainer>
  );
}

// Add PropTypes validation
EditEventScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      event: PropTypes.shape({
        sport: PropTypes.string.isRequired,
        skill: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
        participants: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        cost: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

EditEventScreen.displayName = 'EditEventScreen';  // Set display name for debugging

const styles = StyleSheet.create({
  container: { padding: 20, minWidth: minWidth },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  picker: { height: 50, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, fontSize: 16, marginBottom: 10 },
  costValue: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  // slider: { width: "100%", height: 40 },
});

