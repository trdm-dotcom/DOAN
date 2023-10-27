import React, {ReactNode, useContext} from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {AppContext} from '../../context';
import {NativeImage} from '../shared/NativeImage';
import {useAppSelector} from '../../reducers/redux/store';
import {space, styles} from '../style';
import {useNavigation} from '@react-navigation/native';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {IconSizes} from '../../constants/Constants';

type UserCardProps = {
  userId: number;
  avatar: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress?: any;
  childen?: ReactNode;
};

const UserCard = ({
  userId,
  avatar,
  name,
  onPress,
  style,
  childen,
}: UserCardProps) => {
  const {theme} = useContext(AppContext);
  const user: IUserInfoResponse = useAppSelector(state => state.auth.userInfo);
  const navigation = useNavigation();

  const navigateToProfile = () => {
    if (userId === user.id) {
      return;
    }
    navigation.navigate('Profile', {user: userId});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress || navigateToProfile}
      style={[styles(theme).userCardContainer, style]}>
      <View style={[styles(theme).row]}>
        <NativeImage uri={avatar} style={styles(theme).tinyAvatar} />
        <Text style={[styles(theme).nameText, space(IconSizes.x1).ml]}>
          {name}
        </Text>
      </View>
      {childen}
    </TouchableOpacity>
  );
};

export default UserCard;
