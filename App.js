import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { setNavigator } from './src/navigationRef';
import * as constants from './src/constants';
import { Provider as OnboardProvider } from './src/context/OnboardContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import ChatScreen from './src/screens/ChatScreen';
import SearchScreen from './src/screens/SearchScreen';
import DetailListingScreen from './src/screens/DetailListingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddListingScreen from './src/screens/AddListingScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';

const loginFlow = createStackNavigator({
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  Verify: VerifyScreen
});

const homeFlow = createStackNavigator({
  Home: HomeScreen,
  DetailListing: DetailListingScreen,
  Profile: ProfileScreen,
  AddListing: AddListingScreen
}, {
  defaultNavigationOptions: {
    headerTitleAlign: 'center'
  }
});

homeFlow.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'AddListing') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: () => { return null },
    tabBarIcon: ({ focused }) => <FontAwesome name='home' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />,
    tabBarVisible
  };
};

const mainFlow = createBottomTabNavigator({
  homeFlow,
  Categories: CategoriesScreen,
  Chat: ChatScreen,
  Search: SearchScreen
});

const switchNavigator = createSwitchNavigator({
  Onboard: OnboardScreen,
  ResolveAuth: ResolveAuthScreen,
  loginFlow,
  mainFlow
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <LocationProvider>
      <CategoryProvider>
        <AuthProvider>
          <OnboardProvider>
            <App ref={(navigator) => { setNavigator(navigator) }} />
          </OnboardProvider>
        </AuthProvider>
      </CategoryProvider>
    </LocationProvider>
  );
};
