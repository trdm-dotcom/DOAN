import React, {useContext, useEffect, useRef, useState} from 'react';
import {RootStackParamList} from '../navigators/RootStack';
import {AppContext} from '../context';
import {styles} from '../components/style';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination, PostDimensions} from '../constants/Constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {ThemeStatic} from '../theme/Colors';
import ProfileOptionsBottomSheet from '../components/profile/ProfileOptionsBottomSheet';
import ProfileScreenPlaceholder from '../components/placeholder/ProfileScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import UserInteractions from '../components/profile/UserInteractions';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {getUserInfo} from '../reducers/action/user';
import {getPostOfUser} from '../reducers/action/post';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getFriendList} from '../reducers/action/friend';
import ConnectionsBottomSheet from '../components/shared/ConnectionsBottomSheet';

type props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const Profile = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {user} = route.params;

  const [blockConfirmationModal, setBlockConfirmationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      Promise.all([
        getUserInfo({userId: user}),
        getPostOfUser({
          targetId: user,
          pageNumber: pageNumber,
          pageSize: Pagination.PAGE_SIZE,
        }),
        getFriendList({
          pageNumber: 0,
          pageSize: Pagination.PAGE_SIZE,
        }),
      ])
        .catch(err => {
          console.log(err);
          setError(true);
        })
        .then(res => {
          setUserProfile(res[0]);
          setSortedPosts(res[1]);
          setFriends(res[2]);
        })
        .finally(() => setLoading(false));
    };

    fetchData();
  }, []);

  useEffect(() => {
    getPostOfUser({
      targetId: user,
      pageNumber: pageNumber,
      pageSize: Pagination.PAGE_SIZE,
    }).then(res => {
      setSortedPosts([...sortedPosts, ...res]);
    });
  }, [pageNumber]);

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

  const ListHeaderComponent = () => {
    return (
      <ProfileCard
        avatar={userProfile.avatar}
        name={userProfile.name}
        renderInteractions={() => (
          <UserInteractions
            targetId={user}
            avatar={userProfile.avatar}
            name={userProfile.name}
          />
        )}
        posts={sortedPosts.length}
        friends={friends.length}
        onFriendsOpen={onFriendsOpen}
      />
    );
  };

  const renderItem = ({item}) => {
    const {id, uri} = item;
    return (
      <PostThumbnail id={id} uri={uri} dimensions={PostDimensions.Medium} />
    );
  };

  let content =
    loading || error ? (
      <ProfileScreenPlaceholder viewMode />
    ) : (
      <>
        <FlatGrid
          staticDimension={responsiveWidth(85)}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
          ListEmptyComponent={() => (
            <ListEmptyComponent listType="posts" spacing={30} />
          )}
          style={[
            {
              flex: 1,
              marginHorizontal: 10,
            },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            setPageNumber(pageNumber + 1);
          }}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={friendsBottomSheetRef}
          data={friends}
          name={userProfile.name}
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
