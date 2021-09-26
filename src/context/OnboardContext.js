import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext";
import { navigate } from '../navigationRef';

const onboardReducer = (state, action) => {
  switch (action.type) {
    case 'launch_first_time':
      return { isFirstLaunched: action.payload };
    default:
      return state;
  }
};

const launchFirstTime = dispatch => async () => {
  const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
  if (!alreadyLaunched) {
    await AsyncStorage.setItem('alreadyLaunched', 'true');
    dispatch({ type: 'launch_first_time', payload: true });
  } else {
    dispatch({ type: 'launch_first_time', payload: false });
    navigate('Welcome');
  }
};

export const { Provider, Context } = createDataContext(
  onboardReducer,
  { launchFirstTime },
  { isFirstLaunched: null }
);