import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {AppContext} from '../../context';
import IFriendResponse from '../../models/response/IFriendResponse';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import EmptySearchUserBanner from '../../../assets/svg/search-users.svg';
import SvgBanner from '../SvgBanner';
import {PermissionsAndroid, Platform, View, Text} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import {getSuggestFriend, requestAddFriend} from '../../reducers/action/friend';
import {showError} from '../../utils/Toast';
import {IconSizes, Pagination} from '../../constants/Constants';
import {FlatGrid} from 'react-native-super-grid';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {space, styles} from '../style';
import UserCard from '../user/UserCard';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../header/BottomSheetHeader';
import AnimatedSearchBar from '../control/AnimatedSearchBar';
import AppButton from '../control/AppButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type FriendBottomSheetProps = {
  onUserPress: (userId: number) => void;
};

const FriendBottomSheet = forwardRef<Modalize, FriendBottomSheetProps>(
  ({onUserPress}, ref) => {
    const {theme} = useContext(AppContext);
    const [pageNumber, setPageNumber] = useState(0);
    const [listfriendSuggest, setListFriendSuggest] = useState<
      IFriendResponse[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [contacts, setContacts] = useState<any>(null);
    const [search, setSearch] = useState<any>(null);

    useEffect(() => {
      getContacts();
    }, []);

    useEffect(() => {
      if (contacts === null && search === null) {
        setListFriendSuggest([]);
      } else {
        fetchListSuggestFriend(contacts, search, pageNumber).then(
          (friendList: IFriendResponse[]) => {
            setListFriendSuggest([...listfriendSuggest, ...friendList]);
          },
        );
      }
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
        setLoading(true);
        return await getSuggestFriend({
          phone: listContact,
          search: searchFriend,
          pageNumber: page,
          pageSize: Pagination.PAGE_SIZE,
        });
      } catch (err: any) {
        showError(err.message);
        setError(true);
        return [];
      } finally {
        setLoading(false);
      }
    };

    const handleOnChangeText = async (text: string) => {
      setListFriendSuggest([]);
      setContacts(null);
      setSearch(text);
    };

    let content = <ConnectionsPlaceholder />;

    const ListEmptyComponent = () => (
      <SvgBanner
        Svg={EmptySearchUserBanner}
        placeholder="Search for users..."
        spacing={16}
      />
    );

    const renderItem = (item: any) => {
      return (
        <UserCard
          userId={item.id}
          avatar={item.avatar}
          handle={item.handle}
          name={item.name}
          onPress={onUserPress}
          childen={
            <AppButton
              label="Follow"
              onPress={() => requestAddFriend(item.id)}
              Icon={() => (
                <Ionicons
                  name="add-outline"
                  size={IconSizes.x4}
                  color={theme.accent}
                />
              )}
            />
          }
        />
      );
    };

    if (!loading && !error) {
      content = (
        <>
          <View style={[styles(theme).row, space(IconSizes.x5).mt]}>
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
                space(IconSizes.x1).ml,
              ]}>
              Suggestions
            </Text>
          </View>
          <FlatGrid
            bounces={false}
            itemDimension={responsiveWidth(85)}
            showsVerticalScrollIndicator={false}
            data={listfriendSuggest}
            itemContainerStyle={styles(theme).listItemContainer}
            contentContainerStyle={styles(theme).listContentContainer}
            ListEmptyComponent={ListEmptyComponent}
            style={styles(theme).listContainer}
            spacing={20}
            renderItem={renderItem}
            onEndReached={() => setPageNumber(pageNumber + 1)}
          />
        </>
      );
    }

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).modalizeContainer}>
        <BottomSheetHeader heading="Your Friends" subHeading={''} />
        <View style={styles(theme).modalizeContent}>
          <AnimatedSearchBar
            value={search}
            placeholder="Search"
            onBlur={() => {}}
            onFocus={() => {}}
            onChangeText={handleOnChangeText}
          />
          {content}
          <View style={[styles(theme).row, space(IconSizes.x5).mt]}>
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
      </Modalize>
    );
  },
);

export default FriendBottomSheet;
