import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {createRef, useContext, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import CommentInput from '../components/comment/CommentInput';
import PostViewScreenPlaceholder from '../components/placeholder/PostViewScreen.Placeholder';
import {useAppSelector} from '../reducers/redux/store';
import {parseLikes, parseTimeElapsed} from '../utils/shared';
import {NativeImage} from '../components/shared/NativeImage';
import LikeBounceAnimation from '../components/post/LikeBounceAnimation';
import Comments from '../components/comment/Comments';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';
import BounceView from '../components/shared/BounceView';
import {deletePost, postLike} from '../reducers/action/post';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import LikesBottomSheet from '../components/bottomsheet/LikesBottomSheet';
import {getHash} from '../utils/Crypto';
import {IParam} from '../models/IParam';
import PostOptionsBottomSheet from '../components/bottomsheet/PostOptionsBottomSheet';
import EditPostBottomSheet from '../components/bottomsheet/EditPostBottomSheet';
import UserAvatar from 'react-native-user-avatar';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'PostView'>;
const PostView = ({navigation, route}: props) => {
  const user = useAppSelector(state => state.auth.userInfo);

  const {theme} = useContext(AppContext);
  const {post} = route.params;

  const scrollViewRef = useRef();
  const postOptionsBottomSheetRef = useRef();
  const editPostBottomSheetRef = useRef();
  const likesBottomSheetRef = useRef();
  const doubleTapRef = useRef();
  const likeBounceAnimationRef = createRef();

  const [isLiked, setIsLiked] = useState(post.likes.includes(user.id));
  const [likes, setLikes] = useState(post.likes);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  let content = <PostViewScreenPlaceholder />;

  const {readableTime} = parseTimeElapsed(post.createdAt);

  const confirmationToggle = () => {
    setIsConfirmModalVisible(!isConfirmModalVisible);
  };

  const openOptions = () => {
    // @ts-ignore
    postOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    postOptionsBottomSheetRef.current.close();
  };

  const onPostEdit = () => {
    closeOptions();
    // @ts-ignore
    editPostBottomSheetRef.current.open();
  };

  const openLikes = () => {
    // @ts-ignore
    likesBottomSheetRef.current.open();
  };

  const onPostDelete = () => {
    closeOptions();
    confirmationToggle();
  };

  const likeInteractionHandler = (liked: boolean) => {
    if (!liked) {
      const body = {
        postId: post.id,
        reaction: 'like',
      };
      postLike(body);
      setIsLiked(!liked);
      setLikes([...likes, user.id]);
    }
    // @ts-ignore
    likeBounceAnimationRef.current.animate();
  };

  const doDeletePost = async () => {
    const body: IParam = {
      post: post.id,
      hash: getHash('DELETE_POST'),
    };
    return await Promise.all([deletePost(body), deleteImage(post.uri)]);
  };

  const doDisablePost = async () => {
    const body: IParam = {
      post: post.id,
      hash: getHash('DISABLE_POST'),
    };
    await deletePost(body);
  };

  const deleteImage = (uri: string) => {
    const encodedPath = uri.split('o/')[1].split('?alt=media')[0];
    const originalPath = decodeURIComponent(encodedPath);
    return originalPath;
  };

  content = (
    <>
      <View style={styles(theme).postViewHeader}>
        <UserAvatar
          size={50}
          name={post.author.name}
          src={post.author.avatar}
          bgColor={theme.placeholder}
        />
        <View style={[{flex: 1}, space(IconSizes.x1).ml]}>
          <Text style={styles(theme).handleText}>{post.author.name}</Text>
          <Text style={styles(theme).timeText}>{readableTime}</Text>
        </View>
        <IconButton
          onPress={openOptions}
          Icon={() => (
            <Ionicons
              name="ellipsis-horizontal"
              size={IconSizes.x6}
              color={theme.text01}
            />
          )}
        />
      </View>
      <TapGestureHandler
        maxDelayMs={300}
        ref={doubleTapRef}
        onActivated={() => likeInteractionHandler(isLiked)}
        numberOfTaps={2}>
        <View>
          <NativeImage uri={post.uri} style={styles(theme).postViewImage} />
          <LikeBounceAnimation ref={likeBounceAnimationRef} />
        </View>
      </TapGestureHandler>
      <View
        style={[
          {
            flexDirection: 'row',
            marginTop: 20,
          },
        ]}>
        <BounceView
          scale={1.5}
          moveSlop={15}
          delay={40}
          onPress={() => likeInteractionHandler(isLiked)}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            color={isLiked ? ThemeStatic.like : ThemeStatic.unlike}
            size={IconSizes.x6}
          />
        </BounceView>
        <Text
          onPress={openLikes}
          style={[
            {
              ...FontWeights.Regular,
              ...FontSizes.Body,
              marginLeft: 10,
              color: theme.text01,
            },
          ]}>
          {parseLikes(likes.length)}
        </Text>
      </View>
      <Text
        style={[
          {
            ...FontWeights.Light,
            ...FontSizes.Body,
            color: theme.text01,
            marginTop: 10,
            marginBottom: 20,
          },
        ]}>
        <Text
          onPress={() => {
            if (post.author.userId !== user.id) {
              navigation.navigate('Profile', {user: post.author.userId});
            }
          }}
          style={styles(theme).handleText}>
          {post.author.name}{' '}
        </Text>
        {post.caption}
      </Text>
      <Comments postId={post.id} />
    </>
  );

  let bottomSheets = (
    <>
      <PostOptionsBottomSheet
        ref={postOptionsBottomSheetRef}
        post={post}
        onPostEdit={onPostEdit}
        onPostDelete={onPostDelete}
        onPostDiable={doDisablePost}
      />
      <ConfirmationModal
        label="Delete"
        title="Are you sure you want to delete this post?"
        color={ThemeStatic.delete}
        isVisible={isConfirmModalVisible}
        toggle={confirmationToggle}
        onConfirm={doDeletePost}
      />
      <LikesBottomSheet
        ref={likesBottomSheetRef}
        postId={post.id}
        onUserPress={() => {
          if (post.author.userId !== user.id) {
            navigation.navigate('Profile', {user: post.author.userId});
          }
        }}
      />
      <EditPostBottomSheet post={post} ref={editPostBottomSheetRef} />
    </>
  );

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
          <IconButton
            Icon={() => (
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            )}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        keyboardVerticalOffset={20}
        style={[{flex: 1}, space(IconSizes.x1).mt]}>
        <View
          style={[{flex: 1}, space(IconSizes.x1).pt, space(IconSizes.x5).ph]}>
          {content}
        </View>
        <CommentInput postId={post.id} scrollViewRef={scrollViewRef} />
      </KeyboardAvoidingView>
      {bottomSheets}
    </GestureHandlerRootView>
  );
};

export default PostView;
