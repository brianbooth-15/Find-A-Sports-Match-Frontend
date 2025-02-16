import React, { useState } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, 
  Platform 
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';  // Import PropTypes for validation

// import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

// Conditionally import KeyboardAvoidingView only for mobile
const KeyboardAvoidingView = Platform.OS === "ios" || Platform.OS === "android" 
  ? require("react-native").KeyboardAvoidingView 
  : View;

const sportsList = [
  "Walking (for fitness)", "Swimming", "Football (Soccer)", "Cycling", 
  "Running/Jogging", "Golf", "Tennis", "Badminton", 
  "Rugby (Union & League)", "Basketball"
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const genderOptions = ["Male", "Female", "Both"];

export default function CreateEventScreen({ navigation }) {
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const [selectedGender, setSelectedGender] = useState("Both");
  const [cost, setCost] = useState(0);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleDateConfirm = (date) => {
    setDate(moment(date).format("DD/MM/YYYY"));
    hideDatePicker();
  };

  const handleStartTimeConfirm = (time) => {
    setStartTime(moment(time).format("HH:mm"));
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(moment(time).format("HH:mm"));
    hideEndTimePicker();
  };

  const handleSaveEvent = () => {
    console.log("Event saved:", {
      selectedSport, selectedSkill, date, startTime, endTime, numParticipants, selectedGender, cost
    });
    navigation.navigate("Home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Create Event</Text>

        {/* Sport Selection */}
        <Text style={styles.label}>Select Sport</Text>
        <Picker
          selectedValue={selectedSport}
          onValueChange={(itemValue) => setSelectedSport(itemValue)}
          style={styles.picker}
        >
          {sportsList.map((sport) => (
            <Picker.Item key={sport} label={sport} value={sport} />
          ))}
        </Picker>

        {/* Skill Level Selection */}
        <Text style={styles.label}>Select Skill Level</Text>
        <Picker
          selectedValue={selectedSkill}
          onValueChange={(itemValue) => setSelectedSkill(itemValue)}
          style={styles.picker}
        >
          {skillLevels.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>

        {/* Date Selection */}
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.dateText}>{date || "Choose Date"}</Text>
        </TouchableOpacity>

        {/* Start Time Selection */}
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={showStartTimePicker}>
          <Text style={styles.timeText}>{startTime || "Choose Start Time"}</Text>
        </TouchableOpacity>

        {/* End Time Selection */}
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity onPress={showEndTimePicker}>
          <Text style={styles.timeText}>{endTime || "Choose End Time"}</Text>
        </TouchableOpacity>

        {/* Number of Participants */}
        <Text style={styles.label}>Number of Participants</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numParticipants}
          onChangeText={setNumParticipants}
          placeholder="Enter number of participants"
        />

        {/* Gender Selection */}
        <Text style={styles.label}>Select Gender</Text>
        <Picker
          selectedValue={selectedGender}
          onValueChange={(itemValue) => setSelectedGender(itemValue)}
          style={styles.picker}
        >
          {genderOptions.map((gender) => (
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

        {/* Save Event Button */}
        <Button title="Save Event" onPress={handleSaveEvent} />
      </ScrollView>

      {/* Date Picker Modals */}
      {/* <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleDateConfirm} onCancel={hideDatePicker} />
      <DateTimePickerModal isVisible={isStartTimePickerVisible} mode="time" onConfirm={handleStartTimeConfirm} onCancel={hideStartTimePicker} />
      <DateTimePickerModal isVisible={isEndTimePickerVisible} mode="time" onConfirm={handleEndTimeConfirm} onCancel={hideEndTimePicker} /> */}
    </KeyboardAvoidingView>
  );
}

// Add PropTypes validation
CreateEventScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

CreateEventScreen.displayName = 'CreateEventScreen';  // Set display name for debugging


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  picker: {
    height: 60,
    width: "100%",
    marginBottom: 15,
    justifyContent: "center",
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  timeText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 15,
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
  costValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  // slider: {
  //   width: "100%",
  //   height: 40,
  // },
});
