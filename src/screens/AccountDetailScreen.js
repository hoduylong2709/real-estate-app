import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as constants from '../constants';
import * as validationSchema from '../validationSchema';
import { Context as UserContext } from '../context/UserContext';

const AccountDetailScreen = ({ navigation }) => {
  const userObj = navigation.getParam('userObj');
  const { editProfile, state: { loading } } = useContext(UserContext);

  const initialValues = {
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    phoneNumber: userObj.phoneNumber?.toString() || ''
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
      />
      <Formik
        validationSchema={validationSchema.profileValidationSchema}
        initialValues={initialValues}
        onSubmit={values => {
          const { firstName, lastName, phoneNumber } = { ...values };
          const changes = {};

          if (firstName !== initialValues.firstName) {
            changes.firstName = firstName;
          }
          if (lastName !== initialValues.lastName) {
            changes.lastName = lastName;
          }
          if (phoneNumber !== initialValues.phoneNumber) {
            changes.phoneNumber = phoneNumber;
          }

          editProfile(changes);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, dirty }) => (
          <>
            <Input
              placeholder='First name'
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              inputContainerStyle={styles.input}
              inputStyle={{ fontSize: 17 }}
              autoCapitalize='none'
              autoCorrect={false}
              label='First name'
              labelStyle={[styles.label, { marginTop: 15 }]}
            />
            {errors.firstName && touched.firstName &&
              <Text style={styles.errorText}>{errors.firstName}</Text>
            }
            <Input
              placeholder='Last name'
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              inputContainerStyle={styles.input}
              inputStyle={{ fontSize: 17 }}
              autoCapitalize='none'
              autoCorrect={false}
              label='Last name'
              labelStyle={styles.label}
            />
            {errors.lastName && touched.lastName &&
              <Text style={styles.errorText}>{errors.lastName}</Text>
            }
            <Input
              placeholder='E-mail address'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              inputContainerStyle={styles.input}
              inputStyle={{ fontSize: 17 }}
              autoCapitalize='none'
              autoCorrect={false}
              disabled
              label='Email'
              labelStyle={styles.label}
            />
            <Input
              placeholder='Phone number'
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              inputContainerStyle={styles.input}
              inputStyle={{ fontSize: 17 }}
              autoCapitalize='none'
              autoCorrect={false}
              label='Phone number'
              labelStyle={styles.label}
              keyboardType='numeric'
            />
            <Button
              title='Done'
              buttonStyle={styles.button}
              onPress={handleSubmit}
              disabled={!(isValid && dirty)}
            />
          </>
        )}
      </Formik>
    </View>
  );
};

AccountDetailScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    },
    title: 'Edit Profile'
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  input: {
    marginHorizontal: 17
  },
  button: {
    width: 300,
    padding: 10,
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 20
  },
  errorText: {
    fontSize: 12,
    color: 'red'
  },
  label: {
    marginLeft: 17,
    fontSize: 14
  }
});

export default AccountDetailScreen;

