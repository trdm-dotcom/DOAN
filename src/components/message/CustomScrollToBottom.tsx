import React from 'react';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomScrollToBottom = () => (
  <Ionicons
    name="chevron-down-outline"
    color={ThemeStatic.black}
    size={IconSizes.x4}
  />
);

export default CustomScrollToBottom;
