import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity, Text, FlatList, Dimensions, Image, ToastAndroid } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Avatar } from 'react-native-elements';
import MapView, { Marker, Callout } from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import * as constants from '../constants';
import PropertyList from '../components/PropertyList';
import { Context as UserContext } from '../context/UserContext';
import { Context as RatingContext } from '../context/RatingContext';
import { countAverageStars } from '../utils/countAverageStars';
import RatingCard from '../components/RatingCard';
const { width } = Dimensions.get('screen');

const ListingDetailScreen = ({ navigation }) => {
  const { listingId, owner, photos, isFavorite, pressFavoriteIcon, title, location, properties, description, price, currency, userId } = navigation.getParam('listingProperties');
  const [favoriteListing, setFavoriteListing] = useState(isFavorite);
  const [textShown, setTextShown] = useState(false); // To show the remaining text
  const [lengthMore, setLengthMore] = useState(false); // To show "see more" or "see less"
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0].imageUrl);
  const { state: { user }, getUserById } = useContext(UserContext);
  const { state: { ratings }, fetchRatings } = useContext(RatingContext);
  const refRBSheet = useRef();
  const averageStars = countAverageStars(ratings.map(rating => rating.stars));

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = e => {
    setLengthMore(e.nativeEvent.lines.length > 2);
  };

  const showToast = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Sorry, you can only rate one time!', ToastAndroid.SHORT);
    } else {
      console.log('Sorry, you can only rate one time!');
    }
  };

  const checkExistenceOfYourRating = ratings => {
    let isExist = false;

    ratings.forEach(rating => {
      if (rating.owner._id === userId) {
        isExist = true;
      }
    });

    return isExist;
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {
        getUserById(owner);
        fetchRatings(listingId);
      }} />
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* House image */}
        <View style={styles.backgroundImageContainer}>
          <ImageBackground style={styles.backgroudImage} source={{ uri: selectedPhoto }} >
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}
              >
                <View style={styles.headerBtn}>
                  <MaterialIcons
                    name='arrow-back-ios'
                    size={20}
                    color={constants.MAIN_COLOR}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  pressFavoriteIcon();
                  setFavoriteListing(!favoriteListing);
                }}
              >
                {userId !== owner && <View style={styles.headerBtn}>
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
                </View>}
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {/* Virtual Tag View */}
          <TouchableOpacity
            style={styles.virtualTag}
            activeOpacity={0.8}
            onPress={() => console.log('click')}
          >
            <Text style={{ color: 'white' }}>Virtual tour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailContainer}>
          {/* Name and rating view container */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.ratingTag}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{averageStars.toString()}.0</Text>
              </View>
              <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: 'bold' }}>{ratings.length.toString()} ratings</Text>
            </View>
          </View>
          {/* Location text */}
          <Text style={{ fontSize: 15, color: '#A9A9A9', marginTop: 10 }}>
            {location.address}
          </Text>
          {/* Properties Container */}
          <PropertyList
            properties={properties}
          />
          <View style={{ marginTop: 10 }}>
            <Text
              style={{ color: '#A9A9A9' }}
              numberOfLines={textShown ? undefined : 2}
              onTextLayout={onTextLayout}
            >
              {description}
            </Text>
            {
              lengthMore ?
                <Text
                  onPress={toggleNumberOfLines}
                  style={{ color: '#A9A9A9', textDecorationLine: 'underline', textDecorationColor: '#f3f6f4' }}
                >{textShown ? 'See less' : 'See more'}</Text> :
                null
            }
          </View>
          {/* Listing photos */}
          <FlatList
            contentContainerStyle={{ marginTop: 15 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            data={photos}
            renderItem={({ item }) =>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPhoto(item.imageUrl)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.listingImage}
                />
              </TouchableOpacity>
            }
          />
          {/* Price & contact container */}
          <View style={styles.priceAndContactContainer}>
            <View>
              <Text
                style={{ color: constants.MAIN_COLOR, fontWeight: 'bold', fontSize: 18 }}
              >
                {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{currency === 'VNĐ' ? 'VNĐ' : '$'}
              </Text>
              <Text
                style={{ fontSize: 14, color: constants.GREY_COLOR, fontWeight: 'bold' }}
              >
                Total Price
              </Text>
            </View>
            <TouchableOpacity
              style={styles.contactOwnerButton}
              activeOpacity={0.85}
              onPress={() => refRBSheet.current.open()}
              disabled={userId === owner}
            >
              <Text
                style={{ color: 'white' }}
              >
                Contact Owner
              </Text>
            </TouchableOpacity>
          </View>
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude
                }}
                draggable={false}
              >
                <Callout>
                  <Text>Listing location!</Text>
                </Callout>
              </Marker>
            </MapView>
          </View>
          {/* Rating and review Container */}
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Ratings and reviews</Text>
              <TouchableOpacity
                style={styles.reviewAdding}
                activeOpacity={0.7}
                onPress={() => {
                  if (ratings) {
                    if (checkExistenceOfYourRating(ratings)) {
                      showToast();
                    } else {
                      navigation.navigate('Rating', { listingId, isUpdate: false });
                    }
                  } else {
                    navigation.navigate('Rating', { listingId, isUpdate: false });
                  }
                }}
              >
                <AntDesign name='plus' size={14} color={constants.MAIN_COLOR} />
                <Text style={{ fontSize: 12 }}>Rating & review</Text>
              </TouchableOpacity>
            </View>
            {ratings &&
              ratings.map(
                rating => <RatingCard
                  key={rating._id}
                  rating={rating}
                  isCurrentUser={userId === rating.owner._id}
                  listingId={listingId}
                  navigation={navigation}
                />
              )
            }

          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent'
          },
          draggableIcon: {
            backgroundColor: constants.MAIN_COLOR
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingHorizontal: 20
          }
        }}
        height={80}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              user ?
                <Avatar
                  rounded
                  size={50}
                  source={{ uri: user.avatar }}
                /> :
                <Avatar
                  rounded
                  size={50}
                  source={require('../../assets/user.png')}
                />
            }
            <View style={{ paddingHorizontal: 10 }}>
              {
                user &&
                <Text
                  style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}
                >
                  {user.firstName} {user.lastName}
                </Text>
              }
              <Text style={{ fontSize: 11, color: constants.GREY_COLOR, fontWeight: 'bold' }}>Owner</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[styles.contactButton, { marginRight: 15 }]}
            >
              <AntDesign name='message1' size={24} color='#bcbcbc' />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.contactButton}
            >
              <Ionicons name='call' size={24} color='#bcbcbc' />
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View >
  );
};

ListingDetailScreen.navigationOptions = () => {
  return {
    headerStyle: {
      elevation: 0
    },
    headerShown: false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
    height: 350
  },
  backgroudImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  headerBtn: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  virtualTag: {
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40
  },
  ratingTag: {
    height: 30,
    width: 35,
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listingImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10
  },
  priceAndContactContainer: {
    height: 70,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  contactOwnerButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  mapContainer: {
    height: 260,
    backgroundColor: '#f3f6f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  map: {
    height: 250,
    width: '97%'
  },
  contactButton: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewAdding: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'center',
    padding: 3,
    borderColor: constants.MAIN_COLOR,
    alignSelf: 'flex-start'
  }
});

export default ListingDetailScreen;

