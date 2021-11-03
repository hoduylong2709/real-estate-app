import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';
import * as constants from '../constants';

const ListingCard = ({ title, location, stars, photos }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: `data:image/png;base64,${photos[0]}` }}
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
          <StarRating
            disabled={false}
            maxStars={5}
            rating={stars}
            fullStarColor={constants.MAIN_COLOR}
            starSize={14}
            starStyle={{ marginTop: 5 }}
          />
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

export default ListingCard;

