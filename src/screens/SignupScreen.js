import React, { useState, useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text, Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import * as constants from '../constants';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import CustomModal from './../components/CustomModal';

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, clearErrorMessage, state: { errorMessage, loading } } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={clearErrorMessage}
        onDidBlur={clearErrorMessage}
      />
      <Text h2 style={{ color: constants.MAIN_COLOR }}>Create new account</Text>
      <Spacer />
      <Image
        source={require('../../assets/add-user.png')}
      />
      <Spacer />
      <Input
        placeholder='First name'
        value={firstName}
        onChangeText={setFirstName}
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='Last name'
        value={lastName}
        onChangeText={setlastName}
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='E-mail address'
        value={email}
        onChangeText={setEmail}
        inputContainerStyle={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
      />
      <Input
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
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
        onPress={() => signup({ firstName, lastName, email, password })}
      />
      <Spacer />
      <Text style={{ fontSize: 11, fontWeight: 'bold' }}>By creating an account you agree with our Terms of Use</Text>
      <Spinner
        visible={loading}
      />
      <CustomModal
        isError={errorMessage ? true : false}
        hideModal={clearErrorMessage}
        text={errorMessage}
      />
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

