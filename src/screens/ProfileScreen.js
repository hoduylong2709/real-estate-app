import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { AntDesign, FontAwesome, MaterialCommunityIcons, Octicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Context as AuthContex } from '../context/AuthContext';
import * as constants from '../constants';
import { Context as UserContext } from '../context/UserContext';
import ProfileOption from '../components/ProfileOption';
import Spacer from './../components/Spacer';
import AvatarImageModal from '../components/AvatarImageModal';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContex);
  const { deleteAvatar, postAvatar } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    (async () => {
      const userJson = await AsyncStorage.getItem('userInfo');
      const userObj = JSON.parse(userJson);
      setFirstName(userObj.firstName);
      setLastName(userObj.lastName);
      setAvatar(userObj.avatar);
    })();
  }, []);

  const uploadAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permission to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      postAvatar(result.uri);
      setAvatarModalVisible(false);
    }
  };

  const openAvatarModal = () => {
    setAvatarModalVisible(true);
  };

  const removeAvatar = async () => {
    if (avatar) {
      deleteAvatar();
    }
    setSelectedImage(null);
    setAvatarModalVisible(false);
    setAvatar('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={openAvatarModal}
      >
        {selectedImage ? <Avatar
          rounded
          source={{ uri: selectedImage }}
          size={100}
        /> : (avatar ? <Avatar
          rounded
          source={{ uri: `data:image/png;base64,${avatar}` }}
          size={100}
        /> : <Avatar
          rounded
          source={require('../../assets/user.png')}
          size={100}
        />)}
        <AntDesign
          name='camera'
          size={22}
          color='grey'
          style={{ position: 'absolute', right: 10, bottom: 0, zIndex: 1 }}
        />
      </TouchableOpacity>
      {firstName && lastName ? <Text style={{ fontSize: 18, margin: 15 }}>{firstName} {lastName}</Text> : null}
      <Spacer />
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <ProfileOption
            optionName='My Listings'
            icon={<FontAwesome name='list' size={20} color='rgb(203, 195, 227)' />}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <ProfileOption
            optionName='My Favorites'
            icon={<AntDesign name='heart' size={20} color='rgb(169, 92, 104)' />}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <ProfileOption
            optionName='Account Details'
            icon={<MaterialCommunityIcons name='account-cog' size={20} color='rgb(93, 63, 211)' />}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <ProfileOption
            optionName='Settings'
            icon={<Octicons name='gear' size={20} color='grey' />}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity
          activeOpacity={0.5}
        >
          <ProfileOption
            optionName='Contact Us'
            icon={<Feather name='phone-call' size={20} color={constants.MAIN_COLOR} />}
          />
        </TouchableOpacity>
      </View>
      <Spacer />
      <Button
        title='Logout'
        onPress={logout}
        buttonStyle={styles.logoutButton}
        titleStyle={{ color: 'white' }}
      />
      <AvatarImageModal
        isModalVisible={isAvatarModalVisible}
        closeModal={() => setAvatarModalVisible(false)}
        changeAvatar={uploadAvatar}
        removeAvatar={removeAvatar}
      />
    </View>
  );
};

ProfileScreen.navigationOptions = () => {
  return {
    tabBarLabel: () => { return null },
    tabBarIcon: ({ focused }) => <MaterialCommunityIcons name='account' size={constants.TAB_BAR_ICON_SIZE} color={focused ? constants.MAIN_COLOR : 'grey'} />
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  logoutButton: {
    width: Dimensions.get('window').width * 0.85,
    marginTop: 20
  }
});

export default ProfileScreen;

