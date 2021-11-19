import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import CurrencyInput from 'react-native-currency-input';
import ModalSelector from 'react-native-modal-selector';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Context as CategoryContext } from '../context/CategoryContext';
import * as constants from '../constants';
import PhotoModal from './PhotoModal';
import ConfirmationModal from './ConfirmationModal';
import MapModal from './MapModal';
import CameraPreview from './CameraPreview';
import { Context as ListingContext } from '../context/ListingContext';

const ListingForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USA');
  const [category, setCategory] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startCamera, setStartCamera] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const { state: { categories } } = useContext(CategoryContext);
  const [location, setLocation] = useState(null);
  const { state: { loading, photos }, uploadImageCloudinary, deleteImageCloudinary } = useContext(ListingContext);
  const cameraRef = useRef();

  const locationSubmit = location => {
    setLocation(location);
    setMapModalVisible(false);
  };

  const currencies = [
    { key: 1, label: 'USA' },
    { key: 2, label: 'VNĐ' }
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

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      alert('Access camera denied!');
    }
  };

  const takePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off');
    } else if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('auto');
    }
  };

  const switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front');
    } else {
      setCameraType('back');
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const savePhoto = () => {
    setImages([...images, capturedImage.uri]);
    setSelectedImage(capturedImage.uri);
    uploadImageCloudinary(capturedImage.uri);
    setStartCamera(false);
    setModalVisible(false);
    setCapturedImage(null);
    setPreviewVisible(false);
    setFlashMode('off');
    setCameraType(Camera.Constants.Type.back);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      if (images.length === 10) {
        setModalVisible(false);
        return;
      }
      setImages([...images, result.uri]);
      setSelectedImage(result.uri);
      setModalVisible(false);
      uploadImageCloudinary(result.uri);
    }
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

  return (
    <>
      {startCamera ?
        (
          <View
            style={{
              flex: 1,
              width: '100%'
            }}
          >
            {previewVisible && capturedImage ? (
              <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={retakePicture} />
            ) : (<Camera
              style={{ height: '100%', width: '100%' }}
              ref={cameraRef}
              ratio='16:9'
              flashMode={flashMode}
              type={cameraType}
            >
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff'
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={handleFlashMode}
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '10%',
                  backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                  borderRadius: 30,
                  height: 25,
                  width: 25
                }}
              >
                <Text
                  style={{
                    fontSize: 20
                  }}
                >
                  ⚡️
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={switchCamera}
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '15%',
                  marginTop: 20,
                  borderRadius: 30,
                  height: 25,
                  width: 25
                }}
              >
                <Text
                  style={{
                    fontSize: 20
                  }}
                >
                  {cameraType === 'front' ? '🤳' : '📷'}
                </Text>
              </TouchableOpacity>
            </Camera>)}
          </View>
        ) :
        (
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
                    onPress={() => setModalVisible(true)}
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
                  images.length === 0
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
              <PhotoModal
                isModalVisible={isModalVisible}
                closeModal={() => setModalVisible(false)}
                pickImage={() => pickImage()}
                captureImage={() => __startCamera()}
              />
              <ConfirmationModal
                isModalVisible={isConfirmationModalVisible}
                closeModal={() => setConfirmationModalVisible(false)}
                removeImage={() => removeImage(selectedImage)}
              />
              <MapModal
                isModalVisible={isMapModalVisible}
                closeModal={() => setMapModalVisible(false)}
                locationSubmit={locationSubmit}
              />
            </View>
          </ScrollView>
        )}
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
  }
});

export default withNavigation(ListingForm);

