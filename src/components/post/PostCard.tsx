import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Typography from '../../theme/Typography';
import React, {createRef, useContext, useRef, useState} from 'react';
import {postLike} from '../../reducers/action/post';
import {parseComments, parseLikes, parseTimeElapsed} from '../../utils/shared';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {AppContext} from '../../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeStatic} from '../../theme/Colors';
import {IconSizes} from '../../constants/Constants';
import {NativeImage} from '../shared/NativeImage';
import LikeBounceAnimation from './LikeBounceAnimation';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import renderValue from '../shared/MentionText';

const {FontWeights, FontSizes} = Typography;

type Author = {
  userId: string;
  avatar: string;
  name: string;
};

type PostCardProps = {
  id: string;
  author: Author;
  time: string;
  uri: string;
  likes: any[];
  comments: any[];
  caption: string;
  tags: any[];
};

const PostCard = ({
  id,
  author,
  time,
  uri,
  likes,
  comments,
  caption,
  tags,
}: PostCardProps) => {
  const navigation = useNavigation();
  const {user} = useSelector((state: any) => state.user);
  const {theme} = useContext(AppContext);

  const {readableTime} = parseTimeElapsed(time);
  const [isLiked, setIsLiked] = useState(likes.includes(user.id));

  const likeBounceAnimationRef = createRef();
  const doubleTapRef = useRef();

  const likeInteractionHandler = (liked: boolean) => {
    if (!liked) {
      const body = {
        postId: id,
        reaction: 'like',
      };
      postLike(body);
      setIsLiked(!liked);
    }
    // @ts-ignore
    return likeBounceAnimationRef.current.animate();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{justifyContent: 'space-between'}}>
        <NativeImage
          uri={author.avatar}
          style={{
            height: 40,
            width: 40,
            backgroundColor: ThemeStatic.placeholder,
            borderRadius: 40,
          }}
        />
        <View
          style={{
            borderWidth: 1,
            alignSelf: 'center',
            borderColor: theme.placeholder,
            flexGrow: 1,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {tags != null &&
            tags.slice(0, 3).map(tag => (
              <NativeImage
                key={tag.id}
                uri={tag.avatar}
                style={{
                  marginTop: 3,
                  height: 30,
                  width: 30,
                  backgroundColor: ThemeStatic.placeholder,
                  borderRadius: 30,
                }}
              />
            ))}
        </View>
      </View>
      <View style={{flex: 1, marginLeft: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                if (author.userId === user.id) {
                  navigation.navigate('MyProfile');
                } else {
                  navigation.navigate('Profile', {userId: author.userId});
                }
              }}
              style={{
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              }}>
              {author.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                ...FontWeights.Regular,
                ...FontSizes.Caption,
                color: theme.text02,
                marginTop: 2,
              }}>
              {readableTime}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            ...FontWeights.Regular,
            ...FontSizes.Body,
            color: theme.text01,
            marginVertical: 10,
          }}>
          {renderValue(
            caption,
            [
              {
                trigger: '@',
                textStyle: {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  color: '#244dc9',
                },
              },
            ],
            user,
          )}
        </Text>
        <GestureHandlerRootView>
          <TapGestureHandler
            onActivated={() =>
              navigation.navigate('PostView', {
                postId: id,
                userId: author.userId,
              })
            }
            numberOfTaps={1}
            waitFor={doubleTapRef}>
            <TapGestureHandler
              maxDelayMs={300}
              ref={doubleTapRef}
              onActivated={() => likeInteractionHandler(isLiked)}
              numberOfTaps={2}>
              <View
                style={{
                  height: responsiveWidth(75),
                  width: responsiveWidth(75),
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: ThemeStatic.black,
                  overflow: 'hidden',
                  borderRadius: 10,
                }}>
                <NativeImage
                  uri={uri}
                  style={{
                    position: 'absolute',
                    height: responsiveWidth(80),
                    width: responsiveWidth(80),
                  }}
                />
                <LikeBounceAnimation ref={likeBounceAnimationRef} />
              </View>
            </TapGestureHandler>
          </TapGestureHandler>
        </GestureHandlerRootView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                color={isLiked ? ThemeStatic.like : ThemeStatic.unlike}
                size={IconSizes.x6}
              />
              <Text
                style={{
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 8,
                  color: theme.text02,
                }}>
                {parseLikes(likes.length)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: IconSizes.x1}}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                color={ThemeStatic.unlike}
                size={IconSizes.x6}
              />
              <Text
                style={{
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 8,
                  color: theme.text02,
                }}>
                {parseComments(comments.length)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
