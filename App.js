import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import { setNavigator } from './src/navigationRef';
import { Provider as OnboardProvider } from './src/context/OnboardContext';

const loginFlow = createStackNavigator({
  Login: LoginScreen
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
