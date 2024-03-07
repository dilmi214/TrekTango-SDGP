import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const CustomDialog = ({ visible, title, message, options, onSelect }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onSelect(null)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>{message}</Text>
          {options.map(option => (
            <TouchableOpacity key={option} onPress={() => onSelect(option)}>
              <Text style={{ fontSize: 16, color: 'blue', marginBottom: 10 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default CustomDialog;
