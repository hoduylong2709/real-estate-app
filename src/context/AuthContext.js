import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'auth_start':
      return { ...state, loading: true };
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
  if (token) {
    dispatch({ type: 'login', payload: token });
    navigate('Home');
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
      navigate('Home');
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
      navigate('Home');
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
    dispatch({ type: 'login', payload: response.data.token });
    navigate('Home');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'The verify code is incorrect!' });
  }
};

const logout = dispatch => async () => {
  try {
    await realEstateApi.post('users/logout');
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
    navigate('loginFlow');
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot log out the user!' });
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { login, tryLocalLogin, signup, verify, logout, clearErrorMessage, loginWithGoogle },
  { token: null, errorMessage: '', loading: false }
);