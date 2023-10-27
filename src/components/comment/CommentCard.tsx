import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useAppSelector} from '../../reducers/redux/store';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {NativeImage} from '../shared/NativeImage';
import {space, styles} from '../style';
import {parseTimeElapsed} from '../../utils/shared';
import {IconSizes} from '../../constants/Constants';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import {useNavigation} from '@react-navigation/native';
import IconButton from '../control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {FontWeights, FontSizes} = Typography;

type CommentCardProps = {
  userId: number;
  avatar: string;
  name: string;
  comment: string;
  time: string;
  onPressOption: () => void;
};

const CommentCard = ({
  userId,
  avatar,
  name,
  comment,
  time,
  onPressOption,
}: CommentCardProps) => {
  const {theme} = useContext(AppContext);
  const userInfo: IUserInfoResponse = useAppSelector(
    state => state.auth.userInfo,
  );
  const {parsedTime} = parseTimeElapsed(time);
  const navigation = useNavigation();

  const isOwnComment = userId === userInfo.id;

  const navigateToProfile = () => {
    if (isOwnComment) {
      return;
    }
    navigation.navigate('Profile', {user: userId});
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          borderRadius: 10,
        },
        space(10).m,
      ]}>
      <NativeImage uri={avatar} style={styles(theme).tinyAvatar} />
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
          },
          space(IconSizes.x4).pl,
        ]}>
        <Text
          style={[
            {
              ...FontWeights.Light,
              ...FontSizes.Body,
              color: theme.text01,
            },
          ]}>
          <TouchableOpacity activeOpacity={0.9} onPress={navigateToProfile}>
            <Text style={[styles(theme).nameText]}>{name} </Text>
          </TouchableOpacity>
          {comment}
        </Text>
        <View
          style={[
            styles(theme).row,
            {
              alignItems: 'center',
            },
            space(IconSizes.x5).mt,
          ]}>
          <Text style={[styles(theme).timeText]}>{parsedTime}</Text>
        </View>
      </View>
      <IconButton
        Icon={() => (
          <Ionicons
            name="ellipsis-horizontal"
            size={IconSizes.x6}
            color={theme.text01}
          />
        )}
        onPress={onPressOption}
      />
    </View>
  );
};

export default CommentCard;
