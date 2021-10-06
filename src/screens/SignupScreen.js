import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import * as constants from '../constants';
import Spacer from '../components/Spacer';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text h2 style={{ color: constants.MAIN_COLOR }}>Create new account</Text>
      <Spacer />
      <Image
        source={require('../../assets/add-user.png')}
      />
      <Spacer />
      <Input
        placeholder='First name'
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='Last name'
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='E-mail address'
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='Password'
        inputContainerStyle={styles.input}
        secureTextEntry
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Text style={styles.passwordRequirement}>*Password must have at least eight characters, one letter and one number</Text>
      <Spacer />
      <Button
        title='Create'
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('Verify')}
      />
      <Spacer />
      <Text style={{ fontSize: 11, fontWeight: 'bold' }}>By creating an account you agree with our Terms of Use</Text>
    </View>
  );
};

SignupScreen.navigationOptions = () => {
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
  },
  input: {
    marginLeft: 13,
    marginRight: 13
  },
  passwordRequirement: {
    marginLeft: 14,
    marginRight: 14,
    fontSize: 12
  },
  button: {
    width: 250,
    padding: 10,
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 20,
    marginBottom: 10
  }
});

export default SignupScreen;

