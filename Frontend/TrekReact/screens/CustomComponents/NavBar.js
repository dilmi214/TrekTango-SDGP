import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.tab}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Game')} style={styles.tab}>
        <Text>Game</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.tab}>
        <Text>Social</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.tab}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'light-blue',
    paddingBottom: 20,
    backgroundColor: '#fff'
  },
  text: {
    color: '#fff'
  },
  tab: {
    padding: 10,
  },
});

export default NavBar;
