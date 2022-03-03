import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as constants from '../constants';
import * as validationSchema from '../validationSchema';
import Spacer from '../components/Spacer';
import { Context as UserContext } from '../context/UserContext';
import ErrorModal from '../components/ErrorModal';

const ChangeMyPasswordScreen = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const { state: { loading, errorMessage }, changeMyPassword, clearErrorMessage } = useContext(UserContext);

  const eyeIcon1 = <Ionicons name='eye' size={24} color={constants.MAIN_COLOR} onPress={() => setShowCurrentPassword(false)} />;
  const eyeOffIcon1 = <Ionicons name='eye-off' size={24} color={constants.MAIN_COLOR} onPress={() => setShowCurrentPassword(true)} />;

  const eyeIcon2 = <Ionicons name='eye' size={24} color={constants.MAIN_COLOR} onPress={() => setShowNewPassword(false)} />;
  const eyeOffIcon2 = <Ionicons name='eye-off' size={24} color={constants.MAIN_COLOR} onPress={() => setShowNewPassword(true)} />;

  const eyeIcon3 = <Ionicons name='eye' size={24} color={constants.MAIN_COLOR} onPress={() => setShowConfirmNewPassword(false)} />;
  const eyeOffIcon3 = <Ionicons name='eye-off' size={24} color={constants.MAIN_COLOR} onPress={() => setShowConfirmNewPassword(true)} />;

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: constants.MAIN_COLOR }}>Change Password</Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#AEAEAE', marginTop: 10 }}>
          Please write your new password. Password must have at least eight characters, one letter and one number
        </Text>
      </View>
      <Spacer />
      <Formik
        validationSchema={validationSchema.changeMyPasswordSchema}
        initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
        onSubmit={values => changeMyPassword(values.currentPassword, values.newPassword)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <>
            {errors.currentPassword && touched.currentPassword &&
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            }
            <Input
              placeholder='Current Password'
              value={values.currentPassword}
              onChangeText={handleChange('currentPassword')}
              onBlur={handleBlur('currentPassword')}
              inputContainerStyle={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}
              inputStyle={{ fontSize: 16 }}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showCurrentPassword}
              rightIcon={
                showCurrentPassword ?
                  eyeIcon1 :
                  eyeOffIcon1
              }
            />
            {errors.newPassword && touched.newPassword &&
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            }
            <Input
              placeholder='New Password'
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              inputContainerStyle={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}
              inputStyle={{ fontSize: 16 }}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showNewPassword}
              rightIcon={
                showNewPassword ?
                  eyeIcon2 :
                  eyeOffIcon2
              }
            />
            {errors.confirmNewPassword && touched.confirmNewPassword &&
              <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>
            }
            <Input
              placeholder='Confirm Password'
              value={values.confirmNewPassword}
              onChangeText={handleChange('confirmNewPassword')}
              onBlur={handleBlur('confirmNewPassword')}
              inputContainerStyle={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}
              inputStyle={{ fontSize: 16 }}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showConfirmNewPassword}
              rightIcon={
                showConfirmNewPassword ?
                  eyeIcon3 :
                  eyeOffIcon3
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

ChangeMyPasswordScreen.navigationOptions = () => {
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

export default ChangeMyPasswordScreen;
