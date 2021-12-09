import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'Add Listing',
    headerLeft: () => null
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

