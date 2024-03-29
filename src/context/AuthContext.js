import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';
import socket from '../../socket';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'auth_start':
      return { ...state, loading: true };
    case 'auth_end':
      return { ...state, loading: false };
    case 'login':
      return { errorMessage: '', token: action.payload, loading: false };
    case 'signup': {
      return { ...state, loading: false };
    }
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'logout':
      return { ...state, token: null, errorMessage: '' }
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    default:
      return state;
  }
};

const tryLocalLogin = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  const userJson = await AsyncStorage.getItem('userInfo');
  const userObj = JSON.parse(userJson);
  if (token) {
    dispatch({ type: 'login', payload: token });
    navigate('Home', { userId: userObj._id });
  } else {
    navigate('Welcome');
  }
};

const login = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'auth_start' });
    const response = await realEstateApi.post('/users/login', { email, password });
    if (response.data.token && response.data.user) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      dispatch({ type: 'login', payload: response.data.token });
      navigate('Home', { userId: response.data.user._id });
    } else {
      dispatch({ type: 'signup' });
      navigate('Verify', { id: response.data.user._id });
    }
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Email or password might be incorrect!' });
  }
};

const loginWithGoogle = dispatch => async ({ firstName, lastName, email, userId, idToken, avatar }) => {
  try {
    dispatch({ type: 'auth_start' });
    const response = await realEstateApi.post('/users/loginWithGoogle', { firstName, lastName, email, userId, idToken, avatar });
    if (response.data.idToken && response.data.user) {
      await AsyncStorage.setItem('token', response.data.idToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      dispatch({ type: 'login', payload: response.data.idToken });
      navigate('Home', { userId: response.data.user._id });
    }
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Email was used!' });
  }
};

const signup = dispatch => async ({ firstName, lastName, email, password }) => {
  try {
    dispatch({ type: 'auth_start' });
    const response = await realEstateApi.post('/users', { firstName, lastName, email, password });
    dispatch({ type: 'signup' });
    navigate('Verify', { id: response.data.user._id });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'That email was already in use!' });
  }
};

const verify = dispatch => async (id, verifyCode) => {
  try {
    dispatch({ type: 'auth_start' });
    const response = await realEstateApi.post(`/users/verify/${id}`, { verifyCode });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
    dispatch({ type: 'login', payload: response.data.token });
    navigate('Home', { userId: response.data.user._id });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'The verify code is incorrect!' });
  }
};

const logout = dispatch => async () => {
  try {
    await realEstateApi.post('users/logout');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
    dispatch({ type: 'logout' });
    socket.disconnect();
    navigate('loginFlow');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot log out the user!' });
  }
};

const forgotPassword = dispatch => async email => {
  dispatch({ type: 'auth_start' });
  try {
    await realEstateApi.post('/users/forgot-password', { email });
    dispatch({ type: 'auth_end' });
    navigate('Verify', { isForgotPassword: true, email });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Email not yet registered in system database!' });
  }
};

const verifyForgotPassword = dispatch => async (email, verifyCode) => {
  dispatch({ type: 'auth_start' });
  try {
    await realEstateApi.post('/users/forgot-password/verify', { email, verifyCode });
    dispatch({ type: 'auth_end' });
    navigate('ChangePassword', { email });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'The verify code is incorrect!' });
  }
};

const changePassword = dispatch => async (email, newPassword) => {
  dispatch({ type: 'auth_start' });
  try {
    await realEstateApi.patch('/users/change-password', { email, newPassword });
    dispatch({ type: 'auth_end' });
    navigate('Login');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Something went wrong. Please try again!' });
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    login,
    tryLocalLogin,
    signup,
    verify,
    logout,
    clearErrorMessage,
    loginWithGoogle,
    forgotPassword,
    verifyForgotPassword,
    changePassword
  },
  { token: null, errorMessage: '', loading: false }
);