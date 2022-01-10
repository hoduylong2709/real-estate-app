import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Text, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as ListingContext } from '../context/ListingContext';
import Spacer from './../components/Spacer';
import CategoryCard from '../components/CategoryCard';
import ListingCard from '../components/ListingCard';
import socket from '../../socket';

const HomeScreen = ({ navigation }) => {
  const { fetchCategories, state: { categories, categoryLoading } } = useContext(CategoryContext);
  const { fetchPopularListings, clearPopularListings, state: { popularListings, loading } } = useContext(ListingContext);
  const userId = navigation.getParam('userId');

  useEffect(() => {
    fetchCategories();
    socket.connect();
    socket.emit('addUser', userId);
  }, []);

  const checkFavorite = listing => {
    return listing.favoriteUsers.includes(userId);
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {
        clearPopularListings();
        fetchPopularListings();
      }} />
      <Spacer>
        <Text h4 style={styles.title}>Categories</Text>
      </Spacer>
      <View style={{ marginLeft: 15, marginRight: 15 }}>
        {categoryLoading && <ActivityIndicator size='small' color='grey' />}
        <ScrollView
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {categories && categories.map(category => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={category._id}
            >
              <CategoryCard
                imageUrl={category.image}
                categoryName={category.name}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Spacer>
        <Text h4 style={styles.title}>Popular</Text>
      </Spacer>
      <View>
        {loading && <ActivityIndicator size='small' color='grey' />}
        <ScrollView
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {popularListings && popularListings.map(
            popularListing => (
              <ListingCard
                key={popularListing._id}
                listingId={popularListing._id}
                title={popularListing.title}
                price={popularListing.price.value}
                currency={popularListing.price.currency}
                location={popularListing.location}
                photos={popularListing.photos}
                navigation={navigation}
                isFavoriteByUser={checkFavorite(popularListing)}
                properties={popularListing.category}
                description={popularListing.description}
                owner={popularListing.owner}
                ratings={popularListing.ratings}
                userId={userId}
              />
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: () => (
      <TouchableOpacity
        activeOpacity={0.5}
      >
        <View style={{ marginLeft: 15 }}>
          <Image
            source={require('../../assets/welcome-logo.png')}
            style={{ width: 35, height: 35 }}
          />
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={styles.headerRight}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('AddListing')}
        >
          <MaterialIcons name="post-add" size={26} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <MaterialIcons name="map" size={26} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
      </View>
    ),
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
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    marginRight: 15
  },
  title: {
    color: '#A6A6A6',
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export default HomeScreen;

