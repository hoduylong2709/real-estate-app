import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Avatar } from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as constants from '../constants';
import ProfileListingCard from '../components/ProfileListingCard';
import realEstateApi from '../api/realEstate';
const { width } = Dimensions.get('screen');

const OtherProfileScreen = ({ navigation }) => {
  const user = navigation.getParam('user');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [numberOfListings, setNumberOfListings] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabSelecting = async index => {
    let apiEndpoint = '';
    setLoading(true);

    if (index == 0) {
      apiEndpoint = `/listings/${user._id}`;
    }
    if (index === 1) {
      apiEndpoint = `/listings/favorite/${user._id}`;
    }
    if (index === 2) {
      // apiEndPoint for get sold listings
    }

    const response = await realEstateApi.get(apiEndpoint);
    setLoading(false);
    setList(response.data);
  };

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          (async () => {
            setLoading(true);
            const response = await realEstateApi.get(`/listings/${user._id}`);
            setNumberOfListings(response.data.length);
            setLoading(false);
            setList(response.data);
          })();
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', width: 300, justifyContent: 'space-evenly' }}>
        <View style={{ position: 'relative' }}>
          <Avatar
            rounded
            size={80}
            source={user.avatar ? { uri: user.avatar } : require('../../assets/user.png')}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={{ fontSize: 28, color: '#52575D', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</Text>
          <Text style={{ fontSize: 13, color: '#AEB5BC', fontWeight: 'bold' }}>{user.email}</Text>
          <Text style={{ fontSize: 13, color: '#AEB5BC', fontWeight: 'bold' }}>{user.phoneNumber?.toString() || ''}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.number}>{numberOfListings.toString()}</Text>
          <Text style={styles.subText}>Listings</Text>
        </View>
        <View style={{ height: '70%', width: 3, backgroundColor: '#DFD8C8' }}></View>
        <View style={styles.statsBox}>
          <Text style={styles.number}>{user.favoriteListings.length.toString()}</Text>
          <Text style={styles.subText}>Favorites</Text>
        </View>
        <View style={{ height: '70%', width: 3, backgroundColor: '#DFD8C8' }}></View>
        <View style={styles.statsBox}>
          <Text style={styles.number}>3</Text>
          <Text style={styles.subText}>Sold</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <SegmentedControlTab
          values={['Listings', 'Favorites', 'Sold']}
          selectedIndex={selectedIndex}
          onTabPress={index => {
            setSelectedIndex(index);
            handleTabSelecting(index);
          }}
          tabsContainerStyle={{ width: width - 20, height: 39 }}
          tabTextStyle={{ fontSize: 12, fontWeight: 'bold', color: constants.MAIN_COLOR }}
          activeTabStyle={{ backgroundColor: constants.MAIN_COLOR }}
          tabStyle={{ borderColor: constants.MAIN_COLOR }}
          borderRadius={10}
        />
        {loading ?
          <ActivityIndicator size={27} color='gray' style={{ marginTop: 15 }} /> :
          <FlatList
            data={list}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <ProfileListingCard listing={item} horizontal={false} />}
            contentContainerStyle={{ marginTop: 15 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={{ fontSize: 14, color: '#AEB5BC' }}>No listings found.</Text>}
          />}
      </View>
    </View>
  );
};

OtherProfileScreen.navigationOptions = () => {
  return {
    title: null,
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    width: 250,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statsBox: {
    alignItems: 'center'
  },
  number: {
    fontSize: 25,
    color: '#52575D'
  },
  subText: {
    fontSize: 9,
    color: '#AEB5BC',
    textTransform: 'uppercase'
  },
  listContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20
  }
});

export default OtherProfileScreen;

