import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Initial Fake Event Data with Cost Field
const initialEvents = [
  { id: "1", sport: "Tennis", skill: "Intermediate", date: "10/02/2025", startTime: "15:00", endTime: "16:30", participants: 4, gender: "Both", cost: 10 },
  { id: "2", sport: "Football", skill: "Advanced", date: "12/02/2025", startTime: "18:00", endTime: "20:00", participants: 10, gender: "Male", cost: 0 }, // Free event
  { id: "3", sport: "Swimming", skill: "Beginner", date: "15/02/2025", startTime: "10:00", endTime: "11:00", participants: 5, gender: "Female", cost: 5 },
  { id: "4", sport: "Basketball", skill: "Intermediate", date: "18/02/2025", startTime: "17:30", endTime: "19:00", participants: 6, gender: "Both", cost: 15 },
];

export default function ManageEventsScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState(initialEvents);

  // Handle Delete Event
  const handleDeleteEvent = (id) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setEvents(events.filter(event => event.id !== id)), style: "destructive" },
    ]);
  };

  // Navigate to Edit Event Screen
  const handleEditEvent = (event) => {
    navigation.navigate("EditEvent", { event }); // Pass event data
  };

  // Render each event
  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventText}><Text style={styles.bold}>Sport:</Text> {item.sport}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>Skill:</Text> {item.skill}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>Date:</Text> {item.date}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>Start Time:</Text> {item.startTime}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>End Time:</Text> {item.endTime}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>Participants:</Text> {item.participants}</Text>
      <Text style={styles.eventText}><Text style={styles.bold}>Gender:</Text> {item.gender}</Text>
      <Text style={styles.eventText}>
        <Text style={styles.bold}>Cost:</Text> {typeof item.cost === "number" ? (item.cost === 0 ? "Free" : `£${item.cost}`) : "Free"}
      </Text>
  
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditEvent(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Events</Text>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />

      {/* Button to Create New Event */}
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateEvent")}>
        <Text style={styles.buttonText}>+ Create New Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  eventCard: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  eventText: { fontSize: 16, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  editButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
  deleteButton: { backgroundColor: "#FF3B30", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: "center" },
  createButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
