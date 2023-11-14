import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {styles} from '../style';
import {parseTimeElapsed} from '../../utils/shared';
import {IconSizes} from '../../constants/Constants';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import {useNavigation} from '@react-navigation/native';
import IconButton from '../control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeImage} from '../shared/NativeImage';
import {useSelector} from 'react-redux';
import {EU} from 'react-native-mentions-editor';

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
  const {user} = useSelector((state: any) => state.user);
  const {parsedTime} = parseTimeElapsed(time);
  const navigation = useNavigation();

  const isOwnComment = userId === user.id;

  const navigateToProfile = () => {
    if (isOwnComment) {
      navigation.navigate('MyProfile');
    }
    navigation.navigate('Profile', {userId: userId});
  };

  const formatMentionNode = (txt, key) => (
    <Text
      onPress={() => {
        const mentionId = key.split('-')[1];
        if (mentionId === user.id) {
          navigation.navigate('MyProfile');
        } else {
          navigation.navigate('Profile', {userId: mentionId});
        }
      }}
      key={key}
      style={{
        ...FontWeights.Light,
        ...FontSizes.Body,
        color: '#244dc9',
      }}>
      {txt}
    </Text>
  );

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          borderRadius: 10,
          marginVertical: 5,
        },
      ]}>
      <NativeImage
        uri={avatar}
        style={{
          height: 40,
          width: 40,
          borderRadius: 50,
          backgroundColor: theme.placeholder,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 10,
          },
        ]}
        onPress={navigateToProfile}>
        <Text
          style={[
            {
              ...FontWeights.Light,
              ...FontSizes.Body,
              color: theme.text01,
            },
          ]}>
          <Text
            style={[
              {
                ...FontWeights.Regular,
                ...FontSizes.Body,
                color: theme.text01,
              },
            ]}>
            {name}{' '}
          </Text>
          {EU.displayTextWithMentions(comment || '', formatMentionNode)}
        </Text>
        <View
          style={[
            styles(theme).row,
            {
              alignItems: 'center',
            },
          ]}>
          <Text
            style={[
              {
                ...FontWeights.Light,
                ...FontSizes.Caption,
                color: theme.text02,
                paddingTop: 10,
              },
            ]}>
            {parsedTime}
          </Text>
        </View>
      </TouchableOpacity>
      {isOwnComment && (
        <IconButton
          onPress={onPressOption}
          Icon={() => (
            <Ionicons
              name="ellipsis-horizontal"
              size={IconSizes.x6}
              color={theme.text01}
            />
          )}
        />
      )}
    </View>
  );
};

export default CommentCard;
