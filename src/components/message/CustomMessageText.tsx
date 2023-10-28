import React from 'react';
import {StyleSheet} from 'react-native';
import {MessageText} from 'react-native-gifted-chat';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

const CustomMessageText = messageTextProps => (
  <MessageText
    {...messageTextProps}
    textStyle={{
      left: styles.left,
      right: styles.right,
    }}
  />
);

const styles = StyleSheet.create({
  left: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    color: ThemeStatic.black,
  },
  right: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    color: ThemeStatic.white,
  },
});

export default CustomMessageText;
