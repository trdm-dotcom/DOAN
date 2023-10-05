/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, Text, Platform, PermissionsAndroid, TouchableOpacity} from 'react-native';
import {styles} from '../components/style';
import {useAppDispatch, useAppSelector} from '../reducers/redux/store';
import Contacts, {Contact} from 'react-native-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IFriendResponse from '../models/response/IFriendResponse';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getSuggestFriend, requestAddFriend} from '../reducers/action/friend';
import {IconSizes} from '../constants/Constants';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';
import Typography from '../theme/Typography';
import AnimatedSearchBar from '../components/search/AnimatedSearchBar';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Friend'>;

const Friend = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(0);
  const [listfriendSuggest, setListFriendSuggest] = useState<IFriendResponse[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<string[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [contactsPermission, setContactsPermission] = useState(false);
  const friendList: IFriendResponse[] = useAppSelector(
    state => state.friend.friendList,
  );

  useEffect(() => {
    setListFriendSuggest([...listfriendSuggest, ...friendList]);
  }, [friendList]);

  useEffect(() => {
    getSuggestByContact();
  }, []);

  const requestPermission = useCallback(async () => {
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
      setContactsPermission(permission === 'granted');
    } else {
      // 'authorized' | 'denied' | 'undefined'
      const permissionStaus = await Contacts.checkPermission();
      setContactsPermission(permissionStaus === 'authorized');
      if (permissionStaus === 'undefined') {
        const permission = await Contacts.requestPermission();
        setContactsPermission(permission === 'authorized');
      }
    }
  }, []);

  const getContacts = useCallback(async () => {
    await requestPermission();
    console.log(`Read contacts permission status: ${contactsPermission}`);
    const listPhone: string[] = [];
    console.log(contactsPermission);
    if (contactsPermission) {
      const listContact: Contact[] = await Contacts.getAll();
      listContact.forEach(contact => {
        listPhone.push(
          ...contact.phoneNumbers.map(phoneNumber => {
            return phoneNumber.number.trim().replace(/\s/g, '');
          }),
        );
      });
    }
    setContacts(listPhone);
  }, []);

  const getSuggestByContact = async () => {
    setListFriendSuggest([]);
    setSearch(null);
    setPageNumber(0);
    await getContacts();
    dispatch(
      getSuggestFriend({
        phone: contacts,
        search: search,
        page: pageNumber,
        size: 11,
      }),
    );
  };

  const loadMore = () => {
    setPageNumber(pageNumber + 1);
    dispatch(
      getSuggestFriend({
        phone: contacts,
        search: search,
        page: pageNumber,
        size: 11,
      }),
    );
  };

  const handleOnChangeText = async (text: string) => {
    setListFriendSuggest([]);
    setContacts([]);
    setSearch(text);
    dispatch(
      getSuggestFriend({
        phone: contacts,
        search: search,
        page: pageNumber,
        size: 11,
      }),
    );
  };

  const handleOnPressAddFriend = async (id: number) => {
    await requestAddFriend(id);
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
      <View style={[styles(theme).container]}>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Heading,
            },
            styles(theme).centerText,
          ]}>
          Your Friends
        </Text>
        <AnimatedSearchBar
          value={search}
          placeholder="Search"
          onBlur={getSuggestByContact}
          onFocus={() => {}}
          onChangeText={handleOnChangeText}
        />
        {listfriendSuggest.length > 0 && (
          <View style={styles(theme).mt20}>
            <View style={[styles(theme).row]}>
              <Ionicons
                name="person-add-outline"
                size={IconSizes.x6}
                color={theme.text01}
              />
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Label,
                  },
                  styles(theme).ml10,
                ]}>
                Suggestions
              </Text>
            </View>
          </View>
        )}
        <View style={styles(theme).mt20}>
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
                styles(theme).ml10,
              ]}>
              Invite from other apps
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Friend;
