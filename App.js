import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { setNavigator } from './src/navigationRef';
import { Provider as OnboardProvider } from './src/context/OnboardContext';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';

const loginFlow = createStackNavigator({
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  Signup: SignupScreen
});

const switchNavigator = createSwitchNavigator({
  Onboard: OnboardScreen,
  loginFlow
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <OnboardProvider>
      <App ref={(navigator) => { setNavigator(navigator) }} />
    </OnboardProvider>
  );
};
