import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleSignInPress = () => {
    navigation.navigate('Main');
  };

  const handleCreateAccountPress = () => {
    navigation.navigate('CreateAccountScreen');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

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
      <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.space}></View>
      <View style={styles.orContainer}>
        <View style={styles.smallLine}></View>
        <Text style={styles.orText}>or</Text>
        <View style={styles.smallLine}></View>
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccountPress}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPasswordPress}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
  forgotPasswordButton: {
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#8CCDF1',
  },
});

export default LoginScreen;
