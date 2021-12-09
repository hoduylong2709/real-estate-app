import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native';
import { Input, Button } from 'react-native-elements';
import CurrencyInput from 'react-native-currency-input';
import ModalSelector from 'react-native-modal-selector';
import { withNavigation } from 'react-navigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Feather, AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Context as CategoryContext } from '../context/CategoryContext';
import * as constants from '../constants';
import MapModal from './MapModal';
import { Context as ListingContext } from '../context/ListingContext';

const ListingForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USA');
  const [category, setCategory] = useState('');
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { state: { categories } } = useContext(CategoryContext);
  const [location, setLocation] = useState(null);
  const { state: { loading, photos }, uploadImageCloudinary, deleteImageCloudinary } = useContext(ListingContext);
  const refRBSheet = useRef();

  const locationSubmit = location => {
    setLocation(location);
    setMapModalVisible(false);
  };

  const currencies = [
    { key: 1, label: 'USA' },
    { key: 2, label: 'VNĐ' }
  ];

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permission to make this work!');
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1
        });

        if (!result.cancelled) {
          if (images.length === 10) {
            refRBSheet.current.close();
            ToastAndroid.show('Sorry, you can upload 10 images in limit!', ToastAndroid.SHORT);
            return;
          }
          setImages([...images, result.uri]);
          setSelectedImage(result.uri);
          refRBSheet.current.close();
          uploadImageCloudinary(result.uri);
        }
      }
    }
  };

  const captureImageFromCamera = capturedImage => {
    setImages([...images, capturedImage.uri]);
    setSelectedImage(capturedImage.uri);
    uploadImageCloudinary(capturedImage.uri);
  };

  const getPublicIdByUri = (imageUri, photos) => {
    const found = photos.find(photo => photo.localUri === imageUri);
    return found.publicId;
  };

  const removeImage = selectedImage => {
    const newImages = images.filter(image => image !== selectedImage);
    setImages(newImages);
    deleteImageCloudinary(getPublicIdByUri(selectedImage, photos));
    setSelectedImage(null);
    setConfirmationModalVisible(false);
  };

  const removeImages = images => {
    if (images.length === 0) {
      return;
    }

    for (let i = 0; i < images.length; i++) {
      deleteImageCloudinary(images[i].publicId);
    }
  };

  return (
    <>
      <ScrollView>
        <Input
          label='Title'
          placeholder='Start typing...'
          inputContainerStyle={{ borderBottomWidth: 0 }}
          labelStyle={{ fontSize: 18, color: '#9e9c9c' }}
          value={title}
          onChangeText={setTitle}
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
          value={description}
          onChangeText={setDescription}
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
              suffix={selectedCurrency === 'USA' ? ' $' : ' vnđ'}
              style={styles.priceInput}
            />
            <ModalSelector
              data={currencies}
              initValue={selectedCurrency}
              selectStyle={{ padding: 3, backgroundColor: constants.MAIN_COLOR }}
              initValueTextStyle={{ color: 'white' }}
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
              style={{ fontSize: 16, textAlign: 'right', color: 'black' }}
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
            onPress={() => setMapModalVisible(true)}
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
                  style={styles.imageContainer}
                >
                  {
                    loading && selectedImage === image &&
                    <View style={styles.loading}>
                      <ActivityIndicator
                        size='small'
                        color='white'
                      />
                    </View>
                  }
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              ))}
              <Button
                icon={<AntDesign name="camerao" size={24} color='white' />}
                buttonStyle={{ height: 70, width: 70, backgroundColor: constants.MAIN_COLOR, borderRadius: 10 }}
                onPress={() => refRBSheet.current.open()}
              />
            </View>
          </ScrollView>
          <Button
            title='Next'
            buttonStyle={styles.nextButton}
            disabled={
              !title ||
              !description ||
              !price ||
              !category ||
              !location ||
              images.length === 0 ||
              loading
            }
            disabledStyle={{ backgroundColor: '#bcbcbc' }}
            onPress={() => navigation.navigate('ListingFilters', {
              categoryName: category,
              title: title,
              description: description,
              price: price,
              location: location,
              currency: selectedCurrency
            })}
          />
          <Button
            title='Cancel'
            buttonStyle={styles.cancelButton}
            onPress={() => {
              removeImages(photos);
              navigation.goBack();
            }}
          />
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,0.5)'
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
            height={130}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.imageOption}
              onPress={() => navigation.navigate('Camera', {
                captureImageFromCamera
              })}
            >
              <AntDesign name='camera' size={24} color='grey' style={{ marginRight: 10 }} />
              <Text h5>Take photo from camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.imageOption}
              onPress={() => pickImage()}
            >
              <FontAwesome name='photo' size={24} color='grey' style={{ marginRight: 10 }} />
              <Text h5>Choose photos from gallery</Text>
            </TouchableOpacity>
          </RBSheet>
          <AwesomeAlert
            show={isConfirmationModalVisible}
            title='Confirmation'
            message='Do you want to delete this image?'
            closeOnTouchOutside={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText='No, cancel'
            confirmText='Yes, delete it'
            confirmButtonColor='#DD6B55'
            onCancelPressed={() => setConfirmationModalVisible(false)}
            onConfirmPressed={() => removeImage(selectedImage)}
          />
          <MapModal
            isModalVisible={isMapModalVisible}
            closeModal={() => setMapModalVisible(false)}
            locationSubmit={locationSubmit}
          />
        </View>
      </ScrollView>
    </>
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
    marginBottom: 15,
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
    marginTop: 20,
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  loading: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10
  },
  nextButton: {
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 25
  },
  cancelButton: {
    backgroundColor: '#f46b61',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10
  },
  imageOption: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default withNavigation(ListingForm);

