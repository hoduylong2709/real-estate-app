import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as constants from '../constants';
import { Context as LocationContext } from '../context/LocationContext';

const MapScreen = ({ navigation }) => {
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
    navigation.navigate('AddListing');
  }

  return (
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
        buttonStyle={{ backgroundColor: constants.MAIN_COLOR, borderRadius: 10, margin: 10 }}
        onPress={() => locationSubmit({ address: 'Your listing location', latitude: location.latitude, longitude: location.longitude })}
      />
    </View>
  );
};

MapScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    }
  };
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.75
  }
});

export default MapScreen;

