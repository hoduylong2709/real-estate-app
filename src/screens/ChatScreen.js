import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatScreen = () => {
  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  );
};

ChatScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({});

export default ChatScreen;

