import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as AuthContex } from '../context/AuthContext';
import * as constants from '../constants';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContex);

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button
        title='Logout'
        onPress={logout}
      />
    </View>
  );
};

ProfileScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ProfileScreen;

