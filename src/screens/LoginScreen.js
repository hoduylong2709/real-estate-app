import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text, Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import { Formik } from 'formik';
import * as constants from '../constants';
import * as validationSchema from '../validationSchema';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import ErrorModal from '../components/ErrorModal';

const LoginScreen = ({ navigation }) => {
  const { login, clearErrorMessage, state: { loading, errorMessage }, loginWithGoogle } = useContext(AuthContext);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleGoogleLogin = () => {
    setGoogleSubmitting(true);

    const config = {
      iosClientId: '977430966128-qj91b6b48ena0dc6nc7tffmqgiheke17.apps.googleusercontent.com',
      androidClientId: '977430966128-pp9g5nrlq86j4jrb4ra665q5t8lkmrku.apps.googleusercontent.com',
      scopes: ['profile', 'email']
    };

    Google
      .logInAsync(config)
      .then(result => {
        setGoogleSubmitting(false);
        const { type, user, idToken } = result;
        if (type === 'success') {
          loginWithGoogle({
            firstName: user.givenName,
            lastName: user.familyName,
            email: user.email,
            userId: user.id,
            idToken,
            avatar: user.photoUrl
          });
        } else {
          alert('Cannot login with Google account!');
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={clearErrorMessage}
        onDidBlur={clearErrorMessage}
      />
      <Text h2 style={{ color: constants.MAIN_COLOR }}>Log In</Text>
      <Spacer />
      <Image
        source={require('../../assets/log-in.png')}
      />
      <Spacer />
      <Formik
        validationSchema={validationSchema.loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={values => login(values)}
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
            <Input
              placeholder='Your password'
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              leftIcon={
                <Entypo name="lock" size={24} color={constants.MAIN_COLOR} />
              }
              inputContainerStyle={{ marginLeft: 13, marginRight: 13 }}
              secureTextEntry
              autoCapitalize='none'
              autoCorrect={false}
            />
            {errors.password && touched.password &&
              <Text style={styles.errorText}>{errors.password}</Text>
            }
            <TouchableOpacity
              style={{ width: '90%', alignItems: 'flex-end' }}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.6}
            >
              <Text style={{ fontWeight: 'bold', color: '#AEAEAE', fontSize: 13 }}>Forgot password?</Text>
            </TouchableOpacity>
            <Spacer />
            <Button
              title='Enter'
              onPress={handleSubmit}
              disabled={!isValid}
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
              onPress={handleGoogleLogin}
            />
          </>
        )}
      </Formik>
      <Spinner
        visible={loading || googleSubmitting}
      />
      <ErrorModal
        isError={errorMessage ? true : false}
        hideModal={clearErrorMessage}
        text={errorMessage}
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
  },
  errorText: {
    fontSize: 12,
    color: 'red'
  }
});

export default LoginScreen;

