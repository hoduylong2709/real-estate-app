import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import moment from 'moment';
const { width } = Dimensions.get('screen');

const RatingCard = ({ rating, isUser }) => {
  const { stars, review, createdAt, owner } = rating;

  return (
    <TouchableOpacity
      style={styles.ratingContainer}
      activeOpacity={0.85}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {owner && <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{isUser ? 'You' : owner.fullname}</Text>}
            <Text style={{ fontSize: 10, color: '#5b5b5b', fontWeight: 'bold' }}>{moment(createdAt).fromNow()}</Text>
            <Rating
              ratingCount={5}
              imageSize={14}
              startingValue={stars}
              tintColor='#fafafa'
              readonly
            />
          </View>
          {owner &&
            (owner.avatar ?
              <Avatar size='small' source={{ uri: owner.avatar }} rounded /> :
              <Avatar size='small' source={require('../../assets/user.png')} rounded />
            )
          }
        </View>
        <Text
          style={{ fontSize: 11, color: '#5b5b5b', marginTop: 5 }}
          numberOfLines={3}
        >
          {review}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: '#fafafa',
    height: 140,
    width: width / 2 - 20,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 5,
    marginBottom: 10,
    elevation: 5,
    padding: 15
  }
});

export default RatingCard;

