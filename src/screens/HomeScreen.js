import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import { Context as CategoryContext } from '../context/CategoryContext';
import Spacer from './../components/Spacer';
import CategoryCard from '../components/CategoryCard';

const HomeScreen = () => {
  const { fetchCategories, state: categories } = useContext(CategoryContext);

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchCategories} />
      <Spacer>
        <Text h4>Categories</Text>
      </Spacer>
      <View style={{ marginLeft: 15, marginRight: 15 }}>
        <ScrollView
          scrollEventThrottle={16}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {categories && categories.map(category => (
            <TouchableOpacity
              activeOpacity={0.5}
              key={category._id}
            >
              <CategoryCard
                imageUri={category.image}
                categoryName={category.name}
              />
            </TouchableOpacity>
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
      >
        <View style={{ marginLeft: 15 }}>
          <Image
            source={require('../../assets/welcome-logo.png')}
            style={{ width: 35, height: 35 }}
          />
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={styles.headerRight}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('AddListing')}
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

