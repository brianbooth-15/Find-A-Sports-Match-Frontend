import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Swiper from 'react-native-swipeable-cards';

const initialEvents = [
  {
    id: "1",
    sport: "Tennis",
    skill: "Intermediate",
    date: "10/02/2025",
    startTime: "15:00",
    endTime: "16:30",
    participants: 4,
    gender: "Both",
    cost: 10,
    location: "Central Park, NYC",
    postedBy: "John Doe",
  },
  {
    id: "2",
    sport: "Football",
    skill: "Advanced",
    date: "12/02/2025",
    startTime: "18:00",
    endTime: "20:00",
    participants: 10,
    gender: "Male",
    cost: 0,
    location: "Downtown Stadium, NYC",
    postedBy: "Jane Smith",
  },
  // Add more dummy events for testing
];

export default function SearchForMatchScreen({ navigation }) {
  const [swiped, setSwiped] = useState([]);

  const handleSwipe = (cardIndex, action) => {
    const event = initialEvents[cardIndex];

    if (action === 'right') {
      // User swiped right (Interested)
      setSwiped([...swiped, event]);
      console.log(`Interested in: ${event.sport} hosted by ${event.postedBy}`);
    } else {
      // User swiped left (Not Interested)
      console.log(`Passed on: ${event.sport}`);
    }
  };

  const renderCard = (event) => {
    return (
      <View style={styles.card}>
        <Text style={styles.sport}>{event.sport}</Text>
        <Text>Skill Level: {event.skill}</Text>
        <Text>Date: {event.date}</Text>
        <Text>Time: {event.startTime} - {event.endTime}</Text>
        <Text>Participants: {event.participants}</Text>
        <Text>Gender: {event.gender}</Text>
        <Text>Location: {event.location}</Text>
        <Text>Posted by: {event.postedBy}</Text>
        <Text>Cost: {event.cost === 0 ? "Free" : `£${event.cost}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Swiper
        cards={initialEvents}
        renderCard={renderCard}
        onSwiped={(cardIndex) => handleSwipe(cardIndex, 'left')}
        onSwipedRight={(cardIndex) => handleSwipe(cardIndex, 'right')}
        backgroundColor={'#f9f9f9'}
        cardHorizontalMargin={10}
        stackSize={3}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: 'red',
                color: 'white',
                borderColor: 'red',
                borderWidth: 1,
              },
            },
          },
          right: {
            title: 'YES!',
            style: {
              label: {
                backgroundColor: 'green',
                color: 'white',
                borderColor: 'green',
                borderWidth: 1,
              },
            },
          },
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height: 350,
    width: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  sport: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

