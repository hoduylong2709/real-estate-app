import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { GiftedChat, Send, Actions, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import realEstateApi from '../api/realEstate';
import * as constants from '../constants';
import { messageIdGenerator } from '../utils/generateUuid';

const ChatScreen = ({ navigation }) => {
  const currentUser = navigation.getParam('currentUser');
  const conversation = navigation.getParam('conversation');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await realEstateApi.get(`/messages/${conversation._id}`);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [conversation]);

  const onSend = message => {
    setMessages(prev => [...message, ...prev]);
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
          const message = [{
            _id: messageIdGenerator(),
            createdAt: new Date(),
            user: {
              _id: currentUser._id,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              avatar: currentUser.avatar
            },
            image: result.uri,
          }];

          onSend(message);
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
        onSend={message => onSend(message)}
        user={{
          _id: currentUser._id,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          avatar: currentUser.avatar
        }}
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

