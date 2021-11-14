import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';

const listingReducer = (state, action) => {
  switch (action.type) {
    case 'create_start':
      return { ...state, loading: true };
    case 'upload_image':
      return { ...state, loading: false, photos: [...state.photos, action.payload], errorMessage: '' };
    case 'delete_image':
      return {
        ...state,
        errorMessage: '',
        photos: state.photos.filter(photo => photo.publicId !== action.payload)
      };
    case 'create_listing':
      return { ...state, errorMessage: '', loading: false };
    case 'fetch_listings':
      return { ...state, listings: action.payload };
    case 'fetch_popular_listings':
      return { ...state, popularListings: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'clear_error_message':
      return { ...state, errorMessage: '' }
    default:
      return state;
  }
};

const uploadImageCloudinary = dispatch => async imageUri => {
  dispatch({ type: 'create_start' })
  const formData = new FormData();
  const file = {
    name: 'user_listing.jpg',
    uri: imageUri,
    type: 'image/jpg'
  };

  formData.append('file', file);
  formData.append('upload_preset', '_RealEstate');
  formData.append('cloud_name', 'longhoduy');
  formData.append('folder', 'Listing');

  try {
    const response = await axios.post('https://api.cloudinary.com/v1_1/longhoduy/image/upload', formData);
    dispatch({ type: 'upload_image', payload: { imageUrl: response.data.url, publicId: response.data.public_id, localUri: imageUri } });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot upload photo of listing. Please try again!' });
  }
};

const deleteImageCloudinary = dispatch => async publicId => {
  const token = await AsyncStorage.getItem('token');
  try {
    await realEstateApi.delete('/listings/cloudinary', {
      headers: {
        Authorization: token
      },
      data: {
        publicId
      }
    });
    dispatch({ type: 'delete_image', payload: publicId });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot delete photo of listing. Please try again!' });
  }
};

const createListing = dispatch => async (
  { title,
    description,
    price,
    category,
    location,
    photos
  }
) => {
  dispatch({ type: 'create_start' });
  try {
    await realEstateApi.post('/listings', {
      title,
      description,
      price,
      category,
      location,
      photos
    });
    dispatch({ type: 'create_listing' });
    navigate('Home');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot create your listing. Please try again!' });
  }
};

const fetchListings = dispatch => async () => {
  const response = await realEstateApi.get('/listings');
  dispatch({ type: 'fetch_listings', payload: response.data });
};

const fetchPopularListings = dispatch => async () => {
  const response = await realEstateApi.get('/listings/popular');
  dispatch({ type: 'fetch_popular_listings', payload: response.data });
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  listingReducer,
  { createListing, clearErrorMessage, fetchListings, fetchPopularListings, uploadImageCloudinary, deleteImageCloudinary },
  { errorMessage: '', loading: false, listings: [], popularListings: [], photos: [] }
);