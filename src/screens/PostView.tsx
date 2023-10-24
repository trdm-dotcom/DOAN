import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {createRef, useContext, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {postLike} from '../reducers/action/post';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import LikesBottomSheet from '../components/bottomsheet/LikesBottomSheet';

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
  const [loading, setLoading] = useState(false);

  let content = <PostViewScreenPlaceholder />;

  const {readableTime} = parseTimeElapsed(post.createdAt);

  const openOptions = () => {};

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

  const openLikes = () => {};

  content = (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (post.author.id !== user.id) {
            navigation.navigate('Profile', {userId: post.author.id});
          }
        }}
        style={styles(theme).postViewHeader}>
        <NativeImage
          uri={
            'https://s3-ap-southeast-1.amazonaws.com/tradex-vn/avatar/default.png'
          }
          style={styles(theme).postViewAvatarImage}
        />
        <View style={{flex: 1}}>
          <Text style={styles(theme).handleText}>{post.author.name}</Text>
          <Text style={styles(theme).timeText}>{readableTime}</Text>
        </View>
        <IconButton
          onPress={openOptions}
          Icon={() => (
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={IconSizes.x4}
              color={theme.text01}
            />
          )}
        />
      </TouchableOpacity>
      <TapGestureHandler
        maxDelayMs={300}
        ref={doubleTapRef}
        onActivated={() => likeInteractionHandler(isLiked)}
        numberOfTaps={2}>
        <View style={{flex: 1}}>
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
            if (post.author.id !== user.id) {
              navigation.navigate('Profile', {userId: post.author.id});
            }
          }}
          style={styles(theme).handleText}>
          {post.author.handle}{' '}
        </Text>
        {post.caption}
      </Text>
      <Comments postId={post.id} />
    </>
  );

  let bottomSheets;

  if (loading) {
    bottomSheets = (
      <>
        <ConfirmationModal
          label="Delete"
          title="Delete post?"
          color={ThemeStatic.delete}
          isVisible={isConfirmModalVisible}
          toggle={confirmationToggle}
          onConfirm={() => onDeleteConfirm(uri)}
        />
        <LikesBottomSheet
          ref={likesBottomSheetRef}
          likes={likes}
          onUserPress={navigateToProfile}
        />
      </>
    );
  }

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
        <ScrollView
          // @ts-ignore
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={[{flex: 1}, space(IconSizes.x1).pt, space(IconSizes.x5).ph]}>
          {content}
        </ScrollView>
        <CommentInput postId={post.id} scrollViewRef={scrollViewRef} />
        {bottomSheets}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default PostView;
