/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {NativeImage} from '../shared/NativeImage';
import {ThemeColors} from '../../constants/Types';
import {useAppSelector} from '../../reducers/redux/store';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {useAppNavigation} from '../../navigators/AppReactNavigation';

const {FontWeights, FontSizes} = Typography;

type UserCardProps = {
  userId: number;
  avatar: string;
  handle: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress?: any;
};

const UserCard = ({
  userId,
  avatar,
  handle,
  name,
  onPress,
  style,
}: UserCardProps) => {
  const {theme} = useContext(AppContext);
  const user: IUserInfoResponse = useAppSelector(state => state.auth.userInfo);
  const navigation = useAppNavigation();

  const navigateToProfile = () => {
    if (userId === user.id) {
      return;
    }
    navigation.navigate('Profile', {userId: userId});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress || navigateToProfile}
      style={[styles().container, style]}>
      <NativeImage uri={avatar} style={styles(theme).avatarImage} />
      <View style={styles().info}>
        <Text style={styles(theme).handleText}>{handle}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles(theme).nameText}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
      width: '100%',
    },
    avatarImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
      backgroundColor: theme.placeholder,
    },
    info: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 10,
    },
    handleText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
    nameText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 5,
    },
  });

export default UserCard;
