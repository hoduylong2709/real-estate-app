import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import * as constants from '../constants';
import { Context as CategoryContext } from '../context/CategoryContext';
import { getCategoryByName, getCategoryFilters } from '../utils/categoryHelper';
import FiltersForm from '../components/FiltersForm';

const ListingFiltersScreen = ({ navigation }) => {
  const { state: { categories } } = useContext(CategoryContext);
  const categoryName = navigation.getParam('categoryName');
  const category = getCategoryByName(categoryName, categories);
  const filters = getCategoryFilters(category);
  const title = navigation.getParam('title');
  const description = navigation.getParam('description');
  const price = navigation.getParam('price');
  const location = navigation.getParam('location');
  const currency = navigation.getParam('currency');
  const listing = navigation.getParam('listing');
  const isEdit = navigation.getParam('isEdit');
  const updatedObj = navigation.getParam('updatedObj');

  return (
    <View style={styles.container}>
      <FiltersForm
        filters={filters}
        title={title}
        description={description}
        priceValue={price}
        location={location}
        categoryName={categoryName}
        currency={currency}
        listing={listing}
        isEdit={isEdit}
        updatedObj={updatedObj}
      />
    </View>
  );
};

ListingFiltersScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'Listing Details'
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default ListingFiltersScreen;

