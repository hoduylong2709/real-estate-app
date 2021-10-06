import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title='Log out'
        onPress={() => logout()}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;

