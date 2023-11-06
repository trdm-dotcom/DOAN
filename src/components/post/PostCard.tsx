import React, {createRef, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {parseComments, parseLikes, parseTimeElapsed} from '../../utils/shared';
import {NativeImage} from '../shared/NativeImage';
import {IconSizes, PostDimensions} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {postLike} from '../../reducers/action/post';
import LikeBounceAnimation from './LikeBounceAnimation';
import {space} from '../style';
import {useSelector} from 'react-redux';

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
};

const PostCard = ({
  id,
  author,
  time,
  uri,
  likes,
  comments,
  caption,
}: PostCardProps) => {
  const navigation = useNavigation();
  const {user} = useSelector((state: any) => state.user);

  const {readableTime} = parseTimeElapsed(time);
  const readableComments = parseComments(comments.length);
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
      likes.push(user.id);
    }
    // @ts-ignore
    return likeBounceAnimationRef.current.animate();
  };

  return (
    <GestureHandlerRootView>
      <TapGestureHandler
        onActivated={() =>
          navigation.navigate('PostView', {
            postId: id,
          })
        }
        numberOfTaps={1}
        waitFor={doubleTapRef}>
        <TapGestureHandler
          maxDelayMs={300}
          ref={doubleTapRef}
          onActivated={() => likeInteractionHandler(isLiked)}
          numberOfTaps={2}>
          <View style={styles.container}>
            <NativeImage uri={uri} style={styles.postImage} />
            <LikeBounceAnimation ref={likeBounceAnimationRef} />
            <View style={styles.upperContent}>
              <NativeImage uri={author.avatar} style={styles.avatarImage} />
              <View style={[space(IconSizes.x1).ml]}>
                <Text style={styles.handleText}>{author.name}</Text>
                <Text style={styles.timeText}>{readableTime}</Text>
              </View>
            </View>

            <View style={styles.lowerContent}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    color={isLiked ? ThemeStatic.like : ThemeStatic.unlike}
                    size={IconSizes.x6}
                  />
                  <Text style={styles.likesText}>
                    {parseLikes(likes.length)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: IconSizes.x1}}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    color={ThemeStatic.unlike}
                    size={IconSizes.x6}
                  />
                  <Text style={styles.likesText}>{readableComments}</Text>
                </View>
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.captionText}>
                {caption}
              </Text>
            </View>
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...PostDimensions.Large,
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: ThemeStatic.black,
    overflow: 'hidden',
    borderRadius: 40,
  },
  postImage: {
    position: 'absolute',
    ...PostDimensions.Large,
  },
  avatarImage: {
    height: 40,
    width: 40,
    backgroundColor: ThemeStatic.placeholder,
    borderRadius: 40,
    marginRight: 10,
  },
  upperContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: ThemeStatic.translucent,
  },
  lowerContent: {
    justifyContent: 'center',
    padding: 16,
    backgroundColor: ThemeStatic.translucent,
  },
  handleText: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    color: ThemeStatic.white,
  },
  timeText: {
    ...FontWeights.Regular,
    ...FontSizes.Caption,
    color: ThemeStatic.white,
    marginTop: 2,
  },
  likesText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    marginLeft: 8,
    color: ThemeStatic.white,
  },
  captionText: {
    ...FontWeights.Bold,
    ...FontSizes.Body,
    color: ThemeStatic.white,
    marginTop: 5,
  },
});

export default PostCard;
