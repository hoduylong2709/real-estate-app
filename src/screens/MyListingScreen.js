import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import * as constants from '../constants';
import MyListingCard from '../components/MyListingCard';
import { Context as ListingContext } from '../context/ListingContext';
import { countAverageStars } from '../utils/countAverageStars';

const MyListingScreen = () => {
  const { state: { listings }, fetchListings } = useContext(ListingContext);

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchListings} />
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {listings && listings.map(
            listing => (
              <MyListingCard
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

