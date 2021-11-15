import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Rating } from 'react-native-ratings';

const MyListingCard = ({ title, location, stars, photos }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: photos[0].imageUrl }}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={{ fontWeight: 'bold' }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{ fontWeight: 'bold', color: 'grey', maxWidth: 120, fontSize: 12 }}
            numberOfLines={1}
          >
            {location}
          </Text>
          <View style={{ alignItems: 'flex-start' }}>
            <Rating
              ratingCount={5}
              imageSize={18}
              style={{ marginTop: 5 }}
              startingValue={stars}
              tintColor='#eee'
              readonly
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    margin: 5
  },
  image: {
    height: 110,
    width: Dimensions.get('window').width * 0.45
  },
  textContainer: {
    padding: 10,
    width: 160
  }
});

export default MyListingCard;

