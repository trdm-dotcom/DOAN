import React, {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../../constants/Constants';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type OptionProps = {
  label?: string;
  iconName: string;
  onPress?: () => void;
  children?: any;
  color?: string;
};

const Option = ({label, iconName, onPress, children, color}: OptionProps) => {
  const {theme} = useContext(AppContext);

  if (children) {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8,
          },
        ]}>
        <Ionicons
          name={iconName}
          size={IconSizes.x6}
          color={color || theme.text01}
        />
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: IconSizes.x1,
        },
      ]}
      activeOpacity={0.9}
      onPress={onPress}>
      <Ionicons
        name={iconName}
        size={IconSizes.x6}
        color={color || theme.text01}
      />
      <Text
        style={[
          {
            ...FontWeights.Regular,
            ...FontSizes.Body,
            marginLeft: 10,
          },
          {color: color || theme.text01},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Option;
