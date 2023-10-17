import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AppContext} from '../context';
import IFriendResponse from 'models/response/IFriendResponse';
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import {
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

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Friend'>;
const Friend = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [listfriendSuggest, setListFriendSuggest] = useState<IFriendResponse[]>(
    [],
  );
  const [contacts, setContacts] = useState<any>(null);
  const [search, setSearch] = useState<any>(null);

  useEffect(() => {
    getContacts();
    fetchListSuggestFriend(contacts, search, pageNumber).then(
      (friendList: IFriendResponse[]) => {
        setListFriendSuggest(friendList);
      },
    );
  }, []);

  useEffect(() => {
    // fetchListSuggestFriend(contacts, search, pageNumber).then(
    //   (friendList: IFriendResponse[]) => {
    //     setListFriendSuggest([...listfriendSuggest, ...friendList]);
    //   },
    // );
  }, [pageNumber, search, contacts]);

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
    searchFriend: string,
    page: number,
  ): Promise<IFriendResponse[]> => {
    try {
      return await getSuggestFriend({
        phone: listContact,
        search: searchFriend,
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
    } catch (err: any) {
      showError(err.message);
      return [];
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
      <View style={{height: 24}}>
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
      </View>
      <View style={[{flex: 1}, space(IconSizes.x10).mt]}>
        <AnimatedSearchBar
          value={search}
          placeholder="Search"
          onBlur={() => {}}
          onFocus={() => {}}
          onChangeText={handleOnChangeText}
        />
        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={() => (
            <View style={[styles(theme).row, space(IconSizes.x5).mt]}>
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
                  },
                  space(IconSizes.x1).ml,
                ]}>
                Send Request
              </Text>
            </View>
          )}
          ListHeaderComponentStyle={space(IconSizes.x5).mb}
          showsVerticalScrollIndicator={false}
          data={listfriendSuggest}
          contentContainerStyle={styles(theme).listContentContainer}
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
                  onPress={() => rejectFriend(item.id)}
                />
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={space(IconSizes.x2).mb} />}
        />
        <FlatList
          scrollEnabled={false}
          ListHeaderComponent={() => (
            <View style={[styles(theme).row, space(IconSizes.x5).mt]}>
              <Ionicons
                name="person-add"
                size={IconSizes.x6}
                color={theme.text01}
              />
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Label,
                  },
                  space(IconSizes.x1).ml,
                ]}>
                Suggestions
              </Text>
            </View>
          )}
          ListHeaderComponentStyle={space(IconSizes.x5).mb}
          showsVerticalScrollIndicator={false}
          data={listfriendSuggest}
          contentContainerStyle={styles(theme).listContentContainer}
          renderItem={({item}) => (
            <UserCard
              userId={item.id}
              avatar={item.avatar}
              name={item.name}
              childen={
                <AppButton
                  label="Add"
                  onPress={() => requestAddFriend(item.id)}
                  containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.accent,
                    paddingHorizontal: IconSizes.x4,
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
          ItemSeparatorComponent={() => <View style={space(IconSizes.x2).mb} />}
          ListFooterComponentStyle={space(IconSizes.x5).mt}
          ListFooterComponent={() => (
            <AppButton
              label="Load More"
              onPress={() => setPageNumber(pageNumber + 1)}
              containerStyle={{
                borderRadius: 50,
              }}
              Icon={() => (
                <Ionicons
                  name="add-circle-outline"
                  size={IconSizes.x6}
                  color={theme.accent}
                />
              )}
            />
          )}
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
              },
              space(IconSizes.x1).ml,
            ]}>
            Invite from other apps
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Friend;
