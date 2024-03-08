import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Snackbar = ({ visible, message, duration, action }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => setIsVisible(false), duration || 2500);
      return () => clearTimeout(timeout);
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    action?.onPress(); // Call action onPress if provided
  };

  if (!isVisible) return null;

  return (
    <View style={[styles.container, { position: 'absolute', bottom: 20, left: 0, right: 0, zIndex: 999 }]}>
      <Text style={styles.text}>{message}</Text>
      {action && (
        <TouchableOpacity style={styles.action} onPress={handleDismiss}>
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  action: {
    marginLeft: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Snackbar;
