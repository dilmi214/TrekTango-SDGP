import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.back,
      photo: null,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  flipCamera = () => {
    this.setState({
      cameraType:
        this.state.cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({ photo });
    }
  };

  retakePhoto = () => {
    this.setState({ photo: null });
  };

  confirmPhoto = () => {
    // Handle photo confirmation logic
    console.log('Photo confirmed:', this.state.photo);
    // Reset state or navigate to next screen
  };

  renderCamera = () => {
    const { hasPermission, photo } = this.state;

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    
    if (photo) {
      return (
        <View style={styles.preview}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={this.retakePhoto}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.confirmPhoto}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <Camera
        style={styles.camera}
        type={this.state.cameraType}
        ref={(ref) => {
          this.camera = ref;
        }}
      >
        <View style={styles.cameraContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={this.flipCamera}>
            <Ionicons name="camera-reverse-outline" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
  } 
  ,
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  button: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#010C33',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
