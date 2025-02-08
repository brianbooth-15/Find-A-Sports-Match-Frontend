import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";

// Dummy friend list
const dummyFriends = [
  "Alice Johnson", "Bob Smith", "Charlie Brown", "David White", "Emma Wilson",
  "Fiona Green", "George Harris", "Hannah Adams", "Ian Clark", "Jack Baker",
  "Karen Mitchell", "Liam Scott", "Megan Turner", "Nathan Hall", "Olivia Moore",
  "Peter Evans", "Quinn Wright", "Rachel Taylor", "Samuel Lewis", "Tina Phillips"
];

export default function SearchFriendsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(dummyFriends);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredFriends(dummyFriends); // Reset to full list when search is empty
    } else {
      const filtered = dummyFriends.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Friends</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a friend..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.friendName}>{item}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  friendName: { fontSize: 16, fontWeight: "bold" },
  addButton: { backgroundColor: "#007AFF", paddingVertical: 6, paddingHorizontal: 15, borderRadius: 5 },
  addButtonText: { color: "white", fontWeight: "bold" },
});

