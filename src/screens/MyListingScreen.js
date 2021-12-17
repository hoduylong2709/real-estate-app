import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import * as constants from '../constants';
import ListingCard from '../components/ListingCard';
import { Context as ListingContext } from '../context/ListingContext';

const MyListingScreen = ({ navigation }) => {
  const { state: { listings, loading }, fetchListings } = useContext(ListingContext);

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchListings} />
      {loading && <ActivityIndicator size='small' color='grey' />}
      {
        !loading &&
        listings.length === 0 &&
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <FontAwesome name='list-ul' size={20} color='grey' />
          <Text style={{ fontSize: 14, color: 'grey', fontWeight: 'bold' }}>No listing found</Text>
        </View>
      }
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5 }}>
          {listings && listings.map(
            listing => (
              <ListingCard
                key={listing._id}
                listingId={listing._id}
                title={listing.title}
                price={listing.price.value}
                currency={listing.price.currency}
                location={listing.location}
                photos={listing.photos}
                navigation={navigation}
                isFavoriteByUser={false}
                properties={listing.category}
                description={listing.description}
                owner={listing.owner}
                ratings={listing.ratings}
                userId={listing.owner}
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

