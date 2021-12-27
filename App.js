import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { setNavigator } from './src/navigationRef';
import * as constants from './src/constants';
import { Provider as OnboardProvider } from './src/context/OnboardContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';
import { Provider as ListingProvider } from './src/context/ListingContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as RatingProvider } from './src/context/RatingContext';
import { Provider as ConversationProvider } from './src/context/ConversationContext';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddListingScreen from './src/screens/AddListingScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import ListingFiltersScreen from './src/screens/ListingFiltersScreen';
import MyListingScreen from './src/screens/MyListingScreen';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import RatingScreen from './src/screens/RatingScreen';
import CameraScreen from './src/screens/CameraScreen';
import EditListingScreen from './src/screens/EditListingScreen';
import MyFavoriteListingScreen from './src/screens/MyFavoriteListingScreen';
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import ChatScreen from './src/screens/ChatScreen';

const loginFlow = createStackNavigator({
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  Verify: VerifyScreen
});

const homeFlow = createStackNavigator({
  Home: HomeScreen,
  AddListing: AddListingScreen,
  Camera: CameraScreen,
  ListingFilters: ListingFiltersScreen,
  ListingDetail: ListingDetailScreen,
  Rating: RatingScreen
}, {
  defaultNavigationOptions: {
    headerTitleAlign: 'center'
  }
});

homeFlow.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'AddListing' ||
    routeName === 'ListingFilters' ||
    routeName === 'ListingDetail' ||
    routeName === 'Rating' ||
    routeName === 'Camera') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: () => { return null },
    tabBarIcon: ({ focused }) => <FontAwesome name='home' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />,
    tabBarVisible
  };
};

const profileFlow = createStackNavigator({
  Profile: ProfileScreen,
  MyListing: MyListingScreen,
  MyFavoriteListing: MyFavoriteListingScreen,
  EditListing: EditListingScreen,
  Camera: CameraScreen,
  ListingFilters: ListingFiltersScreen,
  ListingDetail: ListingDetailScreen,
  Rating: RatingScreen,
  AccountDetail: AccountDetailScreen
}, {
  defaultNavigationOptions: {
    headerTitleAlign: 'center'
  }
});

profileFlow.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'MyListing' ||
    routeName === 'MyFavoriteListing' ||
    routeName === 'EditListing' ||
    routeName === 'ListingFilters' ||
    routeName === 'Camera' ||
    routeName === 'ListingDetail' ||
    routeName === 'AccountDetail') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: () => { return null },
    tabBarIcon: ({ focused }) => <MaterialCommunityIcons name='account' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />,
    tabBarVisible
  };
};

const chatFlow = createStackNavigator({
  Messages: MessagesScreen,
  Chat: ChatScreen
}, {
  defaultNavigationOptions: {
    headerTitleAlign: 'center'
  }
});

chatFlow.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName === 'Chat') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: () => { return null },
    tabBarIcon: ({ focused }) => <AntDesign name='message1' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />,
    tabBarVisible
  };
};

const mainFlow = createBottomTabNavigator({
  homeFlow,
  Categories: CategoriesScreen,
  chatFlow,
  profileFlow
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
    <ConversationProvider>
      <RatingProvider>
        <UserProvider>
          <ListingProvider>
            <CategoryProvider>
              <AuthProvider>
                <OnboardProvider>
                  <App ref={(navigator) => { setNavigator(navigator) }} />
                </OnboardProvider>
              </AuthProvider>
            </CategoryProvider>
          </ListingProvider>
        </UserProvider>
      </RatingProvider>
    </ConversationProvider>
  );
};
