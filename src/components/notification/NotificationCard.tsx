import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {parseTimeElapsed} from '../../utils/shared';
import {ThemeColors} from '../../constants/Types';
import {IconSizes, NotificationType} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {space} from '../style';
import {NativeImage} from '../shared/NativeImage';

const {FontWeights, FontSizes} = Typography;

type NotificationCardPros = {
  notificationText: string;
  avatar: string;
  name: string;
  resourceId: string;
  type: keyof typeof NotificationType;
  time: string;
};

const NotificationCard = ({
  notificationText,
  avatar,
  resourceId,
  name,
  type,
  time,
}: NotificationCardPros) => {
  const {theme} = useContext(AppContext);
  const navigation = useNavigation();
  const {readableTime} = parseTimeElapsed(time);

  const navigateAction = () => {
    if (resourceId == null || resourceId === '') {
      return;
    }
    if (type === NotificationType.FOLLOW) {
      navigation.navigate('Profile', {userId: resourceId});
    } else if (
      type === NotificationType.LIKE ||
      type === NotificationType.COMMENT
    ) {
      navigation.navigate('PostView', {postId: resourceId});
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={navigateAction}
      style={styles().container}>
      <NativeImage uri={avatar} style={styles(theme).avatarImage} />
      <View style={[styles().info, space(IconSizes.x1).ml]}>
        <Text style={styles(theme).notificationText}>
          <Text style={styles(theme).handleText}>{name} </Text>
          {notificationText}
        </Text>
        <Text style={styles(theme).timeText}>{readableTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 10,
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
    notificationText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      paddingTop: 5,
    },
  });

export default NotificationCard;
