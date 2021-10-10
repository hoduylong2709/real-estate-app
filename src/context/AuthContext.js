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

const login = dispatch => async ({ email, password }) => {
  try {
    dispatch({ type: 'auth_start' });
    const response = await realEstateApi.post('/users/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
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
  await AsyncStorage.removeItem('token');
  dispatch({ type: 'logout' });
  navigate('loginFlow');
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { login, signup, verify, logout, clearErrorMessage },
  { token: null, errorMessage: '', loading: false }
);