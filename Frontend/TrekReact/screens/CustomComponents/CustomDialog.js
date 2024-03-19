import React from 'react';
import Dialog from 'react-native-dialog';
import { StyleSheet } from 'react-native';

const CustomDialog = ({ visible, title, message, options, onSelect }) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title style={styles.title}>{title}</Dialog.Title>
      <Dialog.Description style={styles.message}>{message}</Dialog.Description>
      {options.map(option => (
        <Dialog.Button
          key={option}
          label={option}
          onPress={() => onSelect(option)}
          labelStyle={styles.option}
        />
      ))}
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White color for title text
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff', // White color for message text
    textAlign: 'center',
  },
  option: {
    fontSize: 16,
    color: '#4ECCA3', // Custom color for options
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CustomDialog;
