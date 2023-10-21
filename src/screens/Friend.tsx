import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AppContext} from '../context';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
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
import {showError} from '../utils/Toast';
import UserCard from '../components/user/UserCard';
import AppButton from '../components/control/AppButton';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedSearchBar from '../components/control/AnimatedSearchBar';
import HeaderBar from '../components/header/HeaderBar';
import Typography from '../theme/Typography';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import IconButton from '../components/control/IconButton';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {FlatGrid} from 'react-native-super-grid';
import Header from '../components/header/Header';
import IFriendResponse from 'models/response/IFriendResponse';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Friend'>;
const Friend = ({navigation}: props) => {
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

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    fetchListRequestFriend(pageNumber);
    fetchListFriend(pageNumber);
    fetchListSuggestFriend(contacts, search, pageNumber);
  }, [pageNumber]);

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

  const fetchListSuggestFriend = async (
    listContact: string[],
    searchFriend: any,
    page: number,
  ) => {
    try {
      const friendList = await getSuggestFriend({
        phone: listContact,
        search: searchFriend,
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
      setListFriendSuggest([...listfriendSuggest, ...friendList]);
    } catch (err: any) {
      showError(err.message);
      return [];
    }
  };

  const fetchListRequestFriend = async (page: number) => {
    try {
      const response = await getFriendRequest({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
      setListRequestFriend(response);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const fetchListFriend = async (page: number) => {
    try {
      const response = await getFriendList({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
      setListFriend(response);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleOnChangeText = async (event: any) => {
    event.persist();
    const text = event.nativeEvent.text;
    setListFriendSuggest([]);
    setContacts(null);
    setSearch(text);
  };

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name="chevron-back-outline"
              size={IconSizes.x8}
              color={theme.text01}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles(theme).defaultBackground, space(IconSizes.x5).pv]}>
          <Header title="Your friend" />
          <AnimatedSearchBar
            value={search}
            placeholder="Search"
            onBlur={() => {}}
            onFocus={() => {}}
            onChangeText={handleOnChangeText}
          />
          <View style={[styles(theme).row]}>
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
        <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
          {listRequestFriend.length > 0 && (
            <>
              <View style={[styles(theme).row]}>
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
                  Send Request
                </Text>
              </View>
              <FlatGrid
                nestedScrollEnabled={true}
                itemDimension={responsiveWidth(85)}
                showsVerticalScrollIndicator={false}
                data={listRequestFriend}
                itemContainerStyle={styles().listItemContainer}
                contentContainerStyle={styles().listContentContainer}
                style={styles().listContainer}
                spacing={20}
                renderItem={({item}) => (
                  <UserCard
                    userId={item.id}
                    avatar={item.avatar}
                    name={item.name}
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
                        onPress={() => rejectFriend(item.friendId)}
                      />
                    }
                  />
                )}
              />
            </>
          )}
          {listFriend.length > 0 && (
            <>
              <View style={[styles(theme).row]}>
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
              <FlatGrid
                nestedScrollEnabled={true}
                itemDimension={responsiveWidth(85)}
                showsVerticalScrollIndicator={false}
                data={listFriend}
                itemContainerStyle={styles().listItemContainer}
                contentContainerStyle={styles().listContentContainer}
                style={styles().listContainer}
                spacing={20}
                renderItem={({item}) => (
                  <UserCard
                    userId={item.id}
                    avatar={item.avatar}
                    name={item.name}
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
                        onPress={() => rejectFriend(item.friendId)}
                      />
                    }
                  />
                )}
              />
            </>
          )}
          {listfriendSuggest.length > 0 && (
            <>
              <View style={[styles(theme).row]}>
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
              <FlatGrid
                nestedScrollEnabled={true}
                itemDimension={responsiveWidth(85)}
                showsVerticalScrollIndicator={false}
                data={listfriendSuggest}
                itemContainerStyle={styles().listItemContainer}
                contentContainerStyle={styles().listContentContainer}
                style={styles().listContainer}
                spacing={20}
                renderItem={({item}) => (
                  <UserCard
                    userId={item.id}
                    avatar={item.avatar}
                    name={item.name}
                    childen={
                      <AppButton
                        label="Add"
                        onPress={() => requestAddFriend(item.id)}
                        labelStyle={{
                          ...FontWeights.Bold,
                          ...FontSizes.Body,
                          color: theme.text01,
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
                            color={theme.text01}
                          />
                        )}
                      />
                    }
                  />
                )}
                ListFooterComponent={() => (
                  <AppButton
                    label="Load More"
                    onPress={() => setPageNumber(pageNumber + 1)}
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
                )}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Friend;
