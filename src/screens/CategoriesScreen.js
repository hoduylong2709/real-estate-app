import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as constants from '../constants';

const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Categories Screen</Text>
    </View>
  );
};

CategoriesScreen.navigationOptions = {
  tabBarLabel: () => { return null },
  tabBarIcon: ({ focused }) => <Ionicons name='filter-sharp' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default CategoriesScreen;

