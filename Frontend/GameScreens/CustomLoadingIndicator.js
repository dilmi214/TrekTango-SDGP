import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const CustomLoadingIndicator = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Ensure the loading indicator is above other components
  },
});

export default CustomLoadingIndicator;
