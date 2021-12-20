import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import axios from 'axios';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'process_start':
      return { ...state, loading: true };
    case 'post_avatar':
      return { errorMessage: '', loading: false };
    case 'get_user':
      return { errorMessage: '', user: action.payload };
    case 'add_error':
      return { errorMessage: action.payload, loading: false };
    default:
      return state;
  }
};

const postAvatar = dispatch => async imageUri => {
  dispatch({ type: 'process_start' });
  const formData = new FormData();
  const file = {
    name: 'user_avatar.jpg',
    uri: imageUri,
    type: 'image/jpg'
  };
  formData.append('file', file);
  formData.append('upload_preset', '_RealEstate');
  formData.append('cloud_name', 'longhoduy');
  formData.append('folder', 'Avatar');
  try {
    const response = await axios.post('https://api.cloudinary.com/v1_1/longhoduy/image/upload', formData);
    if (response.data.url) {
      const userJson = await AsyncStorage.getItem('userInfo');
      const token = await AsyncStorage.getItem('token');
      const userObj = JSON.parse(userJson);
      if (userObj.avatar) {
        await realEstateApi.delete('/users/me/avatar', {
          headers: {
            Authorization: token
          },
          data: {
            public_id: userObj.publicIdCloudinary
          }
        });
      }
      await realEstateApi.post('/users/me/avatar', {
        imageUrl: response.data.url,
        publicIdCloudinary: response.data.public_id
      });
    }
    dispatch({ type: 'post_avatar' });
    const userJson = await AsyncStorage.getItem('userInfo');
    const userObj = JSON.parse(userJson);
    userObj.avatar = response.data.url;
    userObj.publicIdCloudinary = response.data.public_id;
    await AsyncStorage.setItem('userInfo', JSON.stringify(userObj));
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot upload your avatar. Please try again!' });
  }
};

const deleteAvatar = dispatch => async publicIdCloudinary => {
  const token = await AsyncStorage.getItem('token');
  await realEstateApi.delete('/users/me/avatar', {
    headers: {
      Authorization: token
    },
    data: {
      public_id: publicIdCloudinary
    }
  });
  const userJson = await AsyncStorage.getItem('userInfo');
  const userObj = JSON.parse(userJson);
  delete userObj.avatar;
  delete userObj.publicIdCloudinary;
  await AsyncStorage.setItem('userInfo', JSON.stringify(userObj));
};

const getUserById = dispatch => async id => {
  try {
    const response = await realEstateApi.get(`/users/${id}`);
    dispatch({ type: 'get_user', payload: response.data });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Something wrong. Please try again!' });
  }
};

const addFavoriteListing = dispatch => async listingId => {
  await realEstateApi.post('/users/me/favorite', { listingId });
};

const deleteFavoriteListing = dispatch => async listingId => {
  await realEstateApi.delete(`/users/me/favorite/${listingId}`);
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { deleteAvatar, postAvatar, getUserById, addFavoriteListing, deleteFavoriteListing },
  { loading: false, errorMessage: '', user: null }
);