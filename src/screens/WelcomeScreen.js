import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';

const WelcomeScreen = () => {
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
          backgroundColor: '#43AB8A',
          borderRadius: 20,
          marginBottom: 10
        }}
      />
      <Button
        title='Sign Up'
        buttonStyle={{
          width: 250,
          padding: 10,
          backgroundColor: '#43AB8A',
          borderRadius: 20
        }}
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
    color: '#43AB8A',
    marginBottom: 10
  }
});

export default WelcomeScreen;

