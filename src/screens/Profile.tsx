import React, {useContext, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '../navigators/RootStack';
import {AppContext} from '../context';
import {space, styles} from '../components/style';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination, SCREEN_WIDTH} from '../constants/Constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {ThemeStatic} from '../theme/Colors';
import ProfileOptionsBottomSheet from '../components/profile/ProfileOptionsBottomSheet';
import ProfileScreenPlaceholder from '../components/placeholder/ProfileScreen.Placeholder';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {getUserInfo} from '../reducers/action/user';
import {getPostOfUser, getPostTagged} from '../reducers/action/post';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
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
import {Text, TouchableOpacity, View} from 'react-native';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Typography from '../theme/Typography';
import {showError} from '../utils/Toast';
import {useDispatch, useSelector} from 'react-redux';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import Feather from 'react-native-vector-icons/Feather';

const {FontWeights, FontSizes} = Typography;

type Route = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

type props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const Profile = ({navigation, route}: props) => {
  const dispatch = useDispatch();
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
  const [posts, setPosts] = useState<any[]>([]);
  const [postsTagged, setPostsTagged] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [countFriends, setCountFriends] = useState<number>(0);
  const [countPosts, setCountPosts] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(0);
  const [nextPageTagged, setNextPageTagged] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPagesTagged, setTotalPagesTagged] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'post', icon: 'grid'},
    {key: 'tag', icon: 'tag'},
  ]);

  useEffect(() => {
    fetchData(userId);
  }, [userId]);

  const fetchData = (id: number) => {
    setLoading(true);
    setIsLoading(true);
    Promise.all([
      getUserInfo({userId: id}),
      checkFriend({friend: id}),
      fetchPosts(id, 0),
      fetchPostTags(id, 0),
      fetchFriends(id, 0),
    ])
      .catch(() => {
        setError(true);
      })
      .then(res => {
        setUserProfile(res[0]);
        setFriendStatus(res[1]);
      })
      .finally(() => {
        setLoading(false);
        setIsLoading(false);
      });
  };

  const fetchPosts = async (id: number, page: number) => {
    const res = await getPostOfUser({
      targetId: id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setCountPosts(res.total);
    setPosts(res.page === 0 ? res.datas : [...posts, ...res.datas]);
    setNextPage(res.page + 1);
    setTotalPages(res.totalPages);
  };

  const fetchPostTags = async (id: number, page: number) => {
    const res = await getPostTagged({
      targetId: id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setPostsTagged(res.page === 0 ? res.datas : [...postsTagged, ...res.datas]);
    setNextPageTagged(res.page + 1);
    setTotalPagesTagged(res.totalPages);
  };

  const fetchFriends = async (id: number, page: number) => {
    const res = await getFriendOfUser({
      friend: id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setCountFriends(res.total);
    setFriends(res.page === 0 ? res.datas : [...friends, ...res.datas]);
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
      .then(() => {
        navigation.goBack();
        if (friendStatus.status === 'FRIENDED') {
          dispatch({
            type: 'removePostByUserId',
            payload: {
              id: userId,
            },
          });
          dispatch({
            type: 'removeFriend',
            payload: {
              id: userId,
            },
          });
        }
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
        navigation.goBack();
        if (friendStatus.status === 'FRIENDED') {
          dispatch({
            type: 'removePostByUserId',
            payload: {
              id: userId,
            },
          });
          dispatch({
            type: 'removeFriend',
            payload: {
              id: userId,
            },
          });
        }
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
    navigation.navigate('Conversation', {
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

  const renderItem = ({item}) => {
    return (
      <PostThumbnail id={item.id} uri={item.source} userId={item.userId} />
    );
  };

  const handleStateChange = (friend: any) => {
    setFriends(
      friends.map(item => (item.friendId === friend.friendId ? friend : item)),
    );
  };

  const PostRoute = () => (
    <FlatList
      numColumns={3}
      data={posts}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <ListEmptyComponent listType="posts" spacing={30} />
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
            <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
          )}
        </View>
      )}
      onEndReachedThreshold={0.8}
      onEndReached={() => {
        if (nextPage < totalPages && !isLoading) {
          setIsLoading(true);
          fetchPosts(userId, nextPage).then(() => setIsLoading(false));
        }
      }}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );

  const TagRoute = () => (
    <FlatList
      numColumns={3}
      data={postsTagged}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <ListEmptyComponent listType="posts" spacing={30} />
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
            <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
          )}
        </View>
      )}
      onEndReachedThreshold={0.8}
      onEndReached={() => {
        if (nextPageTagged < totalPagesTagged && !isLoading) {
          setIsLoading(true);
          fetchPostTags(userId, nextPageTagged).then(() => setIsLoading(false));
        }
      }}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );

  const renderIcon = ({
    route: tabRoute,
    color,
  }: {
    route: Route;
    color: string;
  }) => <Feather name={tabRoute.icon} size={IconSizes.x6} color={color} />;

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <TabBar
      {...props}
      style={[
        styles(theme).defaultBackground,
        {elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
      ]}
      labelStyle={{
        ...FontWeights.Regular,
        ...FontSizes.Body,
        color: theme.text01,
      }}
      indicatorStyle={{backgroundColor: theme.placeholder}}
      renderIcon={renderIcon}
    />
  );

  let content =
    loading || error ? (
      <ProfileScreenPlaceholder viewMode />
    ) : (
      <>
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
                space(IconSizes.x5).mb,
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
          posts={countPosts}
          friends={countFriends}
          onFriendsOpen={() => {
            if (
              !userProfile.privateMode ||
              friendStatus.status === 'FRIENDED'
            ) {
              onFriendsOpen();
            }
          }}
        />
        {!userProfile.privateMode || friendStatus.status === 'FRIENDED' ? (
          <>
            <TabView
              navigationState={{index, routes}}
              renderScene={SceneMap({
                post: PostRoute,
                tag: TagRoute,
              })}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={{
                height: 0,
                width: SCREEN_WIDTH,
              }}
            />
            <ConnectionsBottomSheet
              viewMode
              ref={friendsBottomSheetRef}
              datas={friends}
              name={userProfile.name}
              onStateChange={handleStateChange}
              fetchMore={(page: number) =>
                getFriendOfUser({
                  friend: userId,
                  pageNumber: page,
                  pageSize: Pagination.PAGE_SIZE,
                })
              }
            />
          </>
        ) : (
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
              This profile is private
            </Text>
          </View>
        )}
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
          {content}
          <ProfileOptionsBottomSheet
            ref={profileOptionsBottomSheetRef}
            onBlockUser={onBlockUser}
          />
          <ConfirmationModal
            label="Ok"
            title="Block this user?"
            color={ThemeStatic.delete}
            isVisible={blockConfirmationModal}
            toggle={toggleBlockConfirmationModal}
            onConfirm={processBlockUser}
          />
          <ConfirmationModal
            label="Ok"
            title="Unfriend this user?"
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
