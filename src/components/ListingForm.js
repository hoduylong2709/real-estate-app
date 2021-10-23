import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import CurrencyInput from 'react-native-currency-input';
import ModalSelector from 'react-native-modal-selector';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Context as CategoryContext } from '../context/CategoryContext';
import * as constants from '../constants';
import PhotoModal from './PhotoModal';
import ConfirmationModal from './ConfirmationModal';
import { Context as LocationContext } from '../context/LocationContext';

const ListingForm = ({ navigation }) => {
  const [price, setPrice] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USA');
  const [category, setCategory] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { state: categories } = useContext(CategoryContext);
  const { state: { location } } = useContext(LocationContext);

  const currencies = [
    { key: 1, label: 'USA' },
    { key: 2, label: 'VND' }
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permission to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
      setModalVisible(false);
    }
  };

  const removeImage = selectedImage => {
    const newImages = images.filter(image => image !== selectedImage);
    setImages(newImages);
    setSelectedImage(null);
    setConfirmationModalVisible(false);
  };

  return (
    <ScrollView>
      <View>
        <Input
          label='Title'
          placeholder='Start typing...'
          inputContainerStyle={{ borderBottomWidth: 0 }}
          labelStyle={{ fontSize: 18, color: '#9e9c9c' }}
        />
        <View
          style={styles.seperate}
        />
        <Input
          label='Description'
          placeholder='Start typing...'
          inputContainerStyle={styles.description}
          textAlignVertical='top'
          labelStyle={{ fontSize: 18, marginBottom: 5, marginTop: 5, color: '#9e9c9c' }}
          multiline={true}
        />
        <View
          style={styles.seperate}
        />
        <View
          style={styles.price}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9e9c9c' }}>
            Price
          </Text>
          <View
            style={{ flexDirection: 'row', width: 170, borderWidth: 1, borderColor: '#eeeeee', borderRadius: 10, justifyContent: 'space-between' }}
          >
            <CurrencyInput
              value={price}
              onChangeValue={setPrice}
              delimiter=','
              precision={0}
              minValue={0}
              suffix={selectedCurrency === 'USA' ? ' $' : ' vnd'}
              style={styles.priceInput}
            />
            <ModalSelector
              data={currencies}
              initValue={selectedCurrency}
              selectStyle={{ padding: 3, backgroundColor: constants.MAIN_COLOR }}
              onChange={option => setSelectedCurrency(option.label)}
            />
          </View>
        </View>
        <View style={styles.category}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9e9c9c' }}>
            Category
          </Text>
          <ModalSelector
            data={categories && categories.map(category => {
              return { key: category._id, label: category.name }
            })}
            selectStyle={{ padding: 3, borderWidth: 0 }}
            onChange={option => setCategory(option.label)}
          >
            <TextInput
              editable={false}
              placeholder='Select category...'
              style={{ fontSize: 16, textAlign: 'center', color: 'black' }}
              value={category}
            />
          </ModalSelector>
        </View>
        <View style={styles.location}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9e9c9c' }}>
            Location
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Map')}
          >
            {location ?
              <Text style={{ fontSize: 16, color: 'black', maxWidth: 220 }} multiline={true}>{location.address}</Text> :
              <Feather name='map-pin' size={22} color={constants.MAIN_COLOR} />}
          </TouchableOpacity>
        </View>
        <View
          style={styles.photos}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9e9c9c' }}>
            Add photos
          </Text>
          <ScrollView
            scrollEventThrottle={16}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10, marginRight: 5 }}>
              {images.length > 0 && images.map(image => (
                <TouchableOpacity
                  key={image}
                  activeOpacity={0.5}
                  onPress={() => {
                    setConfirmationModalVisible(true);
                    setSelectedImage(image);
                  }}
                >
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              ))}
              <Button
                icon={<AntDesign name="camerao" size={24} color='white' />}
                buttonStyle={{ height: 70, width: 70, backgroundColor: constants.MAIN_COLOR, borderRadius: 10 }}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </ScrollView>
          <Button
            title='Next'
            buttonStyle={{ backgroundColor: constants.MAIN_COLOR, borderRadius: 10, marginRight: 10, marginTop: 20 }}
          />
          <PhotoModal
            isModalVisible={isModalVisible}
            closeModal={() => setModalVisible(false)}
            pickImage={() => pickImage()}
          />
          <ConfirmationModal
            isModalVisible={isConfirmationModalVisible}
            closeModal={() => setConfirmationModalVisible(false)}
            removeImage={() => removeImage(selectedImage)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  seperate: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10
  },
  description: {
    borderBottomWidth: 0,
    height: 80
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10
  },
  priceInput: {
    height: 30,
    width: 130,
    padding: 5
  },
  category: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  location: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  photos: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'column'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 5
  }
});

export default withNavigation(ListingForm);

