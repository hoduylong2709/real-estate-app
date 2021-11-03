import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import * as constants from '../constants';
import ListingCard from '../components/ListingCard';
import { Context as ListingContext } from '../context/ListingContext';

const MyListingScreen = () => {
  const { state: { listings }, fetchListings } = useContext(ListingContext);

  const countAverageStars = stars => {
    if (stars.length === 0) {
      return 0;
    } else if (stars.length === 1) {
      return stars[0];
    } else {
      return Math.round(stars.reduce((a, b) => a + b, 0) / stars.length);
    }
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchListings} />
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {listings && listings.map(
            listing => (
              <ListingCard
                key={listing._id}
                title={listing.title}
                location={listing.location.address}
                description={listing.description}
                stars={countAverageStars(listing.stars)}
                photos={listing.photos}
              />
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

MyListingScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'My Listing'
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default MyListingScreen;

