import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
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
import {parseLikes, parseTimeElapsed} from '../utils/shared';
import {NativeImage} from '../components/shared/NativeImage';
import LikeBounceAnimation from '../components/post/LikeBounceAnimation';
import Comments from '../components/comment/Comments';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';
import BounceView from '../components/shared/BounceView';
import {
  deletePost,
  disablePost,
  getCommentsOfPost,
  getPostDetail,
  postLike,
} from '../reducers/action/post';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import LikesBottomSheet from '../components/bottomsheet/LikesBottomSheet';
import {getHash} from '../utils/Crypto';
import {IParam} from '../models/IParam';
import PostOptionsBottomSheet from '../components/bottomsheet/PostOptionsBottomSheet';
import {useSelector} from 'react-redux';
import {getSocket} from '../utils/Socket';
import {showError} from '../utils/Toast';
import renderValue from '../components/shared/MentionText';
import Feather from 'react-native-vector-icons/Feather';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import {checkFriend} from 'src/reducers/action/friend';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'PostView'>;
const PostView = ({navigation, route}: props) => {
  const {user} = useSelector((state: any) => state.user);
  const {theme} = useContext(AppContext);
  const {postId, userId} = route.params;

  const [post, setPost] = useState<any>({
    author: {},
    reactions: [],
    comments: [],
    tags: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<any[]>(post.reactions);
  const [isConfirmModalDeleteVisible, setIsConfirmModalDeleteVisible] =
    useState(false);
  const [isConfirmModalHideVisible, setIsConfirmModalHideVisible] =
    useState(false);
  const [comments, setComments] = useState<any>([]);
  const [friendStatus, setFriendStatus] = useState<any>({});

  const postOptionsBottomSheetRef = useRef();
  const likesBottomSheetRef = useRef();
  const doubleTapRef = useRef();
  const likeBounceAnimationRef = createRef();
  const taggedBottomSheetRef = useRef();
  const socket = getSocket();

  const {readableTime} = parseTimeElapsed(post.createdAt);

  useEffect(() => {
    fetchData();
    socket.on('post.reaction', (data: any) => {
      if (data.to === postId) {
        setLikes([...likes, ...data.data.reactions]);
      }
    });
    socket.on('comment', (data: any) => {
      if (data.to === postId) {
        setComments([...comments, ...[data.data]]);
      }
    });
    socket.on('delete.comment', (data: any) => {
      if (data.to === postId) {
        setComments(comments.filter(comment => comment.id !== data.data.id));
      }
    });
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([fetchPost(), fetchComments(), fetchFriendStatus()])
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const fetchPost = async () => {
    const res = await getPostDetail({post: postId});
    setPost(res);
    setLikes(res.reactions);
    setIsLiked(res.reactions.includes(user.id));
  };

  const fetchComments = async () => {
    const res = await getCommentsOfPost({
      postId: postId,
    });
    setComments(res);
  };

  const fetchFriendStatus = async () => {
    if (userId !== user.id) {
      const res = await checkFriend({friend: userId});
      setFriendStatus(res);
    }
  };

  const confirmationDeleteToggle = () => {
    setIsConfirmModalDeleteVisible(previousState => !previousState);
  };

  const confirmationHideToggle = () => {
    setIsConfirmModalHideVisible(previousState => !previousState);
  };

  const openTagged = () => {
    // @ts-ignore
    return taggedBottomSheetRef.current.open();
  };

  const openOptions = () => {
    // @ts-ignore
    return postOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return postOptionsBottomSheetRef.current.close();
  };

  const openLikes = () => {
    // @ts-ignore
    return likesBottomSheetRef.current.open();
  };

  const onPostDelete = () => {
    closeOptions();
    confirmationDeleteToggle();
  };

  const onPostDisable = () => {
    closeOptions();
    confirmationHideToggle();
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
    try {
      await deletePost(body);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const doDisablePost = async () => {
    const body: IParam = {
      post: post.id,
      hash: getHash('DISABLE_POST'),
    };
    try {
      await disablePost(body);
    } catch (err: any) {}
  };

  let content =
    loading || error ? (
      <PostViewScreenPlaceholder />
    ) : (
      <>
        <View style={[styles(theme).row, {justifyContent: 'space-between'}]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (user.id !== post.author.id) {
                navigation.navigate('Profile', {userId: post.author.id});
              } else {
                navigation.navigate('MyProfile');
              }
            }}
            style={styles(theme).postViewHeader}>
            <NativeImage
              uri={post.author.avatar}
              style={styles(theme).tinyImage}
            />
            <View style={[space(IconSizes.x1).ml]}>
              <Text style={styles(theme).nameText}>{post.author.name}</Text>
              <Text style={styles(theme).timeText}>{readableTime}</Text>
            </View>
          </TouchableOpacity>
          <IconButton
            onPress={openTagged}
            Icon={() => (
              <Feather name="tag" size={IconSizes.x6} color={theme.text01} />
            )}
          />
          {post.author.id === user.id && (
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
          )}
        </View>
        <TapGestureHandler
          maxDelayMs={300}
          ref={doubleTapRef}
          onActivated={() => likeInteractionHandler(isLiked)}
          numberOfTaps={2}>
          <View>
            <NativeImage
              uri={post.source}
              style={styles(theme).postViewImage}
            />
            <LikeBounceAnimation ref={likeBounceAnimationRef} />
          </View>
        </TapGestureHandler>
        <View
          style={[
            styles(theme).row,
            space(IconSizes.x5).mt,
            {justifyContent: 'space-between'},
          ]}>
          <View style={[styles(theme).row]}>
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
          {post.author.id === user.id && (
            <IconButton
              onPress={() => {}}
              Icon={() => (
                <Ionicons
                  name="share-social-outline"
                  color={theme.text01}
                  size={IconSizes.x6}
                />
              )}
            />
          )}
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
              } else {
                navigation.navigate('MyProfile');
              }
            }}
            style={styles(theme).nameText}>
            {post.author.name}{' '}
          </Text>
          {renderValue(
            post.caption,
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
        <Comments postId={post.id} comments={comments} />
      </>
    );

  let bottomSheets = (
    <>
      <Modalize
        ref={taggedBottomSheetRef}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight
        HeaderComponent={
          <BottomSheetHeader
            heading="Tagged"
            subHeading={'People tagged in this post'}
          />
        }
        flatListProps={{
          data: post.tags,
          keyExtractor: (item: any) => item.id,
          renderItem: ({item}: any) => (
            <TouchableOpacity
              onPress={() => {
                if (item.id === user.id) {
                  navigation.navigate('MyProfile');
                } else {
                  navigation.navigate('Profile', {userId: item.id});
                }
              }}
              style={[
                styles(theme).row,
                styles(theme).postViewHeader,
                space(IconSizes.x1).mb,
              ]}>
              <NativeImage uri={item.avatar} style={styles(theme).tinyImage} />
              <View style={[space(IconSizes.x1).ml]}>
                <Text style={styles(theme).nameText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ),
          showsVerticalScrollIndicator: false,
        }}
      />
      <PostOptionsBottomSheet
        ref={postOptionsBottomSheetRef}
        post={post}
        onPostEdit={() => {
          closeOptions();
          navigation.navigate('EditPost', {postId: postId});
        }}
        onPostDelete={onPostDelete}
        onPostDiable={onPostDisable}
      />
      <ConfirmationModal
        label="Delete"
        title="Are you sure you want to delete this post?"
        color={ThemeStatic.delete}
        isVisible={isConfirmModalDeleteVisible}
        toggle={confirmationDeleteToggle}
        onConfirm={doDeletePost}
      />
      <ConfirmationModal
        label="Ok"
        title="Are you sure you want to hide this post?"
        color={ThemeStatic.delete}
        isVisible={isConfirmModalHideVisible}
        toggle={confirmationHideToggle}
        onConfirm={doDisablePost}
      />
      <LikesBottomSheet ref={likesBottomSheetRef} postId={post.id} />
    </>
  );

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            Icon={() => (
              <Ionicons
                name="arrow-back-outline"
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
      {(friendStatus.status !== 'FRIENDED' && post.author.privateMode) ||
      post.author.status === 'INACTIVE' ? (
        <View
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
              height: responsiveHeight(20),
            },
          ]}>
          <Text
            style={[
              {
                ...FontWeights.Light,
                ...FontSizes.Label,
                color: theme.text02,
              },
            ]}>
            Sorry, this page isn't available
          </Text>
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            style={{flex: 1, justifyContent: 'flex-end'}}
            behavior={keyboardBehavior}
            keyboardVerticalOffset={20}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[{flex: 1}, space(IconSizes.x1).pt]}>
              {content}
            </ScrollView>
            <CommentInput postId={post.id} />
          </KeyboardAvoidingView>
          {bottomSheets}
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default PostView;
