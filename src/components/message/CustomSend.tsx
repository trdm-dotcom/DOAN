import React from 'react';
import {StyleSheet} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';

const CustomSend = sendProps => (
  <Send {...sendProps} containerStyle={styles.container}>
    <Ionicons
      name="paper-plane"
      size={IconSizes.x6}
      color={ThemeStatic.accent}
    />
  </Send>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default CustomSend;
