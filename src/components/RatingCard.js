import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AirbnbRating } from 'react-native-ratings';
import { MaterialIcons } from '@expo/vector-icons';
import { Context as RatingContext } from '../context/RatingContext';
import moment from 'moment';

const RatingCard = ({ rating, isCurrentUser, listingId, navigation }) => {
  const { stars, review, createdAt, owner } = rating;
  const [textShown, setTextShown] = useState(false); // To show the remaining text
  const [lengthMore, setLengthMore] = useState(false); // To show 'see more' or 'see less'
  const { deleteRating } = useContext(RatingContext);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = e => {
    setLengthMore(e.nativeEvent.lines.length > 3);
  };

  return (
    <View
      style={styles.ratingContainer}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row' }}>
              {owner &&
                (owner.avatar ?
                  <Avatar size='small' source={{ uri: owner.avatar }} rounded /> :
                  <Avatar size='small' source={require('../../assets/user.png')} rounded />
                )
              }
              <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                {owner && <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{isCurrentUser ? 'You' : owner.fullname}</Text>}
                <Text style={{ fontSize: 10, color: '#5b5b5b', fontWeight: 'bold' }}>{moment(createdAt).fromNow()}</Text>
              </View>
            </View>
            <AirbnbRating
              count={5}
              defaultRating={stars}
              showRating={false}
              size={10}
              isDisabled={true}
            />
          </View>
          {
            isCurrentUser &&
            <View style={styles.icons}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Rating', { isUpdate: true, rating, listingId })}
              >
                <MaterialIcons name='edit' size={15} color='white' />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.7}
                onPress={() => deleteRating(rating._id, listingId)}
              >
                <MaterialIcons name='delete' size={15} color='white' />
              </TouchableOpacity>
            </View>
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
    </View>
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
  },
  icons: {
    flexDirection: 'row',
    width: 55,
    justifyContent: 'space-between'
  },
  icon: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#eeeeee',
    backgroundColor: '#68b69d',
    padding: 5
  }
});

export default RatingCard;

