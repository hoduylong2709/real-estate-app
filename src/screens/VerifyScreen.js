import React, { useState, useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text, Button } from 'react-native-elements';
import * as constants from '../constants';
import OTPInputView from 'react-native-otp-textinput';
import Spinner from 'react-native-loading-spinner-overlay';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import ErrorModal from '../components/ErrorModal';

const VerifyScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(null);
  const { verify, clearErrorMessage, state: { loading, errorMessage } } = useContext(AuthContext);

  const id = navigation.getParam('id');

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={clearErrorMessage}
        onDidBlur={clearErrorMessage}
      />
      <Text h3 style={{ color: constants.MAIN_COLOR }}>Verification</Text>
      <Spacer />
      <Text h5>Please type the verifying code we send to your email</Text>
      <Spacer />
      <Image
        source={require('../../assets/send-email.png')}
      />
      <Text h5 style={{ fontWeight: 'bold' }}>{navigation.getParam('phoneNumber')}</Text>
      <Spacer />
      <OTPInputView
        inputCount={5}
        handleTextChange={setOtp}
      />
      <Spacer />
      <Button
        title='Verify'
        buttonStyle={styles.button}
        onPress={() => verify(id, otp)}
      />
      <Spinner
        visible={loading}
      />
      <ErrorModal
        isError={errorMessage ? true : false}
        hideModal={clearErrorMessage}
        text={errorMessage}
      />
    </View>
  );
};

VerifyScreen.navigationOptions = () => {
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
    backgroundColor: 'white',
    paddingBottom: 80
  },
  button: {
    width: 250,
    padding: 10,
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 20
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default VerifyScreen;

