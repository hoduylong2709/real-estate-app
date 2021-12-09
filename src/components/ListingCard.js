import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import { Context as ListingContext } from '../context/ListingContext';
import { countAverageStars } from '../utils/countAverageStars';
const { width } = Dimensions.get('screen');

const ListingCard = ({
  listingId,
  title,
  price,
  currency,
  location,
  photos,
  navigation,
  isFavoriteByUser,
  properties,
  description,
  owner,
  ratings,
  userId
}) => {
  const [favoriteListing, setFavoriteListing] = useState(isFavoriteByUser);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const { addFavoriteUser, deleteFavoriteUser, increaseViews, deleteListing } = useContext(ListingContext);
  const averageStars = countAverageStars(ratings.map(rating => rating.stars));

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
        if (userId !== owner) {
          increaseViews(listingId);
        }
        navigation.navigate('ListingDetail', {
          listingProperties: {
            photos,
            isFavorite: favoriteListing,
            pressIcon,
            title,
            location,
            properties,
            description,
            price,
            currency,
            owner,
            listingId,
            userId
          }
        });
      }}
    >
      <View style={styles.card}>
        {
          userId === owner ?
            <View style={{ position: 'absolute', zIndex: 1, top: 20, right: 30 }}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.7}
              >
                <MaterialIcons name='edit' size={15} color='grey' />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.icon, { marginTop: 5 }]}
                activeOpacity={0.7}
                onPress={() => setConfirmationModalVisible(true)}
              >
                <MaterialIcons name='delete' size={15} color='grey' />
              </TouchableOpacity>
            </View> :
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.icon, { position: 'absolute', top: 20, right: 30, zIndex: 1 }]}
              onPress={pressIcon}
            >
              {
                favoriteListing ?
                  <MaterialIcons
                    name='favorite'
                    size={20}
                    color='#ea9999'
                  /> :
                  <MaterialIcons
                    name='favorite-outline'
                    size={20}
                    color='black'
                  />
              }
            </TouchableOpacity>
        }
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
              {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{currency}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name='location' size={17} color={constants.MAIN_COLOR} />
            <Text style={styles.location}>
              {location.address}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <AirbnbRating
              count={5}
              size={17}
              defaultRating={averageStars}
              isDisabled={true}
              showRating={false}
            />
          </View>
        </View>
      </View>
      <AwesomeAlert
        show={isConfirmationModalVisible}
        title='Confirmation'
        message='Do you want to delete this listing?'
        closeOnTouchOutside={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText='No, cancel'
        confirmText='Yes, delete it'
        confirmButtonColor='#DD6B55'
        onCancelPressed={() => setConfirmationModalVisible(false)}
        onConfirmPressed={() => {
          setConfirmationModalVisible(false);
          deleteListing(listingId);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 240,
    backgroundColor: '#fafafa',
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
  },
  icon: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#eeeeee',
    backgroundColor: 'white',
    padding: 5
  }
});

export default ListingCard;

