import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableOpacity, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Button } from 'react-native-elements';
import { FontAwesome, Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import ListingCard from '../components/ListingCard';
import realEstateApi from '../api/realEstate';
import * as constants from '../constants';

const SearchScreen = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState('');
  const [clicked, setClicked] = useState(false);
  const [startSearching, setStarSearching] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [listings, setListings] = useState([]);
  const [noMessage, setNoMessage] = useState(false);
  const [skip, setSkip] = useState(0);
  const LISTING_LIMIT = 10;

  const checkFavorite = listing => {
    return listing.favoriteUsers.includes(userObj?._id);
  };

  useEffect(() => {
    (async () => {
      const response = await realEstateApi.get(`/listings?limit=${LISTING_LIMIT}&skip=${skip}`);
      if (response.data.length !== 0) {
        setListings(prev => [...prev, ...response.data]);
      } else {
        setNoMessage(true);
      }
    })();
  }, [skip]);

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {
        (async () => {
          const userJson = await AsyncStorage.getItem('userInfo');
          const userObj = JSON.parse(userJson);
          setUserObj(userObj);
        })();
      }} />
      <View style={styles.searchBar}>
        {/* Search icon or arrow left icon */}
        {
          !startSearching ?
            <FontAwesome name='search' size={24} color='#C5C5C5' /> :
            <AntDesign name="arrowleft" size={24} color='#C5C5C5' onPress={() => {
              setStarSearching(false);
              Keyboard.dismiss();
              setClicked(false);
            }} />
        }
        {/* Input field */}
        <TextInput
          style={{ fontSize: 15, width: '80%', marginLeft: 15 }}
          placeholder='Search listing...'
          value={searchValue}
          onChangeText={setSearchValue}
          onFocus={() => {
            setClicked(true);
            setStarSearching(true);
          }}
        />
        {/* Cross icon */}
        {clicked && <Entypo style={{ marginLeft: 5 }} name='cross' size={20} color='#C5C5C5' onPress={() => setSearchValue('')} />}
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.filters}></View>
        <Button
          title='Filters'
          onPress={() => console.log('Clicked filter button...')}
          buttonStyle={{ borderRadius: 10, backgroundColor: constants.MAIN_COLOR, padding: 5 }}
          containerStyle={{ width: '23%' }}
        />
      </View>
      <View style={styles.resultHeader}>
        <Text style={{ fontSize: 18.5, fontWeight: 'bold' }}>{listings.length.toString()} results found</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', width: '31%', justifyContent: 'space-between' }}
          onPress={() => navigation.navigate('MapListing', { listings })}
        >
          <FontAwesome5 name='map-marked-alt' size={23} color={constants.MAIN_COLOR} />
          <Text style={{ fontWeight: 'bold', color: constants.MAIN_COLOR, fontSize: 14.5 }}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.results}>
        <FlatList
          data={listings}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ListingCard
              key={item._id}
              listingId={item._id}
              title={item.title}
              price={item.price.value}
              currency={item.price.currency}
              location={item.location}
              photos={item.photos}
              navigation={navigation}
              properties={item.category}
              description={item.description}
              owner={item.owner}
              ratings={item.ratings}
              isFavoriteByUser={checkFavorite(item)}
              userId={userObj?._id}
            />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!noMessage) {
              setSkip(skip + LISTING_LIMIT);
            }
          }}
        />
      </View>
    </View>
  );
};

SearchScreen.navigationOptions = () => {
  return {
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  searchBar: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#C5C5C5',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 4,
    padding: 10
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
    justifyContent: 'space-between'
  },
  filters: {
    width: '75%',
    borderWidth: 1
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20
  },
  results: {
    flex: 1,
    marginTop: 17
  }
});

export default SearchScreen;

