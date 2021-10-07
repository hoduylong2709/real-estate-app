import React, { useContext } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Text, Input, Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as constants from '../constants';
import * as validationSchema from '../validationSchema';
import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import CustomModal from './../components/CustomModal';

const SignupScreen = () => {
  const { signup, clearErrorMessage, state: { errorMessage, loading } } = useContext(AuthContext);

  return (
    <ScrollView>
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
        <Formik
          validationSchema={validationSchema.signupValidationSchema}
          initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
          onSubmit={values => signup(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
            <>
              <Input
                placeholder='First name'
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                inputContainerStyle={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
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
                autoCapitalize='none'
                autoCorrect={false}
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
                autoCapitalize='none'
                autoCorrect={false}
              />
              {errors.email && touched.email &&
                <Text style={styles.errorText}>{errors.email}</Text>
              }
              <Input
                placeholder='Password'
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                inputContainerStyle={styles.input}
                secureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
              />
              {errors.password && touched.password &&
                <Text style={styles.errorText}>{errors.password}</Text>
              }
              <Text style={styles.passwordRequirement}>*Password must have at least eight characters, one letter and one number</Text>
              <Spacer />
              <Button
                title='Create'
                buttonStyle={styles.button}
                onPress={handleSubmit}
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
        <Spacer />
        <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 10 }}>By creating an account you agree with our Terms of Use</Text>
        <Spinner
          visible={loading}
        />
        <CustomModal
          isError={errorMessage ? true : false}
          hideModal={clearErrorMessage}
          text={errorMessage}
        />
      </View>
    </ScrollView>
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
  },
  errorText: {
    fontSize: 12,
    color: 'red'
  }
});

export default SignupScreen;

