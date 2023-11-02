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
import {responsiveWidth} from 'react-native-responsive-dimensions';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {getUserInfo} from '../reducers/action/user';
import {getPostOfUser} from '../reducers/action/post';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {checkFriend, getFriendOfUser} from '../reducers/action/friend';
import ConnectionsBottomSheet from '../components/shared/ConnectionsBottomSheet';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {getConversationBetween} from '../reducers/action/chat';
import Typography from '../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const Profile = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {userId} = route.params;

  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [blockConfirmationModal, setBlockConfirmationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [friends, setFriends] = useState<any[]>([]);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setError(false);
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
          setIsFriend(res[2].isFriend);
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

  const onBlockUser = () => {
    onProfileOptionsClose();
    toggleBlockConfirmationModal();
  };

  const processBlockUser = () => {
    toggleBlockConfirmationModal();
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

  const followInteraction = () => {};

  const ListHeaderComponent = () => {
    return (
      <ProfileCard
        avatar={userProfile.avatar}
        name={userProfile.name}
        renderInteractions={() => (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={followInteraction}
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 5,
                  paddingVertical: 7,
                  borderRadius: 40,
                  backgroundColor: theme.accent,
                },
              ]}>
              {loading || error ? (
                <LoadingIndicator size={IconSizes.x0} color={theme.white} />
              ) : (
                <Text
                  style={[
                    {
                      ...FontWeights.Light,
                      ...FontSizes.Caption,
                      color: theme.white,
                    },
                  ]}>
                  {`${isFriend ? 'UNFRIEND' : 'ADD FRIEND'}`}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={messageInteraction}
              disabled={loading || error || !isFriend}
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                  paddingVertical: 7,
                  borderRadius: 40,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.accent,
                },
              ]}>
              <Text
                style={[
                  {
                    ...FontWeights.Light,
                    ...FontSizes.Caption,
                    color: theme.accent,
                  },
                ]}>
                MESSAGE
              </Text>
            </TouchableOpacity>
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
          staticDimension={responsiveWidth(85)}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
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
              marginHorizontal: 10,
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
                  name="chevron-back-outline"
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
        title="Profile"
        titleStyle={{
          ...FontWeights.Bold,
          ...FontSizes.Label,
          color: theme.text01,
        }}
        contentRight={
          <IconButton
            onPress={onProfileOptionsOpen}
            Icon={() => (
              <Ionicons
                name="ellipsis-horizontal"
                size={IconSizes.x5}
                color={theme.text01}
              />
            )}
          />
        }
      />
      {content}
      <ProfileOptionsBottomSheet
        ref={profileOptionsBottomSheetRef}
        onBlockUser={onBlockUser}
      />
      <ConfirmationModal
        label="Confirm"
        title="Are you sure you want to block this user?"
        color={ThemeStatic.delete}
        isVisible={blockConfirmationModal}
        toggle={toggleBlockConfirmationModal}
        onConfirm={processBlockUser}
      />
    </GestureHandlerRootView>
  );
};

export default Profile;
