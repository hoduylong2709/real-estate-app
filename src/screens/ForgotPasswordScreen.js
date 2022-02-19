import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { Context as AuthContext } from '../context/AuthContext';
import * as constants from '../constants';
import * as validationSchema from '../validationSchema';
import Spacer from '../components/Spacer';
import ErrorModal from '../components/ErrorModal';

const ForgotPasswordScreen = () => {
  const { state: { loading, errorMessage }, forgotPassword, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/forgot_password.jpg')}
      />
      <Spacer />
      <Text style={{ fontSize: 21, fontWeight: 'bold' }}>Forgot password?</Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#AEAEAE', marginTop: 10, textAlign: 'center' }}>Please write your email to receive a confirmation code to set a new password</Text>
      <Spacer />
      <Formik
        validationSchema={validationSchema.forgotPasswordSchema}
        initialValues={{ email: '' }}
        onSubmit={values => forgotPassword(values.email)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <>
            <Input
              placeholder='Your e-mail'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              leftIcon={
                <MaterialIcons name="email" size={24} color={constants.MAIN_COLOR} />
              }
              inputContainerStyle={{ marginLeft: 13, marginRight: 13 }}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
            />
            {errors.email && touched.email &&
              <Text style={styles.errorText}>{errors.email}</Text>
            }
            <Button
              title='Confirm'
              disabled={!isValid}
              onPress={handleSubmit}
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
          </>
        )}
      </Formik>
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
  },
  errorText: {
    fontSize: 12,
    color: 'red'
  }
});

export default ForgotPasswordScreen;
