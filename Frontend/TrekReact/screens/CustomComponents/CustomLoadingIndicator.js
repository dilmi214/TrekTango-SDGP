import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Spinner from '../CustomComponents/spinner.gif';

const CustomLoadingIndicator = () => {
  return (
    <View style={styles.overlay}>
      <Image source={Spinner} style={styles.loadingGif} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingGif: {
    width: 100, 
    height:100,
  },
});

export default CustomLoadingIndicator;
