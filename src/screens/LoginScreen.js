import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import * as constants from '../constants';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Spacer from '../components/Spacer';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text h2 style={{ color: constants.MAIN_COLOR }}>Log In</Text>
      <Spacer />
      <Input
        placeholder='Your e-mail'
        leftIcon={
          <MaterialIcons name="email" size={24} color={constants.MAIN_COLOR} />
        }
        inputContainerStyle={{ marginLeft: 13, marginRight: 13 }}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='Your password'
        leftIcon={
          <Entypo name="lock" size={24} color={constants.MAIN_COLOR} />
        }
        inputContainerStyle={{ marginLeft: 13, marginRight: 13 }}
        secureTextEntry
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Spacer />
      <Button
        title='Enter'
        buttonStyle={{
          width: 250,
          padding: 10,
          backgroundColor: constants.MAIN_COLOR,
          borderRadius: 20,
          marginBottom: 10
        }}
      />
      <Spacer>
        <Text h5>OR</Text>
      </Spacer>
      <Button
        title='Log In with Google'
        buttonStyle={{
          width: 250,
          padding: 10,
          backgroundColor: '#e16259',
          borderRadius: 20,
          marginBottom: 10
        }}
        icon={<FontAwesome name="google" size={24} color="white" style={{ marginRight: 10 }} />}
      />
    </View>
  );
};

LoginScreen.navigationOptions = () => {
  return {
    headerStyle: {
      elevation: 0
    },
    headerTintColor: constants.MAIN_COLOR,
    title: ''
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default LoginScreen;

