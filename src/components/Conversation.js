import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import moment from 'moment';

const Conversation = ({ friend, onlineUsers, lastMessage, currentUser }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setIsOnline(
        onlineUsers.some(onlineUser => onlineUser.userId === friend._id)
      );
    }
    return () => { isMounted = false };
  }, [onlineUsers]);

  return (
    <View style={styles.container}>
      <View style={{ position: 'relative' }}>
        <Avatar
          size={47}
          rounded
          source={friend.avatar ? { uri: friend.avatar } : require('../../assets/user.png')}
        />
        <View style={isOnline ? styles.onlineIcon : { ...styles.onlineIcon, backgroundColor: '#AEAEAE' }}></View>
      </View>
      <View style={styles.conversationInfo}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={lastMessage.isRead || lastMessage.senderId === currentUser._id ? { fontSize: 18, color: 'gray' } : { fontSize: 18, fontWeight: 'bold', color: 'black' }}>{friend.firstName} {friend.lastName}</Text>
          <Text style={lastMessage.isRead || lastMessage.senderId === currentUser._id ? { fontSize: 10, fontWeight: 'bold', color: 'gray' } : { fontSize: 10, fontWeight: 'bold', color: 'black' }}>
            {moment(lastMessage?.createdAt).format('DD/MM/yyyy')}
          </Text>
        </View>
        <Text
          style={lastMessage.isRead || lastMessage.senderId === currentUser._id ? { fontSize: 13, color: 'gray' } : { fontSize: 14, color: 'black', fontWeight: 'bold' }}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {lastMessage?.senderId === friend._id ? `${friend.firstName}: ` : 'You: '}
          {lastMessage?.text ? lastMessage?.text : 'sent an image.'}
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
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: '#32CD32',
    position: 'absolute',
    top: 1,
    right: 3
  },
  conversationInfo: {
    marginLeft: 10,
    width: 260
  }
});

export default Conversation;

