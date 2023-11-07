import React, {useContext, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '../navigators/RootStack';
import {AppContext} from '../context';
import {space, styles} from '../components/style';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FETCHING_HEIGHT,
  IconSizes,
  Pagination,
  PostDimensions,
} from '../constants/Constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {ThemeStatic} from '../theme/Colors';
import ProfileOptionsBottomSheet from '../components/profile/ProfileOptionsBottomSheet';
import ProfileScreenPlaceholder from '../components/placeholder/ProfileScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {getUserInfo} from '../reducers/action/user';
import {getPostOfUser} from '../reducers/action/post';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  acceptFriendRequest,
  blockUser,
  checkFriend,
  getFriendOfUser,
  rejectFriend,
  requestAddFriend,
  unblockUser,
} from '../reducers/action/friend';
import ConnectionsBottomSheet from '../components/bottomsheet/ConnectionsBottomSheet';
import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {getConversationBetween} from '../reducers/action/chat';
import Typography from '../theme/Typography';
import {showError} from '../utils/Toast';
import {useSelector} from 'react-redux';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const Profile = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const {userId} = route.params;

  const [friendStatus, setFriendStatus] = useState<any>({});
  const [blockConfirmationModal, setBlockConfirmationModal] =
    useState<boolean>(false);
  const [unfriendConfirmationModal, setUnfriendConfirmationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progessLoading, setProgressLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [friends, setFriends] = useState<any[]>([]);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      Promise.all([
        getUserInfo({userId: userId}),
        getFriendOfUser({
          friend: userId,
          pageNumber: 0,
          pageSize: Pagination.PAGE_SIZE,
        }),
        checkFriend({
          friend: userId,
        }),
      ])
        .catch(err => {
          console.log(err);
          setError(true);
        })
        .then(res => {
          setUserProfile(res[0]);
          setFriends(res[1]);
          setFriendStatus(res[2]);
        })
        .finally(() => setLoading(false));
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchPosts(pageNumber);
    return () => {};
  }, [pageNumber]);

  const fetchPosts = (page: number) => {
    getPostOfUser({
      targetId: userId,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    }).then(res => {
      setSortedPosts(page === 0 ? res : [...sortedPosts, ...res]);
    });
  };

  const profileOptionsBottomSheetRef = useRef();
  const friendsBottomSheetRef = useRef();

  const onFriendsOpen = () => {
    // @ts-ignore
    return friendsBottomSheetRef.current.open();
  };

  const onProfileOptionsOpen = () => {
    // @ts-ignore
    profileOptionsBottomSheetRef.current.open();
  };

  const onProfileOptionsClose = () => {
    // @ts-ignore
    profileOptionsBottomSheetRef.current.close();
  };

  const toggleBlockConfirmationModal = () => {
    // @ts-ignore
    setBlockConfirmationModal(!blockConfirmationModal);
  };

  const toggleUnfriendConfirmationModal = () => {
    // @ts-ignore
    setUnfriendConfirmationModal(!unfriendConfirmationModal);
  };

  const onBlockUser = () => {
    onProfileOptionsClose();
    toggleBlockConfirmationModal();
  };

  const processBlockUser = () => {
    toggleBlockConfirmationModal();
    setProgressLoading(true);
    blockUser(userId)
      .then(res => {
        setFriendStatus({
          isFriend: false,
          status: 'BLOCKED',
          friendId: res.id,
          targetId: userId,
        });
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => {
        setProgressLoading(false);
      });
  };

  const processRejectFriend = () => {
    setProgressLoading(true);
    rejectFriend(friendStatus.friendId)
      .then(() => {
        setFriendStatus({});
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => setProgressLoading(false));
  };

  const processAddFriend = () => {
    setProgressLoading(true);
    requestAddFriend(userId)
      .then(res => {
        setFriendStatus({
          isFriend: false,
          status: 'PENDING',
          friendId: res.id,
          targetId: userId,
        });
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => setProgressLoading(false));
  };

  const processUnblockUser = () => {
    setProgressLoading(true);
    unblockUser(friendStatus.friendId)
      .then(() => {
        setFriendStatus(null);
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => {
        setProgressLoading(false);
      });
  };

  const messageInteraction = async () => {
    const conversation = await getConversationBetween({recipientId: userId});
    navigation.navigate('Conversation', {
      chatId: conversation.chatId,
      avatar: userProfile.avatar,
      name: userProfile.name,
      targetId: userId,
    });
  };

  const friendInteraction = () => {
    if (friendStatus.status === 'FRIENDED') {
      toggleUnfriendConfirmationModal();
    } else if (friendStatus.status === 'PENDING') {
      processRejectFriend();
    } else if (
      friendStatus.status === 'BLOCKED' &&
      friendStatus.targetId !== user.id
    ) {
      processUnblockUser();
    } else if (friendStatus.status == null) {
      processAddFriend();
    }
  };

  const acceptRequest = () => {
    setProgressLoading(true);
    acceptFriendRequest(friendStatus.friendId)
      .then(res => {
        setFriendStatus({
          ...friendStatus,
          status: 'FRIENDED',
          isFriend: false,
        });
        setFriends([
          ...friends,
          {
            ...user,
            friendId: res.id,
            isAccept: true,
            friendStatus: 'FRIENDED',
          },
        ]);
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => {
        setProgressLoading(false);
      });
  };

  const ListHeaderComponent = () => {
    return (
      <ProfileCard
        avatar={userProfile.avatar}
        name={userProfile.name}
        onOptionPress={onProfileOptionsOpen}
        renderInteractions={() => (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={friendInteraction}
              disabled={progessLoading}
              style={[
                styles(theme).button,
                styles(theme).buttonPrimary,
                {flex: 1, height: 55, marginRight: 10},
              ]}>
              {progessLoading ? (
                <LoadingIndicator
                  size={IconSizes.x0}
                  color={ThemeStatic.white}
                />
              ) : (
                <Text
                  style={[
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: ThemeStatic.white,
                    },
                  ]}>
                  {friendStatus.status === 'FRIENDED'
                    ? 'UNFRIEND'
                    : friendStatus.status === 'PENDING'
                    ? 'CANCEL'
                    : friendStatus.status === 'BLOCKED'
                    ? 'UNBLOCK'
                    : 'ADD FRIEND'}
                </Text>
              )}
            </TouchableOpacity>
            {friendStatus.status === 'PENDING' &&
              friendStatus.targetId === user.id && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={progessLoading}
                  onPress={acceptRequest}
                  style={[
                    styles(theme).button,
                    styles(theme).buttonPrimary,
                    {flex: 1, height: 55, marginLeft: 10},
                  ]}>
                  {progessLoading ? (
                    <LoadingIndicator
                      size={IconSizes.x0}
                      color={ThemeStatic.white}
                    />
                  ) : (
                    <Text
                      style={[
                        {
                          ...FontWeights.Bold,
                          ...FontSizes.Body,
                          color: ThemeStatic.white,
                        },
                      ]}>
                      ACCEPT
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            {friendStatus.status === 'FRIENDED' && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={messageInteraction}
                disabled={progessLoading}
                style={[
                  styles(theme).button,
                  styles(theme).buttonPrimary,
                  space(IconSizes.x1).ml,
                  {height: 55},
                ]}>
                <Ionicons
                  name="chatbox-ellipses"
                  size={IconSizes.x6}
                  color={ThemeStatic.white}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        posts={sortedPosts.length}
        friends={friends.length}
        onFriendsOpen={onFriendsOpen}
      />
    );
  };

  function onScroll(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
  }

  function onScrollEndDrag(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
    if (y <= -FETCHING_HEIGHT && !loading) {
      setPageNumber(pageNumber + 1);
    }
  }

  function onRelease() {
    if (offsetY <= -FETCHING_HEIGHT && !loading) {
      setPageNumber(pageNumber + 1);
    }
  }

  const refreshControl = () => {
    const onRefresh = () => setPageNumber(0);

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    );
  };

  const renderItem = ({item}) => {
    return (
      <PostThumbnail
        id={item.id}
        uri={item.source}
        dimensions={PostDimensions.Medium}
      />
    );
  };

  const handleStateChange = (friend: any) => {
    setFriends(
      friends.map(item => (item.friendId === friend.friendId ? friend : item)),
    );
  };

  let content =
    loading || error ? (
      <ProfileScreenPlaceholder viewMode />
    ) : (
      <>
        <FlatGrid
          refreshControl={refreshControl()}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
          ListEmptyComponent={() => (
            <ListEmptyComponent listType="posts" spacing={20} />
          )}
          ListFooterComponent={() => (
            <View
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                space(IconSizes.x1).mt,
              ]}>
              {loading && (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={theme.placeholder}
                />
              )}
            </View>
          )}
          style={[
            {
              flex: 1,
            },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEndDrag}
          onResponderRelease={onRelease}
          keyExtractor={item => item.id.toString()}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={friendsBottomSheetRef}
          datas={friends}
          name={userProfile.name}
          onStateChange={handleStateChange}
        />
      </>
    );

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <>
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
          </>
        }
      />
      {(friendStatus.status === 'BLOCKED' &&
        friendStatus.targetId === user.id) ||
      userProfile.status === 'INACTIVE' ? (
        <>
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
        </>
      ) : (
        <>
          {content}
          <ProfileOptionsBottomSheet
            ref={profileOptionsBottomSheetRef}
            onBlockUser={onBlockUser}
          />
          <ConfirmationModal
            label="Ok"
            title="Are you sure you want to block this user?"
            color={ThemeStatic.delete}
            isVisible={blockConfirmationModal}
            toggle={toggleBlockConfirmationModal}
            onConfirm={processBlockUser}
          />
          <ConfirmationModal
            label="Ok"
            title="Are you sure you want to unfriend this user?"
            color={ThemeStatic.delete}
            isVisible={unfriendConfirmationModal}
            toggle={toggleUnfriendConfirmationModal}
            onConfirm={() => {
              toggleUnfriendConfirmationModal();
              processRejectFriend();
            }}
          />
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default Profile;
