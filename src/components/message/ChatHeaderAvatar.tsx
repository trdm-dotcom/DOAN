import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppContext} from '../../context';
import UserAvatar from 'react-native-user-avatar';

const ChatHeaderAvatar = ({avatar, name, onPress}) => {
  const {theme} = useContext(AppContext);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}>
      <UserAvatar
        size={40}
        name={name}
        src={avatar}
        bgColor={theme.placeholder}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginLeft: 10,
    borderRadius: 40,
  },
  avatarImage: {
    flex: 1,
  },
});

export default ChatHeaderAvatar;
