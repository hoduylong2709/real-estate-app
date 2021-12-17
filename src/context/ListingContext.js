import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';

const listingReducer = (state, action) => {
  switch (action.type) {
    case 'process_start':
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
      return { ...state, errorMessage: '', loading: false, photos: [] };
    case 'start_fetching':
      return { ...state, loading: true };
    case 'fetch_listings':
      return { ...state, listings: action.payload, loading: false };
    case 'fetch_popular_listings':
      return { ...state, popularListings: action.payload, loading: false };
    case 'delete_listing':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        listings: state.listings.filter(listing => listing._id !== action.payload)
      };
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
};

const uploadImageCloudinary = dispatch => async imageUri => {
  dispatch({ type: 'process_start' });
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
  dispatch({ type: 'process_start' });
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
  dispatch({ type: 'start_fetching' });
  const response = await realEstateApi.get('/listings/me');
  dispatch({ type: 'fetch_listings', payload: response.data });
};

const fetchPopularListings = dispatch => async () => {
  dispatch({ type: 'start_fetching' });
  const response = await realEstateApi.get('/listings/popular');
  dispatch({ type: 'fetch_popular_listings', payload: response.data });
};

const addFavoriteUser = dispatch => async id => {
  await realEstateApi.post(`/listings/favorite/${id}`);
};

const deleteFavoriteUser = dispatch => async id => {
  await realEstateApi.delete(`/listings/favorite/${id}`);
};

const increaseViews = dispatch => async id => {
  await realEstateApi.post(`/listings/views/${id}`);
};

const deleteListing = dispatch => async listingId => {
  try {
    await realEstateApi.delete(`/listings/${listingId}`);
    dispatch({ type: 'delete_listing', payload: listingId });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot delete the listing. Please try again!' });
  }
};

const updateListing = dispatch => async (listingId, basicInfo, price, categoryInfo, photos) => {
  dispatch({ type: 'process_start' });
  try {
    if (basicInfo) {
      await realEstateApi.patch(`/listings/${listingId}`, { ...basicInfo });
    }
    if (price) {
      await realEstateApi.patch(`/listings/price/${listingId}`, { ...price });
    }
    if (categoryInfo) {
      await realEstateApi.patch(`/listings/category/${listingId}`, { ...categoryInfo });
    }
    if (photos) {
      await realEstateApi.patch(`/listings/photos/${listingId}`, { ...photos });
    }
    dispatch({ type: 'create_listing' });
    navigate('MyListing');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot update the listing. Please try again!' });
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  listingReducer,
  {
    createListing,
    clearErrorMessage,
    fetchListings,
    fetchPopularListings,
    uploadImageCloudinary,
    deleteImageCloudinary,
    addFavoriteUser,
    deleteFavoriteUser,
    increaseViews,
    deleteListing,
    updateListing
  },
  { errorMessage: '', loading: false, listings: [], popularListings: [], photos: [] }
);