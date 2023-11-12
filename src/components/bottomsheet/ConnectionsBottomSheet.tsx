import React, {useContext, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {AppContext} from '../../context';
import {rejectFriend, requestAddFriend} from '../../reducers/action/friend';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {space, styles} from '../style';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {showError} from '../../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import {NativeImage} from '../shared/NativeImage';
import {MaterialIndicator} from 'react-native-indicators';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

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
          <Ionicons
            name="checkmark"
            size={IconSizes.x6}
            color={ThemeStatic.accent}
          />
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

interface ConnectionsBottomSheetProps {
  ref: React.Ref<any>;
  viewMode?: boolean;
  datas: any[];
  onStateChange: (state: any) => void;
  fetchMore: (page: number) => Promise<any>;
  name?: string;
}

const ConnectionsBottomSheet: React.FC<ConnectionsBottomSheetProps> =
  React.forwardRef(({viewMode, name, datas, onStateChange, fetchMore}, ref) => {
    const {theme} = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPage, setNextPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    let heading = 'Friends';
    let subHeading = viewMode
      ? `People who are friends with ${name}`
      : 'People who are friends with you';

    const onPress = async (friend: any) => {
      try {
        if (friend.friendStatus == null) {
          await addFriend(friend);
        } else if (friend.friendStatus === 'FRIENDED') {
          await unFriend(friend);
        }
      } catch (err: any) {
        showError(err.message);
      }
    };

    const unFriend = async (friend: any) => {
      await rejectFriend(friend.id);
      onStateChange(friend);
      datas.filter(item => item.id !== friend.id);
    };

    const addFriend = async (friend: any) => {
      const response = await requestAddFriend(friend.friendId);
      onStateChange({
        ...friend,
        friendStatus: 'PENDING',
        id: response.id,
      });
      datas.map(
        item =>
          item.id === friend.id && {
            ...friend,
            friendStatus: 'PENDING',
            id: response.id,
          },
      );
    };

    const acceptFriend = async (friend: any) => {
      await requestAddFriend(friend.friendId);
      onStateChange({
        ...friend,
        friendStatus: 'FRIENDED',
      });
      datas.filter(item => item.id !== friend.id);
    };

    const fetchData = (page: number) => {
      setLoading(true);
      fetchMore(page)
        .then(response => {
          setNextPage(response.nextPage);
          setTotalPages(response.totalPages);
          if (response.page === 0) {
            datas = response.datas;
          } else {
            datas = [...datas, ...response.datas];
          }
        })
        .finally(() => setLoading(false));
    };

    const renderItem = ({item}) => {
      return (
        <ConnectionsUserCard
          userId={item.friendId}
          avatar={item.avatar}
          name={item.name}
          friendStatus={item.friendStatus}
          handlerOnPress={() => onPress(item)}
          viewMode={viewMode}
          isAccept={item.isAccept}
          handlerOnAccept={() => acceptFriend(item)}
        />
      );
    };

    return (
      <Modalize
        ref={ref}
        modalStyle={styles(theme).modalizeContainer}
        HeaderComponent={
          <BottomSheetHeader heading={heading} subHeading={subHeading} />
        }
        flatListProps={{
          data: datas,
          refreshControl: (
            <RefreshControl
              tintColor={theme.text02}
              refreshing={loading}
              onRefresh={() => {
                fetchData(0);
              }}
            />
          ),
          renderItem: renderItem,
          keyExtractor: item => item.friendId,
          showsVerticalScrollIndicator: false,
          ListEmptyComponent: () => (
            <ListEmptyComponent listType="users" spacing={30} />
          ),
          onEndReachedThreshold: 0.8,
          onEndReached: async () => {
            if (nextPage < totalPages && !loading) {
              fetchData(nextPage);
            }
          },
        }}
        adjustToContentHeight
      />
    );
  });

export default ConnectionsBottomSheet;
