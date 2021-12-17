import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';

const ratingReducer = (state, action) => {
  switch (action.type) {
    case 'process_start':
      return { ...state, loading: true };
    case 'post_rating':
      return { ...state, errorMessage: '', loading: false };
    case 'fetch_ratings':
      return { ...state, errorMessage: '', ratings: action.payload };
    case 'delete_rating':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        ratings: state.ratings.filter(rating => rating._id !== action.payload)
      };
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
};

const postRating = dispatch => async (stars, review, listingId) => {
  try {
    dispatch({ type: 'process_start' });
    await realEstateApi.post('/ratings', { stars, review, listingId });
    dispatch({ type: 'post_rating' });
    navigate('ListingDetail');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot post your rating. Please try again!' });
  }
};

const fetchRatings = dispatch => async listingId => {
  try {
    const response = await realEstateApi.get(`/ratings/listings/${listingId}`);
    dispatch({ type: 'fetch_ratings', payload: response.data });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot get the ratings. Please try again!' });
  }
};

const deleteRating = dispatch => async ratingId => {
  try {
    await realEstateApi.delete(`/ratings/${ratingId}`);
    dispatch({ type: 'delete_rating', payload: ratingId });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot delete the rating. Please try again!' });
  }
};

const updateRating = dispatch => async (ratingId, changes) => {
  try {
    dispatch({ type: 'process_start' });
    await realEstateApi.patch(`/ratings/${ratingId}`, { ...changes });
    dispatch({ type: 'post_rating' });
    navigate('ListingDetail');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot update your rating. Please try again!' });
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  ratingReducer,
  { postRating, fetchRatings, clearErrorMessage, deleteRating, updateRating },
  { errorMessage: '', loading: false, ratings: [] }
);