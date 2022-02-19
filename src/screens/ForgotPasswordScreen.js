import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';
import Spacer from '../components/Spacer';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/forgot_password.jpg')}
      />
      <Spacer />
      <Text style={{ fontSize: 21, fontWeight: 'bold' }}>Forgot password?</Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#AEAEAE', marginTop: 10, textAlign: 'center' }}>Please write your email to receive a confirmation code to set a new password</Text>
      <Spacer />
      <Input
        placeholder='Your e-mail'
        value={email}
        onChangeText={setEmail}
        leftIcon={
          <MaterialIcons name='email' size={24} color={constants.MAIN_COLOR} />
        }
        inputContainerStyle={{ marginHorizontal: 13 }}
        autoCapitalize='none'
        autoCorrect={false}
        keyboardType='email-address'
      />
      <Button
        title='Confirm'
        disabled={!email}
        containerStyle={{
          width: '90%',
          marginTop: 10
        }}
        buttonStyle={{
          padding: 10,
          backgroundColor: constants.MAIN_COLOR,
          borderRadius: 15
        }}
      />
    </View>
  );
};

ForgotPasswordScreen.navigationOptions = () => {
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

export default ForgotPasswordScreen;
