import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';

const listingReducer = (state, action) => {
  switch (action.type) {
    case 'create_start':
      return { ...state, loading: true };
    case 'create_listing':
      return { errorMessage: '', loading: false };
    case 'fetch_listings':
      return { ...state, listings: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'clear_error_message':
      return { ...state, errorMessage: '' }
    default:
      return state;
  }
};

const createListing = dispatch => async (
  { title,
    description,
    price,
    category,
    location,
    images
  }
) => {
  dispatch({ type: 'create_start' });
  const formData = new FormData();
  for (let i = 0; i < images.length; i++) {
    const file = {
      name: `photo_${i}.jpg`,
      uri: images[i],
      type: 'image/jpg'
    };
    formData.append('photos', file);
  }
  try {
    const response = await realEstateApi.post('/listings', {
      title,
      description,
      price,
      category,
      location
    });
    if (response.data.listing._id) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      await realEstateApi.post(`/listings/photos/${response.data.listing._id}`, formData, config);
      dispatch({ type: 'create_listing' });
      navigate('Home');
    }
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot create your listing. Please try again!' });
  }
};

const fetchListings = dispatch => async () => {
  const response = await realEstateApi.get('/listings');
  dispatch({ type: 'fetch_listings', payload: response.data });
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  listingReducer,
  { createListing, clearErrorMessage, fetchListings },
  { errorMessage: '', loading: false, listings: [] }
);