// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const handleRegisterPress = () => {
//     navigation.navigate('Home');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.text}>Register</Text>
//         <Text style={styles.description}>Create an account to get started</Text>
//       </View>
//       <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
//         <Text style={styles.registerButtonText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   content: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   registerButton: {
//     backgroundColor: 'blue',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 5,
//   },
//   registerButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default RegisterScreen;
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateAccountScreen from './CreateAccountScreen';

function App({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://i.imgur.com/uJQUEuh.png' }}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.signInText}>Sign in to continue</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.space}></View>
      <View style={styles.orContainer}>
        <View style={styles.smallLine}></View>
        <Text style={styles.orText}>or</Text>
        <View style={styles.smallLine}></View>
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 40, 
  },
  logo: {
    width: 243,
    height: 244,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  signInText: {
    color: 'white',
    marginBottom: 16,
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: '#181818',
    marginBottom: 20, 
    paddingLeft: 8,
    color: 'white',
    borderRadius: 10,
  },
  signInButton: {
    backgroundColor: '#0F4792',
    height: 40,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  space: {
    height: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
  smallLine: {
    flex: 0.4,
    height: 1,
    backgroundColor: 'white',
    marginLeft: 8,
    marginRight: 8,
  },
  orText: {
    color: 'white',
  },
  createAccountButton: {
    marginTop: 16,
  },
  createAccountText: {
    color: '#8CCDF1',
  },
});

const Stack = createStackNavigator();

export default function AppWithNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen name="App" component={App} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
