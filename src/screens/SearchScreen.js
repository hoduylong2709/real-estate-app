import React, { useState, useEffect, useRef, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Button } from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome, Entypo, AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import ListingCard from '../components/ListingCard';
import realEstateApi from '../api/realEstate';
import * as constants from '../constants';
import * as filterData from '../filterData';
import { Context as CategoryContext } from '../context/CategoryContext';
import { getCategoryFilters } from '../utils/categoryHelper';
const { height } = Dimensions.get('screen');

const SearchScreen = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState('');
  const [clicked, setClicked] = useState(false);
  const [startSearching, setStarSearching] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [listings, setListings] = useState([]);
  const [filterListings, setFilterListings] = useState([]);
  const [noListing, setNoListing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [star, setStar] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [isNewConstruction, setIsNewConstruction] = useState('');
  const [isClosePublicTransportation, setIsClosePublicTransportation] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [filters, setFilters] = useState([]);
  const { state: { categories } } = useContext(CategoryContext);
  const refRBSheet = useRef();
  const LISTING_LIMIT = 2;
  const [queryString, setQueryString] = useState('');

  const API_ENDPOINT = `/listings?limit=${LISTING_LIMIT}&skip=${skip}`;

  const checkFavorite = listing => {
    return listing.favoriteUsers.includes(userObj?._id);
  };

  const searchFilter = text => {
    if (text) {
      const filters = listings.filter(listing => {
        const listingData = listing.title.toUpperCase();
        const textData = text.toUpperCase();
        return listingData.indexOf(textData) > -1;
      });
      setFilterListings(filters);
      setSearchValue(text);
    } else {
      setFilterListings(listings);
      setSearchValue(text);
    }
  };

  const handleDateConfirm = date => {
    setDate(moment(date).format('MM/YYYY'));
    setDatePickerVisibility(false);
  };

  const clearAllFilters = () => {
    setType('');
    setStar('');
    setCategory('');
    setFilters([]);
    setSquareFeet('');
    setBedrooms('');
    setBathrooms('');
    setIsNewConstruction('');
    setDate('');
    setIsClosePublicTransportation('');
  };

  const handleCloseBottomSheet = () => {
    let queryStr = '';

    if (type) {
      queryStr = queryStr + `&rentOrBuy=${type}`;
    }

    if (category) {
      queryStr = queryStr + `&categoryName=${category}`;
    }

    if (bedrooms) {
      queryStr = queryStr + `&bedrooms=${bedrooms}`;
    }

    if (isNewConstruction) {
      const queryEle = isNewConstruction === 'Yes' ? '&newConstruction=true' : '&newConstruction=false';;
      queryStr = queryStr + queryEle;
    }

    if (date) {
      queryStr = queryStr + `&yearBuilt=${date}`;
    }

    if (isClosePublicTransportation) {
      const queryEle = isClosePublicTransportation === 'Yes' ? '&closeToPublicTransportation=true' : '&closeToPublicTransportation=false';
      queryStr = queryStr + queryEle;
    }

    if (bathrooms) {
      queryStr = queryStr + `&baths=${bathrooms}`;
    }

    if (squareFeet) {
      queryStr = queryStr + `&squareFeet=${squareFeet}`;
    }

    setNoListing(false);
    setListings([]);
    setFilterListings([]);
    setQueryString(queryStr);
    setSkip(0);
  };

  useEffect(() => {
    (async () => {
      let response = null;
      if (queryString) {
        response = await realEstateApi.get(API_ENDPOINT + queryString);
      } else {
        response = await realEstateApi.get(API_ENDPOINT);
      }
      if (response.data.length !== 0) {
        setListings(prev => [...prev, ...response.data]);
        setFilterListings(prev => [...prev, ...response.data]);
      } else {
        setNoListing(true);
      }
    })();
  }, [skip, queryString]);

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
          placeholder='Enter listing name...'
          value={searchValue}
          onChangeText={text => searchFilter(text)}
          onFocus={() => {
            setClicked(true);
            setStarSearching(true);
          }}
        />
        {/* Cross icon */}
        {clicked && <Entypo style={{ marginLeft: 5 }} name='cross' size={20} color='#C5C5C5' onPress={() => searchFilter('')} />}
      </View>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          style={styles.filters}
          invertStickyHeaders={true}
        >
          {type ? (
            <View
              style={styles.filterResultContainer}
            >
              <Text style={styles.filterResultText}>{type}</Text>
            </View>
          ) : null}
          {star ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{star}</Text>
              <AntDesign name='staro' size={15} color={constants.MAIN_COLOR} style={{ marginLeft: 3 }} />
            </View>
          ) : null}
          {category ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{category}</Text>
            </View>
          ) : null}
          {squareFeet ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{squareFeet}</Text>
            </View>
          ) : null}
          {bedrooms ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{bedrooms}</Text>
              <Ionicons name='bed' size={15} color={constants.MAIN_COLOR} style={{ marginLeft: 3 }} />
            </View>
          ) : null}
          {bathrooms ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{bathrooms}</Text>
              <FontAwesome5 name='bath' size={16} color={constants.MAIN_COLOR} style={{ marginLeft: 3 }} />
            </View>
          ) : null}
          {isNewConstruction ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>New construction - {isNewConstruction}</Text>
            </View>
          ) : null}
          {date ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>{date}</Text>
            </View>
          ) : null}
          {isClosePublicTransportation ? (
            <View style={{ ...styles.filterResultContainer, marginLeft: 5 }}>
              <Text style={styles.filterResultText}>Close public trans - {isClosePublicTransportation}</Text>
            </View>
          ) : null}
        </ScrollView>
        <Button
          title='Filters'
          onPress={() => refRBSheet.current.open()}
          buttonStyle={{ borderRadius: 10, backgroundColor: constants.MAIN_COLOR, padding: 5 }}
          containerStyle={{ width: '23%' }}
        />
      </View>
      <View style={styles.resultHeader}>
        <Text style={{ fontSize: 18.5, fontWeight: 'bold' }}>{filterListings.length.toString()} results found</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', width: '31%', justifyContent: 'space-between' }}
          onPress={() => navigation.navigate('MapListing', { listings })}
          disabled={listings.length === 0}
        >
          <FontAwesome5 name='map-marked-alt' size={23} color={constants.MAIN_COLOR} />
          <Text style={{ fontWeight: 'bold', color: constants.MAIN_COLOR, fontSize: 14.5 }}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.results}>
        <FlatList
          data={filterListings}
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
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (!noListing) {
              setSkip(skip + LISTING_LIMIT);
            }
          }}
        />
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={handleCloseBottomSheet}
        dragFromTopOnly
        customStyles={{
          draggableIcon: {
            backgroundColor: constants.MAIN_COLOR
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingHorizontal: 20
          }
        }}
        height={height * 0.7}
      >
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Type */}
          <View style={styles.optionContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Type</Text>
            <View style={{ flexDirection: 'row', width: '90%', marginTop: 10 }}>
              {filterData.RENT_OR_BUY_DATA.map(option => (
                <Button
                  key={option.key}
                  title={option.label}
                  containerStyle={styles.buttonOption}
                  buttonStyle={type === option.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                  titleStyle={type === option.label ? styles.title_focused : styles.title_not_focused}
                  onPress={() => {
                    if (type === option.label) {
                      setType('');
                    } else {
                      setType(option.label);
                    }
                  }}
                />
              ))}
            </View>
          </View>
          {/* Categories */}
          <View style={{ ...styles.optionContainer, marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Categories</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <Button
                  title={item.name}
                  containerStyle={styles.buttonOption}
                  buttonStyle={category === item.name ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                  titleStyle={category === item.name ? styles.title_focused : styles.title_not_focused}
                  onPress={() => {
                    if (category === 'Houses' || category === 'Buildings' || category === 'Townhouses') {
                      setBedrooms('');
                      setIsNewConstruction('');
                      setDate('');
                      setIsClosePublicTransportation('');
                    }

                    if (category === 'Apartments' || category === 'Condos') {
                      setBedrooms('');
                      setBathrooms('');
                      setIsClosePublicTransportation('');
                    }

                    if (category === 'Land') {
                      setSquareFeet('');
                      setIsClosePublicTransportation('');
                    }

                    if (category === item.name) {
                      setCategory('');
                      setFilters([]);
                    } else {
                      setCategory(item.name);
                      setFilters(getCategoryFilters(item));
                    }
                  }}
                />
              )}
              horizontal
              contentContainerStyle={{ marginTop: 10 }}
            />
          </View>
          {/* Filters depend on category */}
          {filters.length !== 0 && (
            <View style={styles.specificOption}>
              {
                filters.includes('hasSquareFeet') &&
                <View style={styles.optionContainer}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Square feet</Text>
                  <FlatList
                    data={filterData.SQUARE_FEET_DATA}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                      <Button
                        title={item.label}
                        containerStyle={{ ...styles.buttonOption, width: 140 }}
                        buttonStyle={squareFeet === item.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                        titleStyle={squareFeet === item.label ? styles.title_focused : styles.title_not_focused}
                        onPress={() => {
                          if (squareFeet === item.label) {
                            setSquareFeet('');
                          } else {
                            setSquareFeet(item.label);
                          }
                        }}
                      />
                    )}
                    horizontal
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              }
              {
                filters.includes('hasBedrooms') &&
                <View style={styles.optionContainer}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Bedrooms</Text>
                  <FlatList
                    data={filterData.BEDROOMS_DATA}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                      <Button
                        title={item.label}
                        icon={<Ionicons name='bed' size={16} color={bedrooms === item.label ? 'white' : '#808080'} style={{ marginLeft: 5 }} />}
                        iconRight
                        containerStyle={styles.buttonOption}
                        buttonStyle={bedrooms === item.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                        titleStyle={bedrooms === item.label ? styles.title_focused : styles.title_not_focused}
                        onPress={() => {
                          if (bedrooms === item.label) {
                            setBedrooms('');
                          } else {
                            setBedrooms(item.label);
                          }
                        }}
                      />
                    )}
                    horizontal
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              }
              {
                filters.includes('hasBaths') &&
                <View style={{ ...styles.optionContainer, marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Bathrooms</Text>
                  <FlatList
                    data={filterData.BATHROOMS_DATA}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                      <Button
                        title={item.label}
                        icon={<FontAwesome5 name='bath' size={16} color={bathrooms === item.label ? 'white' : '#808080'} style={{ marginLeft: 5 }} />}
                        iconRight
                        containerStyle={styles.buttonOption}
                        buttonStyle={bathrooms === item.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                        titleStyle={bathrooms === item.label ? styles.title_focused : styles.title_not_focused}
                        onPress={() => {
                          if (bathrooms === item.label) {
                            setBathrooms('');
                          } else {
                            setBathrooms(item.label);
                          }
                        }}
                      />
                    )}
                    horizontal
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              }
              {
                filters.includes('hasNewConstruction') &&
                <View style={{ ...styles.optionContainer, marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>New construction</Text>
                  <FlatList
                    data={filterData.NEW_CONSTRUCTION_DATA}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                      <Button
                        title={item.label}
                        containerStyle={styles.buttonOption}
                        buttonStyle={isNewConstruction === item.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                        titleStyle={isNewConstruction === item.label ? styles.title_focused : styles.title_not_focused}
                        onPress={() => {
                          if (isNewConstruction === item.label) {
                            setIsNewConstruction('');
                          } else {
                            setIsNewConstruction(item.label);
                          }
                        }}
                      />
                    )}
                    horizontal
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              }
              {
                filters.includes('hasYearBuilt') &&
                <View style={{ ...styles.optionContainer, marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Time built</Text>
                  <TouchableOpacity
                    style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <FontAwesome name='calendar' size={24} color={constants.MAIN_COLOR} />
                    <Text style={{ color: '#808080', fontWeight: 'bold', fontSize: 13.5, marginLeft: 7 }}>{date || 'Select time built...'}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode='date'
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                    style={{ backgroundColor: constants.MAIN_COLOR }}
                    maximumDate={new Date()}
                  />
                </View>
              }
              {
                filters.includes('hasCloseToPublicTransportation') &&
                <View style={{ ...styles.optionContainer, marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Close public transportation</Text>
                  <FlatList
                    data={filterData.CLOSE_TO_PUBLIC_PLACES_DATA}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                      <Button
                        title={item.label}
                        containerStyle={styles.buttonOption}
                        buttonStyle={isClosePublicTransportation === item.label ? { ...styles.button, backgroundColor: constants.MAIN_COLOR, borderColor: 'white' } : styles.button}
                        titleStyle={isClosePublicTransportation === item.label ? styles.title_focused : styles.title_not_focused}
                        onPress={() => {
                          if (isClosePublicTransportation === item.label) {
                            setIsClosePublicTransportation('');
                          } else {
                            setIsClosePublicTransportation(item.label);
                          }
                        }}
                      />
                    )}
                    horizontal
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              }
            </View>
          )}
          <Button
            title='Clear all'
            containerStyle={{ marginTop: 25, marginBottom: 5, borderRadius: 15 }}
            buttonStyle={{ backgroundColor: '#f46b61' }}
            onPress={clearAllFilters}
          />
        </ScrollView>
      </RBSheet>
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
    marginRight: 3
  },
  filterResultContainer: {
    maxWidth: 150,
    borderColor: constants.MAIN_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7
  },
  filterResultText: {
    color: constants.MAIN_COLOR,
    fontSize: 12
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
  },
  optionContainer: {
    flexDirection: 'column'
  },
  buttonOption: {
    width: 90,
    borderRadius: 10,
    marginRight: 7
  },
  button: {
    padding: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#C5C5C5'
  },
  title_not_focused: {
    fontSize: 13.5,
    color: '#808080'
  },
  title_focused: {
    fontSize: 13.5,
    color: 'white'
  },
  specificOption: {
    marginTop: 20,
    flexDirection: 'column'
  }
});

export default SearchScreen;

