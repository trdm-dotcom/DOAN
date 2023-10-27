import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AppContext} from '../context';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import {
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

const {FontWeights, FontSizes} = Typography;

const Friend = () => {
  const {theme} = useContext(AppContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [listfriendSuggest, setListFriendSuggest] = useState<IFriendResponse[]>(
    [],
  );
  const [listRequestFriend, setListRequestFriend] = useState<IFriendResponse[]>(
    [],
  );
  const [listFriend, setListFriend] = useState<IFriendResponse[]>([]);
  const [contacts, setContacts] = useState<any>(null);
  const [search, setSearch] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [friendRejected, setFriendRejected] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchInit = () => {
        setLoading(true);
        Promise.all([
          fetchListRequestFriend(),
          fetchListFriend(),
          fetchListSuggestFriend(contacts, search, pageNumber),
        ])
          .catch(err => {
            console.log(err);
            setError(true);
          })
          .finally(() => setLoading(false));
      };
      setPageNumber(0);
      fetchInit();
    }, []),
  );

  useEffect(() => {
    getContacts();
  }, []);

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

  const getContacts = useCallback(async () => {
    const contactsPermission = await requestPermission();
    console.log(`Read contacts permission status: ${contactsPermission}`);
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
      setContacts(listPhone);
    }
  }, []);

  const fetchListSuggestFriend = (
    listContact: string[],
    searchFriend: any,
    page: number,
  ) => {
    getSuggestFriend({
      phone: listContact,
      search: searchFriend,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    }).then(response =>
      setListFriendSuggest(
        page === 0 ? response : [...listfriendSuggest, ...response],
      ),
    );
  };

  const fetchListRequestFriend = () => {
    console.log('fetchListRequestFriend');
    getFriendRequest({
      pageNumber: 0,
      pageSize: Pagination.PAGE_SIZE,
    }).then(response => setListRequestFriend(response));
  };

  const fetchListFriend = () => {
    console.log('fetchListFriend');
    getFriendList({
      pageNumber: 0,
      pageSize: Pagination.PAGE_SIZE,
    }).then(response => setListFriend(response));
  };

  const handleOnChangeText = async (event: any) => {
    event.persist();
    const text = event.nativeEvent.text;
    setListFriendSuggest([]);
    setContacts(null);
    setSearch(text);
  };

  const deleteConfirmationToggle = () => {
    setShowModal(previousState => !previousState);
  };

  const deleteFriend = () => {
    rejectFriend(friendRejected)
      .then(() => {
        setListFriend(
          listFriend.filter(item => item.friendId !== friendRejected),
        );
        setListRequestFriend(
          listRequestFriend.filter(item => item.friendId !== friendRejected),
        );
      })
      .finally(() => {
        setFriendRejected(null);
        setShowModal(false);
      });
  };

  const addFriend = (friend: IFriendResponse) => {
    requestAddFriend(friend.id).then(response => {
      setListFriendSuggest(
        listfriendSuggest.filter(item => item.id !== friend.id),
      );
      friend.friendId = response.id;
      setListRequestFriend([...listRequestFriend, friend]);
    });
  };

  let content = <SearchUsersPlaceholder />;

  if (!error && !loading) {
    content = (
      <>
        <View style={[{flex: 1}]}>
          {listRequestFriend.length > 0 && (
            <>
              <View style={[styles(theme).row, space(IconSizes.x5).mv]}>
                <Ionicons
                  name="checkmark-circle"
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
              {listRequestFriend.map(item => (
                <UserCard
                  userId={item.id}
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
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.placeholder,
                            padding: IconSizes.x1,
                            borderRadius: 50,
                          }}
                        />
                      )}
                      onPress={() => {
                        setFriendRejected(item.friendId);
                        deleteConfirmationToggle();
                      }}
                    />
                  }
                />
              ))}
            </>
          )}
          {listFriend.length > 0 && (
            <>
              <View style={[styles(theme).row, space(IconSizes.x5).mv]}>
                <Ionicons
                  name="people"
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
              {listFriend.map(item => (
                <UserCard
                  userId={item.id}
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
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.placeholder,
                            padding: IconSizes.x1,
                            borderRadius: 50,
                          }}
                        />
                      )}
                      onPress={() => {
                        setFriendRejected(item.friendId);
                        deleteConfirmationToggle();
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
                  name="bulb"
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
                <UserCard
                  userId={item.id}
                  avatar={item.avatar}
                  name={item.name}
                  style={[space(IconSizes.x1).mt]}
                  childen={
                    <AppButton
                      label="Add"
                      onPress={() => addFriend(item)}
                      labelStyle={{
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: ThemeStatic.white,
                      }}
                      containerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.accent,
                        paddingHorizontal: IconSizes.x5,
                        borderRadius: 50,
                      }}
                      Icon={() => (
                        <Ionicons
                          name="add"
                          size={IconSizes.x6}
                          color={ThemeStatic.white}
                        />
                      )}
                    />
                  }
                />
              ))}
              <AppButton
                label="Load More"
                onPress={() => {
                  setPageNumber(pageNumber + 1);
                  fetchListSuggestFriend(contacts, search, pageNumber);
                }}
                containerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 50,
                  backgroundColor: theme.placeholder,
                  paddingHorizontal: IconSizes.x5,
                  paddingVertical: IconSizes.x1,
                }}
                Icon={() => (
                  <Ionicons
                    name="add-circle-outline"
                    size={IconSizes.x6}
                    color={theme.text01}
                  />
                )}
              />
            </>
          )}
        </View>
      </>
    );
  }

  return (
    <>
      <View style={[styles(theme).container, styles(theme).defaultBackground]}>
        <ScrollView
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}>
          <View
            style={[styles(theme).defaultBackground, space(IconSizes.x5).pv]}>
            <Header title="Your friend" />
            <AnimatedSearchBar
              value={search}
              placeholder="Search"
              onBlur={() => {}}
              onFocus={() => {}}
              onChangeText={handleOnChangeText}
            />
            <View style={[styles(theme).row, space(IconSizes.x5).mv]}>
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
            </View>
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
      </View>
    </>
  );
};

export default Friend;
