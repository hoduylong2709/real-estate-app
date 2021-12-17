import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListingForm from '../components/ListingForm';

const EditListingScreen = ({ navigation }) => {
  const listing = navigation.getParam('listing');

  return (
    <View style={styles.container}>
      <ListingForm
        isEdit={true}
        listing={listing}
        navigation={navigation}
      />
    </View>
  );
};

EditListingScreen.navigationOptions = () => {
  return {
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'Edit Listing',
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

export default EditListingScreen;

