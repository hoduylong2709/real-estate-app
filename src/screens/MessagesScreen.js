import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import Conversation from '../components/Conversation';
import { Context as ConversationContext } from '../context/ConversationContext';
const { width } = Dimensions.get('screen');

const MessagesScreen = ({ navigation }) => {
  const [userObj, setUserObj] = useState(null);
  const { state, fetchConversations } = useContext(ConversationContext);

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          (async () => {
            const userJson = await AsyncStorage.getItem('userInfo');
            const userObj = JSON.parse(userJson);
            setUserObj(userObj);
            fetchConversations(userObj._id);
          })();
        }}
      />
      {
        userObj &&
        <FlatList
          data={state}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity
                  key={item._id}
                  activeOpacity={0.7}
                  style={{ width: width - 40, marginTop: 20 }}
                  onPress={() => navigation.navigate('Chat')}
                >
                  <Conversation
                    conversation={item}
                    friend={item.members.find(member => member._id !== userObj._id)}
                    currentUser={userObj}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      }
    </View>
  );
};

MessagesScreen.navigationOptions = () => {
  return {
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default MessagesScreen;

