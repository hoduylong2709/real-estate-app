import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { AirbnbRating } from 'react-native-ratings';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import { Context as RatingContext } from '../context/RatingContext';
const { width } = Dimensions.get('screen');

const RatingScreen = ({ navigation }) => {
  const { state: { loading }, postRating, updateRating } = useContext(RatingContext);
  const listingId = navigation.getParam('listingId');
  const isUpdate = navigation.getParam('isUpdate');
  const rating = navigation.getParam('rating');
  const [stars, setStars] = useState(isUpdate && rating && rating.stars || 3);
  const [review, setReview] = useState(isUpdate && rating && rating.review || '');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name='arrow-back-ios' size={25} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
      </View>
      <View style={styles.ratingContainer}>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Bad', 'Good', 'Very Good', 'Excellent']}
          defaultRating={stars}
          size={24}
          reviewColor='#5b5b5b'
          starContainerStyle={{ marginTop: 5, justifyContent: 'space-between', width: 200, marginBottom: 30 }}
          onFinishRating={setStars}
        />
        <Text>Tap the stars to rate</Text>
        <TextInput
          style={styles.review}
          placeholder='Type your review here...'
          multiline={true}
          textAlignVertical={'top'}
          value={review}
          onChangeText={setReview}
        />
        <Button
          title='Submit'
          containerStyle={styles.button}
          buttonStyle={{ backgroundColor: constants.MAIN_COLOR }}
          onPress={() => {
            isUpdate ?
              updateRating(rating._id, stars, review) :
              postRating(stars, review, listingId)
          }}
        />
      </View>
      <Spinner
        visible={loading}
      />
    </View>
  );
};

RatingScreen.navigationOptions = () => {
  return {
    headerStyle: {
      elevation: 0
    },
    headerShown: false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    alignItems: 'flex-start',
    height: 30
  },
  ratingContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  review: {
    height: 150,
    borderWidth: 2,
    width: width - 100,
    marginTop: 30,
    borderColor: '#bcbcbc',
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#ededed'
  },
  button: {
    marginTop: 30,
    width: width - 200,
    borderRadius: 20
  }
});


export default RatingScreen;

