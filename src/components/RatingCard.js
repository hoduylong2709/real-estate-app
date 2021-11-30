import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import moment from 'moment';

const RatingCard = ({ rating, isCurrentUser }) => {
  const { stars, review, createdAt, owner } = rating;
  const [textShown, setTextShown] = useState(false); // To show the remaining text
  const [lengthMore, setLengthMore] = useState(false); // To show 'see more' or 'see less'

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = e => {
    setLengthMore(e.nativeEvent.lines.length > 3);
  };

  return (
    <TouchableOpacity
      style={styles.ratingContainer}
      activeOpacity={0.85}
      disabled={!isCurrentUser}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {owner && <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{isCurrentUser ? 'You' : owner.fullname}</Text>}
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
        <View style={{ marginTop: 5 }}>
          <Text
            style={{ fontSize: 11, color: '#5b5b5b' }}
            numberOfLines={textShown ? undefined : 3}
            onTextLayout={onTextLayout}
          >
            {review}
          </Text>
          {
            lengthMore ?
              <Text
                onPress={toggleNumberOfLines}
                style={{ color: '#A9A9A9', textDecorationLine: 'underline', textDecorationColor: '#f3f6f4', fontSize: 11 }}
              >
                {textShown ? 'See less' : 'See more'}
              </Text> :
              null
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: 10,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 10
  }
});

export default RatingCard;

