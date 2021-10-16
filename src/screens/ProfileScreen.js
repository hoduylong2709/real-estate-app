import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as AuthContex } from '../context/AuthContext';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ProfileScreen;

