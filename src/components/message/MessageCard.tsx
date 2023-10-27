import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OnlineDotColor} from '../../constants/Constants';
import {AppContext} from '../../context';
import {useAppSelector} from '../../reducers/redux/store';
import Typography from '../../theme/Typography';
import {parseTimeElapsed} from '../../utils/shared';
import {NativeImage} from '../shared/NativeImage';
import {ThemeColors} from '../../constants/Types';
import {useNavigation} from '@react-navigation/native';
import {messageSeen} from 'src/reducers/action/chat';

const {FontWeights, FontSizes} = Typography;

interface MessageCardProps {
  chatId: string;
  participantId: string;
  avatar: string;
  handle: string;
  authorId: string;
  messageId: string;
  messageBody: string;
  seen: boolean;
  time: string;
  isOnline: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  chatId,
  participantId,
  avatar,
  handle,
  authorId,
  messageId,
  messageBody,
  seen,
  time,
  isOnline,
}) => {
  const user = useAppSelector(state => state.auth.userInfo);
  const {theme} = useContext(AppContext);
  const {parsedTime} = parseTimeElapsed(time);
  const navigation = useNavigation();

  const isHighlighted = authorId !== user.id && !seen;

  const highlightStyle = isHighlighted
    ? {
        ...FontWeights.Regular,
        color: theme.text01,
      }
    : null;

  const onlineDotColor = OnlineDotColor[isOnline as any];

  const setSeenAndNavigate = () => {
    if (authorId !== user.id) {
      messageSeen(messageId);
    }
    navigation.navigate('Conversation', {
      chatId,
      avatar,
      handle,
      targetId: participantId,
    });
  };

  return (
    // @ts-ignore
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={setSeenAndNavigate}
      style={styles().container}>
      <View style={styles().avatar}>
        <NativeImage uri={avatar} style={styles(theme).avatarImage} />
        <View style={[styles().onlineDot, {backgroundColor: onlineDotColor}]} />
      </View>
      <View style={styles().info}>
        <Text style={styles(theme).handleText}>{handle} </Text>
        <View style={styles(theme).content}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles(theme).messageText, highlightStyle]}>
            {messageBody}
          </Text>
          <Text style={[styles(theme).timeText, highlightStyle]}>
            {` · ${parsedTime}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
    },
    avatar: {
      height: 50,
      width: 50,
    },
    avatarImage: {
      flex: 1,
      borderRadius: 50,
      backgroundColor: theme.placeholder,
    },
    onlineDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      bottom: 2.5,
      right: 2.5,
      borderRadius: 10,
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
    content: {
      flexDirection: 'row',
      paddingTop: 5,
    },
    messageText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      maxWidth: '70%',
      color: theme.text02,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
    },
  });

export default MessageCard;
