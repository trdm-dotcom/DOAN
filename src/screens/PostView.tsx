import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
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
  getPostDetail,
  postLike,
  reportPost,
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
import {useDispatch, useSelector} from 'react-redux';
import {getSocket} from '../utils/Socket';
import {showError} from '../utils/Toast';
import renderValue from '../components/shared/MentionText';
import Feather from 'react-native-vector-icons/Feather';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import {blockUser, checkFriend, rejectFriend} from '../reducers/action/friend';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'PostView'>;
const PostView = ({navigation, route}: props) => {
  const dispatch = useDispatch();
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
  const [isConfirmModalDeleteVisible, setIsConfirmModalDeleteVisible] =
    useState(false);
  const [isConfirmModalHideVisible, setIsConfirmModalHideVisible] =
    useState(false);
  const [blockConfirmationModal, setBlockConfirmationModal] =
    useState<boolean>(false);
  const [unfriendConfirmationModal, setUnfriendConfirmationModal] =
    useState<boolean>(false);
  const [comments, setComments] = useState<any>([]);
  const [friendStatus, setFriendStatus] = useState<any>({});
  const [like, setLike] = useState<any[]>([]);
  const [comment, setComment] = useState<any>({});
  const [smElseReason, setSmElseReason] = useState<any>(null);

  const postOptionsBottomSheetRef = useRef();
  const likesBottomSheetRef = useRef();
  const doubleTapRef = useRef();
  const likeBounceAnimationRef = createRef();
  const taggedBottomSheetRef = useRef();
  const reportOptionsBottomSheetRef = useRef();
  const somethingelseBottomSheetRef = useRef();
  const socket = getSocket();

  const {readableTime} = parseTimeElapsed(post.createdAt);

  useEffect(() => {
    setPost({
      ...post,
      reactions: post.reactions.concat(like),
    });
  }, [like]);

  useEffect(() => {
    setComments(comments.concat([comment]));
  }, [comment]);

  useEffect(() => {
    fetchData(postId);
    socket.on('post.reaction', (data: any) => {
      if (data.to === postId) {
        setLike(data.data.reactions);
      }
    });
    socket.on('comment', (data: any) => {
      if (data.to === postId) {
        setComment(data.data);
      }
    });
    socket.on('delete.comment', (data: any) => {
      if (data.to === postId) {
        setComments(comments.filter(cmt => cmt.id !== data.data.id));
      }
    });
  }, [postId]);

  const fetchData = (id: string) => {
    setLoading(true);
    Promise.all([fetchPost(id), fetchFriendStatus()])
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const fetchPost = async (id: string) => {
    const res = await getPostDetail({post: id});
    setPost(res);
    setComments(res.comments);
    setIsLiked(res.reactions.includes(user.id));
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

  const toggleBlockConfirmationModal = () => {
    // @ts-ignore
    setBlockConfirmationModal(previousState => !previousState);
  };

  const toggleUnfriendConfirmationModal = () => {
    // @ts-ignore
    setUnfriendConfirmationModal(previousState => !previousState);
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

  const openReportOptions = () => {
    // @ts-ignore
    return reportOptionsBottomSheetRef.current.open();
  };

  const closeReportOptions = () => {
    // @ts-ignore
    return reportOptionsBottomSheetRef.current.close();
  };

  const openSomethingElse = () => {
    // @ts-ignore
    return somethingelseBottomSheetRef.current.open();
  };

  const closeSomethingElse = () => {
    // @ts-ignore
    return somethingelseBottomSheetRef.current.close();
  };

  const onPostDelete = () => {
    closeOptions();
    confirmationDeleteToggle();
  };

  const onPostDisable = () => {
    closeOptions();
    confirmationHideToggle();
  };

  const onPostUndisable = () => {
    closeOptions();
    doUndisablePost();
  };

  const onReportPost = () => {
    closeOptions();
    openReportOptions();
  };

  const onUnfriend = () => {
    closeOptions();
    toggleUnfriendConfirmationModal();
  };

  const onBlock = () => {
    closeOptions();
    toggleBlockConfirmationModal();
  };

  const likeInteractionHandler = (liked: boolean) => {
    if (!liked) {
      const body = {
        postId: post.id,
        reaction: 'like',
      };
      postLike(body).then(() => {
        setIsLiked(!liked);
      });
    }
    // @ts-ignore
    likeBounceAnimationRef.current.animate();
  };

  const doDeletePost = async () => {
    confirmationDeleteToggle();
    const body: IParam = {
      post: post.id,
      hash: getHash('DELETE_POST'),
    };
    try {
      await deletePost(body);
      if (post.disable) {
        dispatch({
          type: 'removeMyPostHide',
          payload: {
            id: post.id,
          },
        });
      } else {
        dispatch({
          type: 'removeMyPost',
          payload: {
            id: post.id,
          },
        });
      }
      dispatch({
        type: 'decrementTotalMyPost',
      });
      navigation.goBack();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const doUndisablePost = async () => {
    dispatch({
      type: 'removeMyPostHide',
      payload: {
        id: post.id,
      },
    });
    dispatch({
      type: 'addOneMyPost',
      payload: {
        id: post.id,
        source: post.source,
      },
    });
    try {
      const body: IParam = {
        post: post.id,
        hash: getHash('DISABLE_POST'),
        disable: false,
      };
      await disablePost(body);
      navigation.goBack();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const doDisablePost = async () => {
    confirmationHideToggle();
    dispatch({
      type: 'removeMyPost',
      payload: {
        id: post.id,
      },
    });
    dispatch({
      type: 'addOneMyPostHide',
      payload: {
        id: post.id,
        source: post.source,
      },
    });
    try {
      const body: IParam = {
        post: post.id,
        hash: getHash('DISABLE_POST'),
        disable: true,
      };
      await disablePost(body);
      navigation.goBack();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const doBlock = () => {
    toggleBlockConfirmationModal();
    blockUser(friendStatus.targetId)
      .then(() => {
        navigation.goBack();
        if (friendStatus.status === 'FRIENDED') {
          dispatch({
            type: 'removePostByUserId',
            payload: {
              id: friendStatus.targetId,
            },
          });
          dispatch({
            type: 'removeFriend',
            payload: {
              id: friendStatus.targetId,
            },
          });
          dispatch({
            type: 'deleteChat',
            payload: {data: {id: friendStatus.targetId}},
          });
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const doUnfriend = () => {
    toggleUnfriendConfirmationModal();
    rejectFriend(friendStatus.friendId)
      .then(() => {
        navigation.goBack();
        if (friendStatus.status === 'FRIENDED') {
          dispatch({
            type: 'removePostByUserId',
            payload: {
              id: friendStatus.targetId,
            },
          });
          dispatch({
            type: 'removeFriend',
            payload: {
              id: friendStatus.targetId,
            },
          });
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const doReportPost = async (reason: string) => {
    closeReportOptions();
    try {
      const bodyReport: IParam = {
        sourceId: post.id,
        reason: reason,
      };
      await reportPost(bodyReport);
      navigation.goBack();
      dispatch({type: 'deleteOrDisablePost', payload: {data: {id: post.id}}});
    } catch (err: any) {
      showError(err.message);
    }
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
          <View style={[styles(theme).row]}>
            <IconButton
              onPress={openTagged}
              Icon={() => (
                <Feather name="tag" size={IconSizes.x6} color={theme.text01} />
              )}
            />
            <IconButton
              style={[space(IconSizes.x1).ml]}
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
              {parseLikes(post.reactions.length)}
            </Text>
          </View>
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

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

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
          ListEmptyComponent: () => (
            <ListEmptyComponent listType="users tagged" spacing={30} />
          ),
          showsVerticalScrollIndicator: false,
        }}
      />
      <PostOptionsBottomSheet
        ref={postOptionsBottomSheetRef}
        post={post}
        friendStatus={friendStatus}
        onPostEdit={() => {
          closeOptions();
          navigation.navigate('EditPost', {postId: postId});
        }}
        onPostDelete={onPostDelete}
        onPostDiable={onPostDisable}
        onPostUnDiable={onPostUndisable}
        onReportPost={onReportPost}
        onUnfriend={onUnfriend}
        onBlock={onBlock}
      />
      <Modalize
        ref={reportOptionsBottomSheetRef}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        <BottomSheetHeader
          heading="Report"
          subHeading={'Why are you reporting this post?'}
        />
        <View
          style={[
            {
              flex: 1,
              paddingTop: 20,
              paddingBottom: 16,
            },
          ]}>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost("I just don't like it")}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              I just don't like it
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('Nudity or sexual activity')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Nudity or sexual activity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('Hate speech or symbols')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Hate speech or symbols
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('Bullying or harassment')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Bullying or harassment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('Violence or dangerous organizations')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Violence or dangerous organizations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('False information')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              False information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => doReportPost('Suicide or self-injury')}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Suicide or self-injury
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: IconSizes.x1,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => {
              closeReportOptions();
              openSomethingElse();
            }}>
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  marginLeft: 10,
                  color: theme.text01,
                },
              ]}>
              Something else
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      <Modalize
        ref={somethingelseBottomSheetRef}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <BottomSheetHeader
            heading="Report"
            subHeading={'Help us understand the problem'}
          />
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <TextInput
              onChangeText={(text: string) => {
                setSmElseReason(text);
              }}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              placeholder="Your reason"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSmElseReason(null);
                closeSomethingElse();
                doReportPost(smElseReason);
              }}
              disabled={smElseReason === null}
              style={[styles(theme).button, styles(theme).buttonPrimary]}>
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.white,
                  },
                ]}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modalize>
      <ConfirmationModal
        label="Delete"
        title="Delete this post?"
        color={ThemeStatic.delete}
        isVisible={isConfirmModalDeleteVisible}
        toggle={confirmationDeleteToggle}
        onConfirm={doDeletePost}
      />
      <ConfirmationModal
        label="Ok"
        title="Hide this post?"
        color={ThemeStatic.delete}
        isVisible={isConfirmModalHideVisible}
        toggle={confirmationHideToggle}
        onConfirm={doDisablePost}
      />
      <ConfirmationModal
        label="Ok"
        title="Block this user?"
        color={ThemeStatic.delete}
        isVisible={blockConfirmationModal}
        toggle={toggleBlockConfirmationModal}
        onConfirm={doBlock}
      />
      <ConfirmationModal
        label="Ok"
        title="Unfriend this user?"
        color={ThemeStatic.delete}
        isVisible={unfriendConfirmationModal}
        toggle={toggleUnfriendConfirmationModal}
        onConfirm={doUnfriend}
      />
      <LikesBottomSheet ref={likesBottomSheetRef} postId={post.id} />
    </>
  );

  const refreshControl = () => {
    const onRefresh = () => {
      fetchData(postId);
    };

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    );
  };

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
      {(friendStatus.status !== 'FRIENDED' && post.author.privateMode === 1) ||
      post.author.status === 'INACTIVE' ||
      (post.disable && post.author.id !== user.id) ? (
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[{flex: 1}, space(IconSizes.x1).pt]}
              refreshControl={refreshControl()}>
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
