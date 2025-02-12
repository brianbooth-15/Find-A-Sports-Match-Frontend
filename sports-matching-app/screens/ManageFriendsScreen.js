import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LayoutContainer from './LayoutContainer';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

const minWidth = isWeb ? 320 : width * 1;

const initialFriendRequests = [
  { id: "1", firstName: "John", lastName: "Doe", photo: "👤" },
  { id: "2", firstName: "Emma", lastName: "Smith", photo: "👩" },
];

const initialFriends = [
  { id: "3", firstName: "Michael", lastName: "Brown", photo: "👨" },
];

export default function ManageFriendsScreen() {
  const navigation = useNavigation();
  const [friendRequests, setFriendRequests] = useState(initialFriendRequests);
  const [friends, setFriends] = useState(initialFriends);
  const [tab, setTab] = useState("requests"); // "friends" or "requests"

  const handleAddFriend = (friend) => {
    setFriends([...friends, friend]);
    setFriendRequests(friendRequests.filter((f) => f.id !== friend.id));
  };

  const handleRemoveRequest = (id) => {
    setFriendRequests(friendRequests.filter((f) => f.id !== id));
  };

  const renderFriend = ({ item }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendText}>{item.photo} {item.firstName} {item.lastName}</Text>
    </View>
  );

  const renderRequest = ({ item }) => (
    <View style={styles.friendCard}>
      <Text style={styles.friendText}>{item.photo} {item.firstName} {item.lastName}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveRequest(item.id)}>
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LayoutContainer>
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === "friends" && styles.activeTab]} onPress={() => setTab("friends")}>
          <Text style={styles.tabText}>Your Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === "requests" && styles.activeTab]} onPress={() => setTab("requests")}>
          <Text style={styles.tabText}>Friend Requests</Text>
        </TouchableOpacity>
      </View>

      {tab === "friends" ? (
        <FlatList data={friends} keyExtractor={(item) => item.id} renderItem={renderFriend} />
      ) : (
        <FlatList data={friendRequests} keyExtractor={(item) => item.id} renderItem={renderRequest} />
      )}

      <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("SearchFriends")}>
        <Text style={styles.buttonText}>Search Friends</Text>
      </TouchableOpacity>
    </View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9", minWidth: minWidth },
  tabs: { flexDirection: "row", marginBottom: 15 },
  tab: { flex: 1, padding: 10, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#ddd" },
  activeTab: { borderBottomColor: "#007AFF" },
  tabText: { fontSize: 16, fontWeight: "bold" },
  friendCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 },
  friendText: { fontSize: 16, flex: 1 },
  addButton: { backgroundColor: "green", padding: 10, borderRadius: 5, marginRight: 5 },
  removeButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  searchButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
