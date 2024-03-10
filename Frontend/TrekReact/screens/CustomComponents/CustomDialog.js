import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDialog = ({ visible, title, message, options, onSelect }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onSelect(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.optionContainer}>
            {options.map(option => (
              <TouchableOpacity key={option} onPress={() => onSelect(option)} style={styles.optionButton}>
                <Text style={styles.option}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    backgroundColor: '#1B1F32',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 10,
    width: '65%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
  },
  option: {
    fontSize: 16,
    color: '#4ECCA3',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CustomDialog;
