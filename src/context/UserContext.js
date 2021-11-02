import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'process_start':
      return { ...state, loading: true };
    case 'post_avatar':
      return { errorMessage: '', loading: false };
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
    name: `user_avatar.jpg`,
    uri: imageUri,
    type: 'image/jpg'
  };
  formData.append('avatar', file);
  try {
    await realEstateApi.post('/users/me/avatar', formData);
    dispatch({ type: 'post_avatar' });
    const userJson = await AsyncStorage.getItem('userInfo');
    const userObj = JSON.parse(userJson);
    userObj.avatar = imageUri;
    await AsyncStorage.setItem('userInfo', JSON.stringify(userObj));
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot upload your avatar. Please try again!' });
  }
};

const deleteAvatar = dispatch => async () => {
  await realEstateApi.delete('/users/me/avatar');
  const userJson = await AsyncStorage.getItem('userInfo');
  const userObj = JSON.parse(userJson);
  delete userObj.avatar;
  await AsyncStorage.setItem('userInfo', JSON.stringify(userObj));
};

export const { Provider, Context } = createDataContext(
  userReducer,
  { deleteAvatar, postAvatar },
  { loading: false, errorMessage: '' }
);