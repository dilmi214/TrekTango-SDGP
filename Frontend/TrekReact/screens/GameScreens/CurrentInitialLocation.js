import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const CurrentLocationScreen = ({ route }) => {
  const { longitude, latitude } = route.params;
  const mapRef = useRef(null);

  const zoomToMarker = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02, // zoom level (smaller for closer, larger for farther)
        longitudeDelta: 0.02,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // add the ref to the MapView component
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 10, // initial zoom level for overview
          longitudeDelta: 10,
        }}
        onMapReady={zoomToMarker} // call zoomToMarker on map ready
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Current Location"
          description="You are here"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default CurrentLocationScreen;
