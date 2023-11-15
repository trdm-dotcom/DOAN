import React, {useCallback, useContext, useRef, useState} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import SearchUsersPlaceholder from '../components/placeholder/SearchUsers.Placeholder';
import {ThemeStatic} from '../theme/Colors';
import UserCardPress from '../components/user/UserCardPress';
import {showError} from '../utils/Toast';
import ConnectionsBottomSheet from '../components/bottomsheet/ConnectionsBottomSheet';
import {useSelector} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {FontWeights, FontSizes} = Typography;

const Friend = () => {
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

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

  useFocusEffect(
    useCallback(() => {
      fetchInit();
    }, []),
  );

  const fetchInit = () => {
    setLoading(true);
    Promise.all([
      fetchListRequestFriend(0),
      fetchListFriend(0),
      fetchListSuggestFriend(null, 0),
    ])
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
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

  const fetchListSuggestFriend = (searchFriend: any, page: number) => {
    setIsLoading(true);
    getContacts().then(listPhone => {
      getSuggestFriend({
        phone: searchFriend == null ? listPhone : null,
        search: searchFriend,
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      })
        .then(response => {
          setListFriendSuggest(
            response.page === 0
              ? response.datas
              : [...listfriendSuggest, ...response.datas],
          );
          setNextPage(response.page + 1);
          setTotalPages(response.totalPages);
        })
        .finally(() => setIsLoading(false));
    });
  };

  const fetchListRequestFriend = (page: number) => {
    getFriendRequest({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    }).then(response => setListRequestFriend(response.datas));
  };

  const fetchListFriend = (page: number) => {
    getFriendList({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    }).then(response => setListFriend(response.datas));
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
                <UserCardPress
                  key={item.id}
                  userId={item.friendId}
                  avatar={item.avatar}
                  name={item.name}
                  style={[space(IconSizes.x1).mt]}
                  handlerOnPress={async () => {
                    if (item.isAccept) {
                      await acceptFriendRequest(item.id);
                      setListFriend([...listFriend, item]);
                    } else {
                      await rejectFriend(item.id);
                    }
                    setListRequestFriend(
                      listRequestFriend.filter(
                        request => request.id !== item.id,
                      ),
                    );
                  }}
                  buttonStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.placeholder,
                    padding: IconSizes.x1,
                    borderRadius: 50,
                    width: 50,
                  }}
                  ChildrenButton={() =>
                    item.isAccept ? (
                      <Ionicons
                        name="checkmark"
                        size={IconSizes.x6}
                        color={ThemeStatic.accent}
                      />
                    ) : (
                      <Ionicons
                        name="close"
                        size={IconSizes.x6}
                        color={ThemeStatic.accent}
                      />
                    )
                  }
                  indicatorColor={ThemeStatic.accent}
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
              <View style={[styles(theme).row, space(IconSizes.x5).mv]}>
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
                  disabled={nextPage >= totalPages || isLoading}
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
              setListFriend([]);
              setListRequestFriend([]);
            }}
            onChangeText={handleOnChangeText}
          />
          {/* <View style={[styles(theme).row, space(IconSizes.x5).mv]}>
            <Ionicons
              name="share-social-outline"
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
              Invite from other apps
            </Text>
          </View> */}
        </View>
        {content}
      </ScrollView>
      <ConfirmationModal
        label="Delete"
        title="Are you sure you want to delete?"
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
          setListFriend(listFriend.filter(item => item.id !== friend.id));
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
        onStateChange={(friend: any) => setListFriend([...listFriend, friend])}
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
