import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const NavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, styles.navBar]}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.tab}>
        <FontAwesome name="home" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Game')} style={styles.tab}>
      <FontAwesome6 name="map-location-dot" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.tab}>
        <MaterialIcons name="perm-media" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.tab}>
        <Octicons name="feed-person" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
    elevation: 8, 
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    padding: 10,
  },
});

export default NavBar;
