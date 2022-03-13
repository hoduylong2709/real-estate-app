import React, { useState, useContext, useEffect } from 'react';
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
import socket from '../../socket';
const { width } = Dimensions.get('screen');

const MessagesScreen = ({ navigation }) => {
  const [userObj, setUserObj] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { state: { conversations, loading }, fetchConversations, deleteConversation } = useContext(ConversationContext);

  useEffect(() => {
    let isMounted = true;
    socket.emit('getUsers');
    socket.on('getUsers', users => {
      if (isMounted) {
        setOnlineUsers(users);
      }
    });
    socket.on('getMessage', message => {
      if (isMounted) {
        if (navigation.isFocused()) {
          setArrivalMessage({ ...message, isRead: false });
        } else {
          if (message.previousRoute === 'chatFlow') {
            setArrivalMessage({ ...message, isRead: true });
          } else {
            setArrivalMessage({ ...message, isRead: false });
          }
        }
      }
    });
    return () => { isMounted = false };
  }, []);

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
                    onPress={() => {
                      setArrivalMessage(null);
                      navigation.navigate('Chat', {
                        friend: item.members.find(member => member._id !== userObj._id),
                        currentUser: userObj,
                        conversation: item,
                        onlineUsers
                      })
                    }}
                  >
                    <Conversation
                      friend={item.members.find(member => member._id !== userObj._id)}
                      currentUser={userObj}
                      onlineUsers={onlineUsers}
                      lastMessage={
                        arrivalMessage && item.members.find(member => member._id !== userObj._id)._id === arrivalMessage.user._id ?
                          { ...arrivalMessage, senderId: arrivalMessage.user._id } :
                          item.lastMessage
                      }
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

