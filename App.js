import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { setNavigator } from './src/navigationRef';
import { Provider as OnboardProvider } from './src/context/OnboardContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';

const loginFlow = createStackNavigator({
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  Verify: VerifyScreen
});

const mainFlow = createBottomTabNavigator({
  Home: HomeScreen
});

const switchNavigator = createSwitchNavigator({
  Onboard: OnboardScreen,
  loginFlow,
  mainFlow
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <OnboardProvider>
        <App ref={(navigator) => { setNavigator(navigator) }} />
      </OnboardProvider>
    </AuthProvider>
  );
};
