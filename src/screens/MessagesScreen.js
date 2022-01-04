import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import { Swipeable } from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome } from '@expo/vector-icons';
import Conversation from '../components/Conversation';
import RenderRight from '../components/RenderRight';
import { Context as ConversationContext } from '../context/ConversationContext';
const { width } = Dimensions.get('screen');

const MessagesScreen = ({ navigation }) => {
  const [userObj, setUserObj] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState('');
  const { state: { conversations, loading }, fetchConversations, deleteConversation } = useContext(ConversationContext);

  const handlePressTrashIcon = convId => {
    setSelectedConvId(convId);
    setConfirmationModalVisible(true);
  };

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
      <Spinner
        visible={loading}
      />
      {
        conversations.length === 0 &&
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <FontAwesome name='list-ul' size={20} color='grey' />
          <Text style={{ fontSize: 14, color: 'grey', fontWeight: 'bold' }}>No contacts found</Text>
        </View>
      }
      {
        userObj &&
        <FlatList
          data={conversations}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <View style={{ width: width - 40, marginTop: 20 }}>
                <Swipeable
                  renderRightActions={(progress, dragX) => <RenderRight progress={progress} dragX={dragX} pressTrashIcon={() => handlePressTrashIcon(item._id)} />}
                  overshootRight={false}
                >
                  <TouchableOpacity
                    key={item._id}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Chat', {
                      friend: item.members.find(member => member._id !== userObj._id),
                      currentUser: userObj,
                      conversation: item
                    })}
                  >
                    <Conversation
                      conversation={item}
                      friend={item.members.find(member => member._id !== userObj._id)}
                      currentUser={userObj}
                    />
                  </TouchableOpacity>
                </Swipeable>
              </View>
            );
          }}
        />
      }
      <AwesomeAlert
        show={isConfirmationModalVisible}
        title='Confirmation'
        message='You want to delete this conversation?'
        closeOnTouchOutside={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText='No, cancel'
        confirmText='Yes, delete it'
        confirmButtonColor='#DD6B55'
        onCancelPressed={() => setConfirmationModalVisible(false)}
        onConfirmPressed={() => {
          setConfirmationModalVisible(false);
          deleteConversation(selectedConvId);
          setSelectedConvId('');
        }}
      />
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

