import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import ProfileListingCard from '../components/ProfileListingCard';
import * as constants from '../constants';
const { width } = Dimensions.get('screen');

const MapListingScreen = ({ navigation }) => {
  const listings = navigation.getParam('listings');
  const [coords, setCoords] = useState({ latitude: listings[0].location.latitude, longitude: listings[0].location.longitude });
  const markers = listings.map(listing => {
    return {
      key: listing._id,
      title: listing.title,
      coordinates: {
        latitude: listing.location.latitude,
        longitude: listing.location.longitude
      }
    };
  });
  const mapViewRef = useRef(null);
  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 50 });

  const onViewRef = useRef(({ viewableItems }) => {
    mapViewRef.current.animateToRegion({
      latitude: viewableItems[0].item.location.latitude,
      longitude: viewableItems[0].item.location.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025
    }, 1000);
    setCoords({
      latitude: viewableItems[0].item.location.latitude,
      longitude: viewableItems[0].item.location.longitude
    });
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapView => { mapViewRef.current = mapView; }}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025
        }}
      >
        {markers?.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinates}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.titleMarker}>{marker.title}</Text>
              <FontAwesome5 name='map-marker-alt' size={32} color='red' />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={{ marginTop: 'auto' }}>
        <FlatList
          data={listings}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width, justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={0.9}
              onPress={() => {
                mapViewRef.current.animateToRegion({
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  latitudeDelta: 0.025,
                  longitudeDelta: 0.025
                }, 1000);
                setCoords({
                  latitude: item.location.latitude,
                  longitude: item.location.longitude
                });
              }}
            >
              <ProfileListingCard listing={item} horizontal={true} />
            </TouchableOpacity>
          )}
          horizontal
          pagingEnabled
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>
    </View>
  );
};

MapListingScreen.navigationOptions = () => {
  return {
    title: 'Map',
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  map: {
    width: '100%',
    height: '100%',
    borderWidth: 1
  },
  titleMarker: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: 'white',
    borderColor: '#C5C5C5'
  }
});

export default MapListingScreen;

