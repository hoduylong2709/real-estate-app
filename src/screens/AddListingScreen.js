import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as constants from '../constants';
import ListingForm from '../components/ListingForm';

const AddListingScreen = () => {
  return (
    <View style={styles.container}>
      <ListingForm />
    </View>
  );
};

AddListingScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'Add Listing'
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default AddListingScreen;

