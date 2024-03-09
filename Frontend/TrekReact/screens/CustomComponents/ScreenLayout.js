
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from './NavBar'; 

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Layout;
