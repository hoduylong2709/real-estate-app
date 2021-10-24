import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Marker, Callout } from 'react-native-maps';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import * as constants from '../constants';
import { Context as LocationContext } from '../context/LocationContext';

const MapModal = ({ isModalVisible, closeModal }) => {
  const [location, setLocation] = useState(null);
  const { addLocation } = useContext(LocationContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return alert('Permission to access location was denied!');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, []);

  const locationSubmit = location => {
    addLocation(location);
    closeModal();
  }

  return (
    <Modal
      isVisible={isModalVisible}
      style={styles.modal}
    >
      <View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025
            }}
            onRegionChangeComplete={region => setLocation(region)}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable={true}
              onDragEnd={e => {
                setLocation({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                })
              }}
            >
              <Callout>
                <Text>Your location!</Text>
              </Callout>
            </Marker>
          </MapView>
        )}
        <Button
          title='Set location'
          buttonStyle={styles.submit}
          onPress={() => locationSubmit({ address: 'Your listing location', latitude: location.latitude, longitude: location.longitude })}
        />
        <Button
          title='Cancel'
          buttonStyle={styles.cancel}
          onPress={closeModal}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.85
  },
  submit: {
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 10,
    margin: 10
  },
  cancel: {
    backgroundColor: '#f46b61',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  }
});

export default MapModal;

