import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import * as constants from '../constants';
import { Entypo } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import Spacer from '../components/Spacer';

const PhoneNumberInputScreen = ({ navigation }) => {
  const [value, setValue] = useState('');
  const [valid, setValid] = useState(true);
  const phoneInput = useRef(null);

  const sendButtonHandler = () => {
    const checkValid = phoneInput.current?.isValidNumber(value);

    if (checkValid) {
      setValid(true);
      navigation.navigate('OTPVerification', { phoneNumber: value });
    } else {
      setValid(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={{ color: constants.MAIN_COLOR }}>Send OTP Code</Text>
      <Spacer />
      <Entypo name="tablet-mobile-combo" size={60} color={constants.MAIN_COLOR} />
      <Spacer>
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Please enter your personal phone number</Text>
      </Spacer>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="IN"
        onChangeFormattedText={(text) => {
          setValue(text);
        }}
        containerStyle={{ borderRadius: 20 }}
        textContainerStyle={{ borderRadius: 20 }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <Spacer>
        {!valid ? <Text style={styles.invalidMessage}>Phone number is invalid! Please try again</Text> : null}
      </Spacer>
      <Button
        title='Send'
        buttonStyle={styles.button}
        onPress={sendButtonHandler}
      />
    </View>
  );
};

PhoneNumberInputScreen.navigationOptions = () => {
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
  invalidMessage: {
    fontSize: 12,
    color: 'red'
  }
});

export default PhoneNumberInputScreen;

