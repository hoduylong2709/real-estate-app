import React, { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Avatar, Button } from 'react-native-elements';
import { AntDesign, FontAwesome, MaterialCommunityIcons, Octicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Context as AuthContex } from '../context/AuthContext';
import * as constants from '../constants';
import { Context as UserContext } from '../context/UserContext';
import ProfileOption from '../components/ProfileOption';
import Spacer from './../components/Spacer';
import AvatarImageModal from '../components/AvatarImageModal';

const ProfileScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContex);
  const { deleteAvatar, postAvatar, state: { loading } } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [publicIdCloudinary, setPublicIdCloudinary] = useState('');

  const uploadAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permission to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setAvatar(result.uri);
      postAvatar(result.uri);
      setAvatarModalVisible(false);
    }
  };

  const openAvatarModal = () => {
    setAvatarModalVisible(true);
  };

  const removeAvatar = () => {
    if (avatar) {
      deleteAvatar(publicIdCloudinary);
    }
    setSelectedImage(null);
    setAvatarModalVisible(false);
    setAvatar('');
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => {
        (async () => {
          const userJson = await AsyncStorage.getItem('userInfo');
          const userObj = JSON.parse(userJson);
          setFirstName(userObj.firstName);
          setLastName(userObj.lastName);
          if (userObj.avatar) {
            setAvatar(userObj.avatar);
            setPublicIdCloudinary(userObj.publicIdCloudinary);
          }
        })();
      }} />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={openAvatarModal}
        style={styles.avatarContainer}
      >
        {
          loading &&
          <View style={styles.loading}>
            <ActivityIndicator size='small' color='white' />
          </View>
        }
        {selectedImage ? <Avatar
          rounded
          source={{ uri: selectedImage }}
          size={100}
        /> : (avatar ? (<Avatar
          rounded
          source={{ uri: avatar }}
          size={100}
        />
        ) : <Avatar
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
          onPress={() => navigation.navigate('MyListing')}
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
    title: 'My Profile',
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
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: 'white'
  },
  logoutButton: {
    width: Dimensions.get('window').width * 0.85,
    marginTop: 20,
    backgroundColor: constants.MAIN_COLOR,
    borderRadius: 20
  },
  avatarContainer: {
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
    height: '100%',
    width: '27.5%',
    justifyContent: 'center',
    borderRadius: 53
  },
});

export default ProfileScreen;

