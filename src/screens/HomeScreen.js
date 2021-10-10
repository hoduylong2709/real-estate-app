import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import Spacer from './../components/Spacer';
import CategoryCard from '../components/CategoryCard';

const HomeScreen = () => {
  const categories = ['Houses', 'Apartments', 'Condos', 'Land', 'Buildings', 'Town Houses', 'Recently Sold'];

  return (
    <View style={styles.container}>
      <Spacer>
        <Text h4>Categories</Text>
      </Spacer>
      <View style={{ marginLeft: 15, marginRight: 15 }}>
        <ScrollView
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(category => (
            <CategoryCard
              key={category}
              imageUri={require('../../assets/category-houses.png')}
              categoryName={category}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: () => (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={{ marginLeft: 15 }}>
          <Avatar rounded source={require('../../assets/user.png')} />
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={styles.headerRight}>
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <MaterialIcons name="post-add" size={26} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <MaterialIcons name="map" size={26} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    marginRight: 15
  }
});

export default HomeScreen;

