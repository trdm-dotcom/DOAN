import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppContext} from '../../context';
import {ThemeColors} from '../../constants/Types';
import {NativeImage} from '../shared/NativeImage';

type ChatHeaderAvatarProps = {
  avatar: string;
  onPress: () => void;
};

const ChatHeaderAvatar = ({avatar, onPress}: ChatHeaderAvatarProps) => {
  const {theme} = useContext(AppContext);

  return (
    <TouchableOpacity
      style={styles().container}
      activeOpacity={0.9}
      onPress={onPress}>
      <NativeImage uri={avatar} style={styles(theme).tinyImage} />
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      marginLeft: 10,
      borderRadius: 40,
    },
    tinyImage: {
      height: 40,
      width: 40,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
    },
  });

export default ChatHeaderAvatar;
