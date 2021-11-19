import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as constants from '../constants';

const PropertyList = ({ properties }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
      {
        properties.hasOwnProperty('rentOrBuy') &&
        <View style={styles.propertyContainer}>
          <FontAwesome5 name='home' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>{properties['rentOrBuy']}</Text>
        </View>
      }
      {
        properties.hasOwnProperty('squareFeet') &&
        <View style={styles.propertyContainer}>
          <MaterialCommunityIcons name='aspect-ratio' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>{properties['squareFeet']}</Text>
        </View>
      }
      {
        properties.hasOwnProperty('bedrooms') &&
        <View style={styles.propertyContainer}>
          <FontAwesome name='hotel' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>{properties['bedrooms'].toString()} Beds</Text>
        </View>
      }
      {
        properties.hasOwnProperty('baths') &&
        <View style={styles.propertyContainer}>
          <MaterialIcons name='bathtub' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>{properties['baths'].toString()} Baths</Text>
        </View>
      }
      {
        properties.hasOwnProperty('newConstruction') && properties['newConstruction'] === true &&
        <View style={styles.propertyContainer}>
          <Ionicons name='construct' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>New Construct</Text>
        </View>
      }
      {
        properties.hasOwnProperty('yearBuilt') &&
        <View style={styles.propertyContainer}>
          <FontAwesome name='calendar' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>{properties['yearBuilt'].substring(3)}</Text>
        </View>
      }
      {
        properties.hasOwnProperty('closeToPublicTransportation') && properties['closeToPublicTransportation'] === true &&
        <View style={styles.propertyContainer}>
          <MaterialIcons name='emoji-transportation' size={18} color={constants.MAIN_COLOR} />
          <Text style={styles.propertyText}>Close public transportation</Text>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  propertyContainer: {
    flexDirection: 'row',
    marginRight: 15,
    marginVertical: 5
  },
  propertyText: {
    marginLeft: 5,
    color: '#A9A9A9'
  }
});

export default PropertyList;

