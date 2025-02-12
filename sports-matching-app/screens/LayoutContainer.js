import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Determine if the platform is web or mobile
const isWeb = Platform.OS === 'web';

// Set maxWidth for web and default container width for mobile
const maxWidth = isWeb ? 800 : width * 0.9;  // Web: 800px, Mobile: 90% of screen width
const minWidth = 320;  // Set a reasonable minimum width for the content

const LayoutContainer = ({ children }) => {
  return (
    <View 
      style={[
        styles.container, 
        { 
          maxWidth: maxWidth, 
          minWidth: minWidth, 
          height: 'auto',  // Allow dynamic height
          paddingTop: 50, // Top padding for better spacing
          marginBottom: 20,  // To prevent any excess space at the bottom
        }
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'flex-start', // Align content at the top
    alignItems: 'center',  // Center content horizontally
    backgroundColor: '#f9f9f9',
    alignSelf: 'center',  // Center the container
    overflowY: 'auto',  // Enable scrolling if content exceeds height
    maxHeight: '100vh',  // Ensure it doesn’t exceed viewport height
  },
});

export default LayoutContainer;
