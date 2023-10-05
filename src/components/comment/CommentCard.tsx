/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useAppSelector} from '../../reducers/redux/store';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {NativeImage} from '../shared/NativeImage';
import {styles} from '../style';
import {parseTimeElapsed} from '../../utils/shared';
import {CONTENT_SPACING, IconSizes} from '../../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import {useAppNavigation} from '../../navigators/AppReactNavigation';

const {FontWeights, FontSizes} = Typography;

type CommentCardProps = {
  postId: string;
  commentId: string;
  authorId: number;
  avatar: string;
  handle: string;
  body: string;
  time: string;
};

const CommentCard = ({
  postId,
  commentId,
  authorId,
  avatar,
  handle,
  body,
  time,
}: CommentCardProps) => {
  const {theme} = useContext(AppContext);
  const userInfo: IUserInfoResponse = useAppSelector(
    state => state.auth.userInfo,
  );
  const {parsedTime} = parseTimeElapsed(time);
  const navigation = useAppNavigation();

  const navigateToProfile = () => {
    if (authorId === userInfo.id) {
      return;
    }
    navigation.navigate('Profile', {userId: authorId});
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 7,
        margin: 7,
      }}>
      <NativeImage uri={avatar} style={styles(theme).tinyAvatar} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingLeft: CONTENT_SPACING,
        }}>
        <Text
          style={[
            {
              ...FontWeights.Light,
              ...FontSizes.Body,
            },
          ]}>
          <TouchableOpacity activeOpacity={0.95} onPress={navigateToProfile}>
            <Text
              style={[
                [
                  {
                    ...FontWeights.Regular,
                    ...FontSizes.Body,
                  },
                ],
              ]}>
              {handle}{' '}
            </Text>
          </TouchableOpacity>
          {body}
        </Text>
        <View
          style={[
            styles(theme).row,
            styles(theme).alignItemsCenter,
            {marginTop: 5},
          ]}>
          <Text
            style={[
              {
                ...FontWeights.Light,
                ...FontSizes.Caption,
              },
              {color: theme.text02},
            ]}>
            {parsedTime}
          </Text>
          {authorId === userInfo.id && (
            <TouchableOpacity onPress={() =>{}}>
              <Ionicons
                name="ellipsis-horizontal"
                size={IconSizes.x2}
                color={theme.text01}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
