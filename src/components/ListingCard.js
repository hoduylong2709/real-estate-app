import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import { Context as ListingContext } from '../context/ListingContext';
const { width } = Dimensions.get('screen');

const ListingCard = ({ listingId, title, price, currency, location, stars, photos, navigation, isFavoriteByUser, numberOfRatings, properties }) => {
  const [favoriteListing, setFavoriteListing] = useState(isFavoriteByUser);
  const { addFavoriteUser, deleteFavoriteUser, increaseViews } = useContext(ListingContext);

  const pressIcon = () => {
    if (favoriteListing) {
      deleteFavoriteUser(listingId);
      setFavoriteListing(false);
    } else {
      addFavoriteUser(listingId);
      setFavoriteListing(true);
    }
  };

  return (
    <TouchableOpacity
      style={{ marginLeft: 15, marginRight: 15, marginTop: 3, marginBottom: 20 }}
      activeOpacity={0.9}
      onPress={() => {
        increaseViews(listingId);
        navigation.navigate('ListingDetail', {
          listingProperties: {
            photos,
            isFavorite: favoriteListing,
            pressIcon,
            title,
            stars,
            numberOfRatings,
            location,
            properties
          }
        });
      }}
    >
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ position: 'absolute', top: 20, right: 30, zIndex: 1 }}
          onPress={pressIcon}
        >
          <MaterialIcons
            name='favorite'
            size={28}
            color={favoriteListing ? '#ea9999' : 'white'}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: photos[0].imageUrl }}
          style={styles.cardImage}
          resizeMode='cover'
        />
        <View style={{ marginTop: 10 }}>
          <View style={styles.titleAndPriceContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.price}>
              {price}{currency}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name='location' size={17} color={constants.MAIN_COLOR} />
            <Text style={styles.location}>
              {location}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Rating
              ratingCount={5}
              imageSize={17}
              style={{ marginTop: 5 }}
              startingValue={stars}
              readonly
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 240,
    backgroundColor: 'white',
    elevation: 10,
    width: width - 30,
    padding: 13,
    borderRadius: 20
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 15,
  },
  titleAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    fontWeight: 'bold',
    color: constants.MAIN_COLOR,
    fontSize: 15
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  location: {
    color: 'grey',
    fontSize: 14
  }
});

export default ListingCard;

