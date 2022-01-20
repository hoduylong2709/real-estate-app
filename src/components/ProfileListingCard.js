import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import * as constants from '../constants';
const { width } = Dimensions.get('screen');

const ProfileListingCard = ({ listing }) => {
  return (
    <View style={{ marginBottom: 20, marginHorizontal: 10 }}>
      <View style={styles.card}>
        <Image
          source={{ uri: listing.photos[0].imageUrl }}
          resizeMode='cover'
          style={{ width: '30%', height: '100%', borderRadius: 15 }}
        />
        <View style={styles.infoContainer}>
          <Text
            style={{ fontSize: 17, fontWeight: 'bold', color: '#52575D' }}
            numberOfLines={1}
          >
            {listing.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: '#979797', fontSize: 12 }}
          >
            {listing.location.address}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: constants.MAIN_COLOR }}>
            {listing.price.value}{listing.price.currency === 'USA' ? '$' : 'VNĐ'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 85,
    backgroundColor: '#fafafa',
    elevation: 5,
    width: width - 34,
    borderRadius: 20,
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoContainer: {
    flexDirection: 'column',
    width: 210,
    height: '70%',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    height: '100%'
  }
});

export default ProfileListingCard;

