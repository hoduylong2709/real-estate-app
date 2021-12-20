import React, { useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import * as constants from '../constants';
import ListingCard from '../components/ListingCard';
import { Context as ListingContext } from '../context/ListingContext';

const MyFavoriteListingScreen = ({ navigation }) => {
  const { state: { favoriteListings, loading }, fetchFavoriteListings } = useContext(ListingContext);
  const userId = navigation.getParam('userId');

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchFavoriteListings} />
      {loading && <ActivityIndicator size='small' color='grey' />}
      {
        !loading &&
        favoriteListings.length === 0 &&
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <FontAwesome name='list-ul' size={20} color='grey' />
          <Text style={{ fontSize: 14, color: 'grey', fontWeight: 'bold' }}>No listing found</Text>
        </View>
      }
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5 }}>
          {favoriteListings && favoriteListings.map(
            favoriteListing => (
              <ListingCard
                key={favoriteListing._id}
                listingId={favoriteListing._id}
                title={favoriteListing.title}
                price={favoriteListing.price.value}
                currency={favoriteListing.price.currency}
                location={favoriteListing.location}
                photos={favoriteListing.photos}
                navigation={navigation}
                isFavoriteByUser={true}
                properties={favoriteListing.category}
                description={favoriteListing.description}
                owner={favoriteListing.owner}
                ratings={favoriteListing.ratings}
                userId={userId}
              />
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

MyFavoriteListingScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'My Favorite'
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

export default MyFavoriteListingScreen;

