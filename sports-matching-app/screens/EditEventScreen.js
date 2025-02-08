import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";

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

  const handleSaveChanges = () => {
    console.log("Updated Event:", {
      selectedSport, selectedSkill, date, startTime, endTime, numParticipants, selectedGender,
    });
    navigation.goBack(); // Navigate back after saving
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Event</Text>

      <Text style={styles.label}>Sport</Text>
      <Picker selectedValue={selectedSport} onValueChange={setSelectedSport} style={styles.picker}>
        {["Tennis", "Football", "Swimming", "Basketball"].map((sport) => (
          <Picker.Item key={sport} label={sport} value={sport} />
        ))}
      </Picker>

      <Text style={styles.label}>Skill Level</Text>
      <Picker selectedValue={selectedSkill} onValueChange={setSelectedSkill} style={styles.picker}>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <Picker.Item key={level} label={level} value={level} />
        ))}
      </Picker>

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <Text style={styles.label}>Start Time</Text>
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} />

      <Text style={styles.label}>End Time</Text>
      <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} />

      <Text style={styles.label}>Participants</Text>
      <TextInput style={styles.input} value={numParticipants} onChangeText={setNumParticipants} keyboardType="numeric" />

      <Text style={styles.label}>Gender</Text>
      <Picker selectedValue={selectedGender} onValueChange={setSelectedGender} style={styles.picker}>
        {["Male", "Female", "Both"].map((gender) => (
          <Picker.Item key={gender} label={gender} value={gender} />
        ))}
      </Picker>

      <Button title="Save Changes" onPress={handleSaveChanges} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { padding: 20 }, label: { fontSize: 16, fontWeight: "bold", marginTop: 10 }, picker: { height: 50, marginBottom: 10 }, input: { borderWidth: 1, padding: 10, fontSize: 16, marginBottom: 10 }, });
