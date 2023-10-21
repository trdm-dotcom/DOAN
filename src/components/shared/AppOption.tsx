import React, {useContext} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {AppContext} from '../../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../../constants/Constants';
import {space, styles} from '../../components/style';

type OptionProps = {
  label: string;
  iconName: string;
  color?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const AppOption = ({label, iconName, color, children, style}: OptionProps) => {
  const {theme} = useContext(AppContext);

  return (
    <View
      style={[
        styles(theme).row,
        styles(theme).appOptions,
        space(IconSizes.x5).ph,
        space(IconSizes.x3).pv,
        style,
      ]}>
      <View style={[styles(theme).row]}>
        <Ionicons
          name={iconName}
          size={IconSizes.x6}
          color={color || theme.text01}
        />
        <Text
          style={[
            styles(theme).labelOption,
            {color: color || theme.text01},
            space(IconSizes.x1).ml,
          ]}>
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
};

export default AppOption;
