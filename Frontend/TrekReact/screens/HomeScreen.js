import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'c00e472f4fc54c0693b80206240602';
const CITY_NAME = 'Colombo';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY_NAME}&aqi=no`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
      }
    };

    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://imgur.com/uJQUEuh.jpg' }} style={styles.logo} />
      <View style={styles.weatherContainer}>
        {weather && (
          <View style={styles.weatherContent}>
            <View style={styles.weatherLeft}>
              <Text style={styles.temperature}>
                {weather.current.temp_c}<Text style={styles.degree}>°C</Text>
              </Text>
              <Text style={styles.weatherCondition}>{weather.current.condition.text}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.weatherRight}>
              <Image source={{ uri: `http:${weather.current.condition.icon}` }} style={styles.weatherIcon} />
              <Text style={styles.weatherDetail}>Humidity: {weather.current.humidity}%</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <HomePageButton text="Ongoing Trips" imageUrl="https://imgur.com/LhqUR6O.jpg" />
        <HomePageButton text="Logbook" imageUrl="https://imgur.com/mGMqTHl.jpg" />
        <HomePageButton text="Plan the Trip" imageUrl="https://imgur.com/X2qhdKU.png" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const HomePageButton = ({ text, imageUrl }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
      <Image source={{ uri: imageUrl }} style={styles.buttonImage} />
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#010C33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  weatherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  weatherLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 10,
  },
  weatherRight: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  weatherDetail: {
    fontSize: 18,
    color: '#ffffff',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  degree: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  weatherCondition: {
    fontSize: 18,
    color: '#ffffff',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: width * 0.9,

  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
};

export default HomeScreen;
