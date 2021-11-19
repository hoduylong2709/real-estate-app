import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import NumericInput from 'react-native-numeric-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import * as constants from '../constants';
import * as filterData from '../filterData';
import { Context as ListingContext } from '../context/ListingContext';
import ErrorModal from './ErrorModal';

const FiltersForm = ({ filters, title, description, priceValue, location, categoryName, currency }) => {
  const [rentOrBuy, setRentOrBuy] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [baths, setBaths] = useState(0);
  const [isNewConstruction, setNewConstruction] = useState('');
  const [isCloseToPublicTransportation, setCloseToPublicTransportation] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const { createListing, clearErrorMessage, state: { loading, errorMessage, photos } } = useContext(ListingContext);

  const handleDateConfirm = date => {
    setDate(moment(date).format('MM/YYYY'));
    setDatePickerVisibility(false);
  }

  const handleSubmit = () => {
    const price = { value: priceValue, currency };
    const category = {
      categoryName
    };

    if (rentOrBuy) {
      category['rentOrBuy'] = rentOrBuy;
    }
    if (squareFeet) {
      category['squareFeet'] = squareFeet;
    }
    if (bedrooms) {
      category['bedrooms'] = bedrooms;
    }
    if (baths) {
      category['baths'] = baths;
    }
    if (isNewConstruction) {
      isNewConstruction === 'Yes' ? category['newConstruction'] = true : category['newConstruction'] = false;
    }
    if (date) {
      category['yearBuilt'] = date;
    }
    if (isCloseToPublicTransportation) {
      isCloseToPublicTransportation === 'Yes' ? category['closeToPublicTransportation'] = true : category['closeToPublicTransportation'] = false;
    }

    const listingInfo = {
      title,
      description,
      price,
      category,
      location,
      photos
    };

    createListing(listingInfo);
  };

  return (
    <View style={{ flex: 1, marginTop: 5 }}>
      <Spinner
        visible={loading}
      />
      <View>
        {
          filters.includes('hasRentOrBuy') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>For rent or buy</Text>
              <ModalSelector
                data={filterData.RENT_OR_BUY_DATA}
                selectStyle={{ padding: 3, borderWidth: 0 }}
                onChange={option => setRentOrBuy(option.label)}
              >
                <TextInput
                  editable={false}
                  placeholder='Select option...'
                  style={styles.option}
                  value={rentOrBuy}
                />
              </ModalSelector>
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasSquareFeet') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>Square feet</Text>
              <ModalSelector
                data={filterData.SQUARE_FEET_DATA}
                selectStyle={{ padding: 3, borderWidth: 0 }}
                onChange={option => setSquareFeet(option.label)}
              >
                <TextInput
                  editable={false}
                  placeholder='Select option...'
                  style={styles.option}
                  value={squareFeet}
                />
              </ModalSelector>
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasBedrooms') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>Bedrooms</Text>
              <NumericInput
                value={bedrooms}
                onChange={setBedrooms}
                rounded
                valueType='integer'
                totalHeight={35}
                totalWidth={100}
                leftButtonBackgroundColor={constants.MAIN_COLOR}
                rightButtonBackgroundColor={constants.MAIN_COLOR}
                iconStyle={{ color: 'white' }}
                minValue={0}
              />
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasBaths') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>Baths</Text>
              <NumericInput
                value={baths}
                onChange={setBaths}
                rounded
                valueType='integer'
                totalHeight={35}
                totalWidth={100}
                leftButtonBackgroundColor={constants.MAIN_COLOR}
                rightButtonBackgroundColor={constants.MAIN_COLOR}
                iconStyle={{ color: 'white' }}
                minValue={0}
              />
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasNewConstruction') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>New construction</Text>
              <ModalSelector
                data={filterData.NEW_CONSTRUCTION_DATA}
                selectStyle={{ padding: 3, borderWidth: 0 }}
                onChange={option => setNewConstruction(option.label)}
              >
                <TextInput
                  editable={false}
                  placeholder='Select option...'
                  style={styles.option}
                  value={isNewConstruction}
                />
              </ModalSelector>
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasYearBuilt') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>Time built</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setDatePickerVisibility(true)}
              >
                {date ? <Text>{date}</Text> : <FontAwesome name="calendar" size={24} color={constants.MAIN_COLOR} />}
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode='date'
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                style={{ backgroundColor: constants.MAIN_COLOR }}
              />
            </View>
            <View style={styles.seperate} />
          </View>
        }
        {
          filters.includes('hasCloseToPublicTransportation') &&
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.filter}>
              <Text style={styles.label}>Close to public transportation</Text>
              <ModalSelector
                data={filterData.CLOSE_TO_PUBLIC_PLACES_DATA}
                selectStyle={{ padding: 3, borderWidth: 0 }}
                onChange={option => setCloseToPublicTransportation(option.label)}
              >
                <TextInput
                  editable={false}
                  placeholder='Select option...'
                  style={styles.option}
                  value={isCloseToPublicTransportation}
                />
              </ModalSelector>
            </View>
            <View style={styles.seperate} />
          </View>
        }
      </View>
      <Button
        title='Add Listing'
        buttonStyle={styles.submit}
        onPress={handleSubmit}
      />
      <ErrorModal
        isError={errorMessage ? true : false}
        hideModal={clearErrorMessage}
        text={errorMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    alignItems: 'center'
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#9e9c9c'
  },
  seperate: {
    borderWidth: 0.5,
    borderColor: 'grey',
    margin: 10
  },
  option: {
    fontSize: 15,
    textAlign: 'right',
    color: 'black'
  },
  submit: {
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 10,
    margin: 15
  }
});

export default FiltersForm;

