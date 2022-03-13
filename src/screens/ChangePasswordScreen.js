import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { Context as AuthContext } from '../context/AuthContext';
import * as constants from '../constants';
import Spacer from '../components/Spacer';
import * as validationSchema from '../validationSchema';
import ErrorModal from '../components/ErrorModal';

const ChangePasswordScreen = ({ navigation }) => {
  const email = navigation.getParam('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state: { loading, errorMessage }, changePassword, clearErrorMessage } = useContext(AuthContext);

  const eyeIcon1 = <Ionicons name='eye' size={24} color={constants.MAIN_COLOR} onPress={() => setShowPassword(false)} />;
  const eyeOffIcon1 = <Ionicons name='eye-off' size={24} color={constants.MAIN_COLOR} onPress={() => setShowPassword(true)} />;

  const eyeIcon2 = <Ionicons name='eye' size={24} color={constants.MAIN_COLOR} onPress={() => setShowConfirmPassword(false)} />;
  const eyeOffIcon2 = <Ionicons name='eye-off' size={24} color={constants.MAIN_COLOR} onPress={() => setShowConfirmPassword(true)} />;

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: constants.MAIN_COLOR }}>New Password</Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#AEAEAE', marginTop: 10 }}>
          Please write your new password. Password must have at least eight characters, one letter and one number
        </Text>
      </View>
      <Spacer />
      <Formik
        validationSchema={validationSchema.changePasswordSchema}
        initialValues={{ password: '', confirmPassword: '' }}
        onSubmit={values => changePassword(email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <>
            {errors.password && touched.password &&
              <Text style={styles.errorText}>{errors.password}</Text>
            }
            <Input
              placeholder='Password'
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              inputContainerStyle={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}
              inputStyle={{ fontSize: 16 }}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showPassword}
              rightIcon={
                showPassword ?
                  eyeIcon1 :
                  eyeOffIcon1
              }
            />
            {errors.confirmPassword && touched.confirmPassword &&
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            }
            <Input
              placeholder='Confirm Password'
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              inputContainerStyle={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}
              inputStyle={{ fontSize: 16 }}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                showConfirmPassword ?
                  eyeIcon2 :
                  eyeOffIcon2
              }
            />
            <Button
              title='Confirm'
              disabled={!isValid}
              onPress={handleSubmit}
              containerStyle={{
                marginTop: 10,
                width: '100%'
              }}
              buttonStyle={{
                padding: 10,
                backgroundColor: constants.MAIN_COLOR,
                borderRadius: 15,
                marginHorizontal: 20
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

ChangePasswordScreen.navigationOptions = () => {
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
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingTop: 30
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginHorizontal: 20
  }
});

export default ChangePasswordScreen;
