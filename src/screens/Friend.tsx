import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from '../context';
import {
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import {
  acceptFriendRequest,
  getFriendList,
  getFriendRequest,
  getSuggestFriend,
  rejectFriend,
  requestAddFriend,
} from '../reducers/action/friend';
import {IconSizes, Pagination} from '../constants/Constants';
import UserCard from '../components/user/UserCard';
import AppButton from '../components/control/AppButton';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedSearchBar from '../components/control/AnimatedSearchBar';
import Typography from '../theme/Typography';
import IconButton from '../components/control/IconButton';
import Header from '../components/header/Header';
import IFriendResponse from '../models/response/IFriendResponse';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import SearchUsersPlaceholder from '../components/placeholder/SearchUsers.Placeholder';
import {ThemeStatic} from '../theme/Colors';
import UserCardPress from '../components/user/UserCardPress';
import {showError} from '../utils/Toast';
import ConnectionsBottomSheet from '../components/bottomsheet/ConnectionsBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MaterialIndicator} from 'react-native-indicators';
import {NativeImage} from '../components/shared/NativeImage';
import {useNavigation} from '@react-navigation/native';
import {getSocket} from '../utils/Socket';
import {apiGet} from '../utils/Api';

const {FontWeights, FontSizes} = Typography;

type UserCardProps = {
  userId: number;
  avatar: string;
  name: string;
  handlerOnPress: () => Promise<void>;
  friendStatus: string;
  viewMode?: boolean;
  isAccept: boolean;
  handlerOnAccept: () => Promise<void>;
};

const ConnectionsUserCard = ({
  userId,
  avatar,
  name,
  handlerOnPress,
  friendStatus,
  viewMode,
  isAccept,
  handlerOnAccept,
}: UserCardProps) => {
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigateToProfile = () => {
    if (userId === user.id) {
      navigation.navigate('MyProfile');
    }
    navigation.navigate('Profile', {userId: userId});
  };

  const buttonControl = viewMode ? (
    friendStatus === null &&
    userId !== user.id && (
      <TouchableOpacity
        onPress={() => {
          setLoading(true);
          handlerOnPress().finally(() => setLoading(false));
        }}
        disabled={loading}
        activeOpacity={0.9}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.placeholder,
            padding: IconSizes.x1,
            borderRadius: 50,
            width: 50,
          },
        ]}>
        {loading ? (
          <MaterialIndicator size={IconSizes.x6} color={ThemeStatic.accent} />
        ) : (
          <Ionicons name="add" size={IconSizes.x6} color={ThemeStatic.accent} />
        )}
      </TouchableOpacity>
    )
  ) : (
    <View style={[styles(theme).row]}>
      <TouchableOpacity
        onPress={() => {
          setLoading(true);
          handlerOnPress().finally(() => setLoading(false));
        }}
        disabled={loading}
        activeOpacity={0.9}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.placeholder,
            padding: IconSizes.x1,
            borderRadius: 50,
            width: 50,
          },
        ]}>
        {loading ? (
          <MaterialIndicator size={IconSizes.x6} color={ThemeStatic.accent} />
        ) : friendStatus !== null ||
          (friendStatus !== 'PENDING' && !isAccept) ? (
          <Ionicons
            name="close"
            size={IconSizes.x6}
            color={ThemeStatic.accent}
          />
        ) : (
          <Ionicons name="add" size={IconSizes.x6} color={ThemeStatic.accent} />
        )}
      </TouchableOpacity>
      {friendStatus !== null && friendStatus === 'PENDING' && isAccept && (
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            handlerOnAccept().finally(() => setLoading(false));
          }}
          disabled={loading}
          activeOpacity={0.9}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              padding: IconSizes.x1,
              borderRadius: 50,
              width: 50,
              marginLeft: 10,
            },
          ]}>
          {loading ? (
            <MaterialIndicator size={IconSizes.x6} color={ThemeStatic.accent} />
          ) : (
            <Ionicons
              name="checkmark"
              size={IconSizes.x6}
              color={ThemeStatic.accent}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles(theme).userCardContainer, space(IconSizes.x1).mt]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={navigateToProfile}
        style={[styles(theme).row]}>
        <NativeImage uri={avatar} style={styles(theme).tinyImage} />
        <Text style={[styles(theme).nameText, space(IconSizes.x1).ml]}>
          {name}
        </Text>
      </TouchableOpacity>
      {buttonControl}
    </View>
  );
};

const Friend = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const [listfriendSuggest, setListFriendSuggest] = useState<IFriendResponse[]>(
    [],
  );
  const [listRequestFriend, setListRequestFriend] = useState<IFriendResponse[]>(
    [],
  );
  const [listFriend, setListFriend] = useState<IFriendResponse[]>([]);
  const [search, setSearch] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [friendRejected, setFriendRejected] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const socket = getSocket();

  const friendListBottomSheetRef = useRef();
  const friendRequestBottomSheetRef = useRef();

  const onFriendsOpen = () => {
    // @ts-ignore
    return friendListBottomSheetRef.current.open();
  };

  const onFriendsRequestOpen = () => {
    // @ts-ignore
    return friendRequestBottomSheetRef.current.open();
  };

  useEffect(() => {
    fetchInit();
    socket.on('friend.request', (data: any) => {
      if (data.to === user.id) {
        if (!listRequestFriend.some(it => it.friendId === data.data.friendId)) {
          setListRequestFriend([data.data, ...listRequestFriend]);
          setListFriendSuggest(
            listfriendSuggest.filter(it => it.friendId !== data.data.friendId),
          );
        }
      }
    });
    socket.on('friend.accept', (data: any) => {
      if (data.to === user.id) {
        if (!listFriend.some(it => it.friendId === data.data.friendId)) {
          setListFriend([data.data, ...listFriend]);
          setListRequestFriend(
            listRequestFriend.filter(it => it.friendId !== data.data.friendId),
          );
        }
      }
    });
    socket.on('friend.reject', (data: any) => {
      if (data.to === user.id) {
        if (data.data.status === 'FRIENDED') {
          setListFriend(
            listFriend.filter(it => it.friendId !== data.data.userId),
          );
        } else {
          setListRequestFriend(
            listRequestFriend.filter(it => it.friendId !== data.data.userId),
          );
        }
      }
    });
    socket.on('friend.block', (data: any) => {
      if (data.to === user.id) {
        setListFriend(
          listFriend.filter(it => it.friendId !== data.data.userId),
        );
        setListRequestFriend(
          listRequestFriend.filter(it => it.friendId !== data.data.userId),
        );
        setListFriendSuggest(
          listfriendSuggest.filter(it => it.friendId !== data.data.userId),
        );
      }
    });
  }, []);

  const fetchInit = () => {
    setLoading(true);
    Promise.all([
      fetchListRequestFriend(0),
      fetchListSuggestFriend(null, 0),
      fetchListFriend(0),
    ]).catch(() => {
      setError(true);
    });
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      // 'granted' | 'denied' | 'never_ask_again'
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );
      return permission === 'granted';
    } else {
      // 'authorized' | 'denied' | 'undefined'
      const permissionStaus = await Contacts.checkPermission();
      if (permissionStaus === 'authorized') {
        return true;
      } else {
        const permission = await Contacts.requestPermission();
        return permission === 'authorized';
      }
    }
  };

  const getContacts = async () => {
    const contactsPermission = await requestPermission();
    if (contactsPermission) {
      const listPhone: string[] = [];
      const listContact: Contact[] = await Contacts.getAll();
      listContact.forEach(contact => {
        listPhone.push(
          ...contact.phoneNumbers.map(phoneNumber => {
            return phoneNumber.number.trim().replace(/\s/g, '');
          }),
        );
      });
      return listPhone;
    }
    return null;
  };

  const fetchListSuggestFriend = async (searchFriend: any, page: number) => {
    const listPhone = await getContacts();
    const res = await getSuggestFriend({
      phone: searchFriend == null ? listPhone : null,
      search: searchFriend,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    if (res.page === 0) {
      setListFriendSuggest(res.datas);
    } else {
      const newUser = res.datas.filter(
        item => !listfriendSuggest.some(it => it.id === item.id),
      );
      setListFriendSuggest([...listfriendSuggest, ...newUser]);
    }
    setNextPage(res.page + 1);
    setTotalPages(res.totalPages);
  };

  const fetchListRequestFriend = async (page: number) => {
    const res = await getFriendRequest({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setListRequestFriend(res.datas);
    setLoading(false);
  };

  const fetchListFriend = async (page: number) => {
    const res = await getFriendList({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    setListFriend(res.datas);
    setLoading(false);
  };

  const handleOnChangeText = async (text: string) => {
    setSearch(text);
    fetchListSuggestFriend(text, nextPage);
  };

  const deleteConfirmationToggle = () => {
    setShowModal(previousState => !previousState);
  };

  const deleteFriend = () => {
    setShowModal(false);
    rejectFriend(friendRejected)
      .then(() => {
        setListFriend(listFriend.filter(item => item.id !== friendRejected));
        dispatch({
          type: 'removeFriend',
          payload: {
            id: friendRejected,
          },
        });
        dispatch({type: 'removePostByUserId', payload: {id: friendRejected}});
      })
      .catch(err => {
        showError(err.message);
      })
      .finally(() => {
        setFriendRejected(null);
      });
  };

  const addFriend = async (friend: IFriendResponse) => {
    const response = await requestAddFriend(friend.friendId);
    setListFriendSuggest(
      listfriendSuggest.filter(item => item.friendId !== friend.friendId),
    );
    friend.id = response.id;
    friend.isAccept = false;
    friend.friendStatus = 'PENDING';
    setListRequestFriend([...listRequestFriend, friend]);
  };

  let content =
    error || loading ? (
      <SearchUsersPlaceholder />
    ) : (
      <>
        <View style={[{flex: 1}]}>
          {listRequestFriend.length > 0 && (
            <>
              <View
                style={[
                  styles(theme).row,
                  space(IconSizes.x5).mv,
                  {justifyContent: 'space-between'},
                ]}>
                <View style={[styles(theme).row]}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={IconSizes.x6}
                    color={theme.text01}
                  />
                  <Text
                    style={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Label,
                        color: theme.text01,
                      },
                      space(IconSizes.x1).ml,
                    ]}>
                    Request friend
                  </Text>
                </View>
                <TouchableOpacity onPress={onFriendsRequestOpen}>
                  <Text
                    style={[
                      styles(theme).centerText,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: ThemeStatic.accent,
                      },
                    ]}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              {listRequestFriend.map(item => (
                <ConnectionsUserCard
                  key={item.id}
                  userId={item.friendId}
                  avatar={item.avatar}
                  name={item.name}
                  friendStatus={item.friendStatus}
                  handlerOnPress={async () => {
                    await rejectFriend(item.id);
                    setListRequestFriend(
                      listRequestFriend.filter(
                        request => request.id !== item.id,
                      ),
                    );
                  }}
                  isAccept={item.isAccept}
                  handlerOnAccept={async () => {
                    await acceptFriendRequest(item.id);
                    item.isAccept = false;
                    item.friendStatus = 'FRIENDED';
                    setListFriend([...listFriend, item]);
                    dispatch({
                      type: 'addFriend',
                      payload: [item],
                    });
                    setListRequestFriend(
                      listRequestFriend.filter(
                        request => request.id !== item.id,
                      ),
                    );
                    apiGet<any>('/social/post', {
                      params: {
                        pageNumber: 0,
                        pageSize: Pagination.PAGE_SIZE,
                      },
                    }).then(res => {
                      dispatch({
                        type: 'getAllPostsSuccess',
                        payload: res,
                      });
                    });
                  }}
                />
              ))}
            </>
          )}
          {listFriend.length > 0 && (
            <>
              <View
                style={[
                  styles(theme).row,
                  space(IconSizes.x5).mv,
                  {justifyContent: 'space-between'},
                ]}>
                <View style={[styles(theme).row]}>
                  <Ionicons
                    name="people-outline"
                    size={IconSizes.x6}
                    color={theme.text01}
                  />
                  <Text
                    style={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Label,
                        color: theme.text01,
                      },
                      space(IconSizes.x1).ml,
                    ]}>
                    Your Friends
                  </Text>
                </View>
                <TouchableOpacity onPress={onFriendsOpen}>
                  <Text
                    style={[
                      styles(theme).centerText,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: ThemeStatic.accent,
                      },
                    ]}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              {listFriend.map(item => (
                <UserCard
                  key={item.id}
                  userId={item.friendId}
                  avatar={item.avatar}
                  name={item.name}
                  style={[space(IconSizes.x1).mt]}
                  childen={
                    <IconButton
                      Icon={() => (
                        <Ionicons
                          name="close"
                          size={IconSizes.x6}
                          color={theme.accent}
                        />
                      )}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.placeholder,
                        padding: IconSizes.x1,
                        borderRadius: 50,
                        width: 50,
                      }}
                      onPress={() => {
                        deleteConfirmationToggle();
                        setFriendRejected(item.id);
                      }}
                    />
                  }
                />
              ))}
            </>
          )}
          {listfriendSuggest.length > 0 && (
            <>
              <View
                style={[
                  styles(theme).row,
                  space(IconSizes.x5).mv,
                  {justifyContent: 'space-between'},
                ]}>
                <View style={[styles(theme).row]}>
                  <Ionicons
                    name="bulb-outline"
                    size={IconSizes.x6}
                    color={theme.text01}
                  />
                  <Text
                    style={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Label,
                        color: theme.text01,
                      },
                      space(IconSizes.x1).ml,
                    ]}>
                    Suggestions
                  </Text>
                </View>
              </View>
              {listfriendSuggest.map(item => (
                <UserCardPress
                  key={item.id}
                  userId={item.friendId}
                  avatar={item.avatar}
                  name={item.name}
                  style={[space(IconSizes.x1).mt]}
                  handlerOnPress={() => addFriend(item)}
                  buttonStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.placeholder,
                    padding: IconSizes.x1,
                    borderRadius: 50,
                    width: 50,
                  }}
                  ChildrenButton={() => (
                    <Ionicons
                      name="add"
                      size={IconSizes.x6}
                      color={ThemeStatic.accent}
                    />
                  )}
                  indicatorColor={ThemeStatic.accent}
                />
              ))}
              {nextPage < totalPages && (
                <AppButton
                  label="Load More"
                  onPress={() => {
                    fetchListSuggestFriend(search, nextPage);
                  }}
                  disabled={nextPage >= totalPages}
                  containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 50,
                    backgroundColor: theme.placeholder,
                    paddingHorizontal: IconSizes.x5,
                    paddingVertical: IconSizes.x1,
                    marginTop: IconSizes.x5,
                  }}
                  Icon={() => (
                    <Ionicons
                      name="add-circle-outline"
                      size={IconSizes.x6}
                      color={theme.text01}
                    />
                  )}
                />
              )}
            </>
          )}
        </View>
      </>
    );

  const refreshControl = () => {
    const onRefresh = () => {
      fetchInit();
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
      <ScrollView
        refreshControl={refreshControl()}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles(theme).defaultBackground]}>
          <Header title="Your friend" />
          <AnimatedSearchBar
            value={search}
            placeholder="Search"
            onBlur={() => {
              setSearch(null);
              fetchInit();
            }}
            onFocus={() => {
              setListFriendSuggest([]);
              setListRequestFriend([]);
            }}
            onChangeText={handleOnChangeText}
          />
        </View>
        {content}
      </ScrollView>
      <ConfirmationModal
        label="Delete"
        title="Delete?"
        color="red"
        isVisible={showModal}
        toggle={deleteConfirmationToggle}
        onConfirm={deleteFriend}
      />
      <ConnectionsBottomSheet
        ref={friendListBottomSheetRef}
        datas={listFriend}
        name={user.name}
        onStateChange={(friend: any) => {
          dispatch({
            type: 'removeFriend',
            payload: {
              id: friend.id,
            },
          });
          dispatch({type: 'removePostByUserId', payload: {id: friend.id}});
        }}
        fetchMore={(page: number) =>
          getFriendList({
            pageNumber: page,
            pageSize: Pagination.PAGE_SIZE,
          })
        }
      />
      <ConnectionsBottomSheet
        ref={friendRequestBottomSheetRef}
        datas={listRequestFriend}
        name={user.name}
        onStateChange={(friend: any) => {
          friend.isAccept = false;
          friend.friendStatus = 'FRIENDED';
          dispatch({
            type: 'addFriend',
            payload: [friend],
          });
        }}
        fetchMore={(page: number) =>
          getFriendRequest({
            pageNumber: page,
            pageSize: Pagination.PAGE_SIZE,
          })
        }
      />
    </GestureHandlerRootView>
  );
};

export default Friend;
