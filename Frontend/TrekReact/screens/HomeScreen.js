import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../screens/CustomComponents/NavBar'; // Import the NavBar component
import Layout from './CustomComponents/ScreenLayout';

const HomeScreen = () => {
  
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>Home</Text>
        </View>

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;
