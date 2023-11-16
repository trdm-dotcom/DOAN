import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {parseTimeElapsed} from '../../utils/shared';
import {ThemeColors} from '../../constants/Types';
import {
  IconSizes,
  NotificationText,
  NotificationType,
} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {space} from '../style';
import {NativeImage} from '../shared/NativeImage';

const {FontWeights, FontSizes} = Typography;

type NotificationCardPros = {
  avatar: string;
  name: string;
  resourceId: string;
  type: keyof typeof NotificationType;
  time: string;
  author: any;
};

const NotificationCard = ({
  avatar,
  resourceId,
  name,
  type,
  time,
  author,
}: NotificationCardPros) => {
  const {theme} = useContext(AppContext);
  const navigation = useNavigation();
  const {readableTime} = parseTimeElapsed(time);

  const navigateAction = () => {
    if (resourceId == null) {
      return;
    }
    if (type === NotificationType.REQUEST) {
      navigation.navigate('Profile', {userId: resourceId});
    } else if (
      type === NotificationType.LIKE ||
      type === NotificationType.COMMENT ||
      type === NotificationType.TAG ||
      type === NotificationType.MENTION_ON_COMMENT ||
      type === NotificationType.MENTION_ON_POST
    ) {
      navigation.navigate('PostView', {postId: resourceId, userId: author.id});
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
          {NotificationText[type]}
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
