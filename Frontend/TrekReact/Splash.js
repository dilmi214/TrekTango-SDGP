import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the Home screen after 4 seconds
      navigation.navigate('Home');
    }, 4000);

    // Clear the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run the effect only once

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
