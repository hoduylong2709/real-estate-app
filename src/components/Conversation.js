import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import realEstateApi from '../api/realEstate';
import moment from 'moment';

const Conversation = ({ conversation, friend, currentUser }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let mounted = true;

    const getMessages = async () => {
      try {
        const response = await realEstateApi.get(`/messages/${conversation._id}`);
        if (mounted) {
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getMessages();

    return () => mounted = false;
  }, [currentUser, conversation]);

  return (
    <View style={styles.container}>
      <View style={{ position: 'relative' }}>
        <Avatar
          size={55}
          rounded
          source={{ uri: friend.avatar }}
        />
        <View style={styles.onlineIcon}></View>
      </View>
      <View style={styles.conversationInfo}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{friend.firstName} {friend.lastName}</Text>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'gray' }}>
            {moment(messages[messages.length - 1]?.createdAt).format('DD/MM/yyyy')}
          </Text>
        </View>
        <Text
          style={{ fontSize: 13, color: 'gray' }}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {messages[messages.length - 1]?.senderId === friend._id ? `${friend.firstName}: ` : 'You: '}
          {messages[messages.length - 1]?.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  onlineIcon: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#32CD32',
    position: 'absolute',
    top: 3,
    right: 5
  },
  conversationInfo: {
    marginLeft: 10,
    width: 230
  }
});

export default Conversation;

