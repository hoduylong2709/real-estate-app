import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DetailListingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Detail Listing Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DetailListingScreen;

