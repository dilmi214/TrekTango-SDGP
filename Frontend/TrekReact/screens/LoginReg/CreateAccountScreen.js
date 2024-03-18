import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';

export default function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateAccount = () => {
    // Implement rithiks account creation logic here
    navigation.navigate('Main')
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    setShowDatePicker(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.createAccountText}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
        textContentType="none" 
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        textContentType="none"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Date of Birth:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>
            {dateOfBirth ? dateOfBirth.toDateString() : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePickerModal
                testID="dateTimePicker"
                value={dateOfBirth || new Date()}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={handleDateChange}
              />
              <Button title="Confirm" onPress={handleConfirmDate} />
            </View>
          </View>
        </Modal>
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  createAccountText: {
    color: 'white',
    marginBottom: 16,
    fontSize: 18,
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
  datePickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  datePickerLabel: {
    color: 'white',
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: '#4CAF50', 
    height: 40,
    width: '60%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  datePickerButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  createAccountButton: {
    backgroundColor: '#0F4792',
    height: 40,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
