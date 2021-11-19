import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import PropertyList from '../components/PropertyList';

const ListingDetailScreen = ({ navigation }) => {
  const { photos, isFavorite, pressIcon, title, stars, numberOfRatings, location, properties } = navigation.getParam('listingProperties');
  const [favoriteListing, setFavoriteListing] = useState(isFavorite);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* House image */}
        <View style={styles.backgroundImageContainer}>
          <ImageBackground style={styles.backgroudImage} source={{ uri: photos[0].imageUrl }} >
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
                  pressIcon();
                  setFavoriteListing(!favoriteListing);
                }}
              >
                <View style={styles.headerBtn}>
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
                </View>
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
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{stars.toString()}.0</Text>
              </View>
              <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: 'bold' }}>{numberOfRatings.toString()} ratings</Text>
            </View>
          </View>
          {/* Location text */}
          <Text style={{ fontSize: 15, color: '#A9A9A9', marginTop: 10 }}>
            {location}
          </Text>
          {/* Properties Container */}
          <PropertyList
            properties={properties}
          />
        </View>
      </ScrollView>
    </View>
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
    marginTop: 20,
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
    alignItems: 'center'
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
});

export default ListingDetailScreen;

