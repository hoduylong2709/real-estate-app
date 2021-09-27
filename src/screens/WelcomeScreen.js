import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import * as constants from '../constants';
import Spacer from '../components/Spacer';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/welcome-logo.png')}
      />
      <Spacer />
      <Text h3 style={styles.welcomeText}>Welcome to FansHome</Text>
      <Text h5 style={{ fontWeight: 'bold' }}>Use our app to find or sell the perfect home instantly</Text>
      <Spacer />
      <Button
        title='Log In'
        buttonStyle={{
          width: 250,
          padding: 10,
          backgroundColor: constants.MAIN_COLOR,
          borderRadius: 20,
          marginBottom: 10
        }}
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title='Sign Up'
        buttonStyle={{
          width: 250,
          padding: 10,
          backgroundColor: constants.MAIN_COLOR,
          borderRadius: 20
        }}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
};

WelcomeScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcomeText: {
    color: constants.MAIN_COLOR,
    marginBottom: 10
  }
});

export default WelcomeScreen;

