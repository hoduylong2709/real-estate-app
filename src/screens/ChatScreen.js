import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { GiftedChat, Send, Actions, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import realEstateApi from '../api/realEstate';
import axios from 'axios';
import * as constants from '../constants';
import { messageIdGenerator } from '../utils/generateUuid';
import socket from '../../socket';

const ChatScreen = ({ navigation }) => {
  const currentUser = navigation.getParam('currentUser');
  const conversation = navigation.getParam('conversation');
  const friend = navigation.getParam('friend');
  const onlineUsers = navigation.getParam('onlineUsers');
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [noMessage, setNoMessage] = useState(false);
  const [oldestMessage, setOldestMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const parent = navigation.dangerouslyGetParent();
  const MESSAGE_LIMIT = 15;

  useEffect(() => {
    socket.on('getMessage', message => {
      if (navigation.isFocused()) {
        setArrivalMessage(message);
        const setMessageRead = async clientId => {
          const response = await realEstateApi.get(`/messages/message/${clientId}`);
          await realEstateApi.patch(`/messages/read/${response.data._id}`);
        };
        setMessageRead(message._id);
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages(prev => [arrivalMessage, ...prev]);
  }, [arrivalMessage]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        let response = null;
        setLoading(true);

        if (!oldestMessage) {
          response = await realEstateApi.get(`/messages/${conversation?._id}?limit=${MESSAGE_LIMIT}`);
          setMessages(response.data);
        } else {
          response = await realEstateApi.get(`/messages/${conversation?._id}?limit=${MESSAGE_LIMIT}&oldest=${oldestMessage._id}`);
          if (response.data.length !== 0) {
            setMessages(prev => [...prev, ...response.data]);
          } else {
            setNoMessage(true);
          }
        }
        setLoading(false);

        const friendMessage = response.data.filter(message => message.senderId._id !== currentUser._id);
        for (let i = 0; i < friendMessage.length; i++) {
          if (!friendMessage[i].isRead) {
            await realEstateApi.patch(`/messages/read/${friendMessage[i]._id}`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (conversation) {
      getMessages();
    }
  }, [conversation, oldestMessage]);

  const onSend = async messages => {
    setMessages(prev => [...messages, ...prev]);

    let imageUrl = '';

    if (messages[0].image) {
      const formData = new FormData();
      const file = {
        name: 'user_listing.jpg',
        uri: messages[0].image,
        type: 'image/jpg'
      };

      formData.append('file', file);
      formData.append('upload_preset', '_RealEstate');
      formData.append('cloud_name', 'longhoduy');
      formData.append('folder', 'Messages');

      const response = await axios.post('https://api.cloudinary.com/v1_1/longhoduy/image/upload', formData);
      imageUrl = response.data.url;
    }

    let messageToUpload = {
      clientId: messages[0]._id,
      senderId: messages[0]['user']._id,
      text: messages[0].text ? messages[0].text : '',
      image: messages[0].image ? imageUrl : '',
      video: messages[0].video ? messages[0].video : ''
    };

    if (!conversation) {
      const response = await realEstateApi.post('/conversations', {
        receiverId: friend._id
      });
      messageToUpload.conversationId = response.data._id;
    } else {
      messageToUpload.conversationId = conversation._id;
    }

    if (onlineUsers.some(onlineUser => onlineUser.userId === friend._id)) {
      if (messages[0].image) {
        socket.emit('sendMessage', { ...messages[0], receiverId: friend._id, image: imageUrl, previousRoute: parent.state.routeName });
      } else if (messages[0].video) {
        console.log('Emit sendMessage event with video');
      } else {
        socket.emit('sendMessage', { ...messages[0], receiverId: friend._id, previousRoute: parent.state.routeName });
      }
    }

    await realEstateApi.post('/messages', messageToUpload);
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permission to make this work!');
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1
        });

        if (!result.cancelled) {
          const messages = [{
            _id: messageIdGenerator(),
            createdAt: new Date(),
            user: {
              _id: currentUser._id,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              avatar: currentUser.avatar
            },
            image: result.uri,
          }];

          onSend(messages);
        }
      }
    }
  };

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      accessoryStyle={{ height: 200 }}
    />
  );

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: constants.MAIN_COLOR
        }
      }}
    />
  );

  const renderActions = props => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <AntDesign name='pluscircle' size={24} color={constants.MAIN_COLOR} />
      )}
      options={{
        'Choose From Library': () => {
          pickImage();
        },
        'Take photos from camera': () => {
          console.log('Take photos from camera');
        }
      }}
      optionTintColor="#222B45"
    />
  );

  const renderSend = props => (
    <Send
      {...props}
    >
      <View
        style={{ marginBottom: 7, marginRight: 10 }}
      >
        <Feather name='send' size={24} color={constants.MAIN_COLOR} />
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={
          messages.map(message => {
            if (message.senderId) {
              return {
                ...message,
                user: {
                  _id: message.senderId?._id,
                  name: `${message.senderId?.firstName} ${message.senderId?.lastName}`,
                  avatar: message.senderId?.avatar
                }
              };
            } else {
              return message;
            };
          })
        }
        inverted={true}
        showAvatarForEveryMessage={true}
        alwaysShowSend
        renderBubble={props => renderBubble(props)}
        renderSend={props => renderSend(props)}
        renderActions={props => renderActions(props)}
        renderInputToolbar={props => renderInputToolbar(props)}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser._id,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          avatar: currentUser.avatar
        }}
        listViewProps={{
          onEndReached: () => {
            if (!noMessage && !loading) {
              setOldestMessage(messages[messages.length - 1]);
            }
          }
        }}
        scrollToBottom={true}
        onPressAvatar={() => navigation.navigate('OtherProfile', { user: friend })}
      />
    </View>
  );
};

ChatScreen.navigationOptions = ({ navigation }) => {
  const friend = navigation.getParam('friend');

  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    title: `${friend.firstName} ${friend.lastName}`,
    headerRight: () => (
      <View style={styles.headerRight}>
        <TouchableOpacity
          activeOpacity={0.6}
        >
          <Ionicons name='call' size={21} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
        >
          <FontAwesome name='video-camera' size={21} color={constants.MAIN_COLOR} />
        </TouchableOpacity>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEDE7'
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    marginRight: 15
  }
});

export default ChatScreen;

