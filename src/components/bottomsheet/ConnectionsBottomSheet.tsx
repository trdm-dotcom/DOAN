import React, {useContext} from 'react';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {AppContext} from '../../context';
import {rejectFriend, requestAddFriend} from '../../reducers/action/friend';
import UserCardPress from '../user/UserCardPress';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {space, styles} from '../style';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {showError} from '../../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ConnectionsBottomSheetProps {
  ref: React.Ref<any>;
  viewMode?: boolean;
  datas: any[];
  onStateChange: (state: any) => void;
  name?: string;
}

const ConnectionsBottomSheet: React.FC<ConnectionsBottomSheetProps> =
  React.forwardRef(({viewMode, name, datas, onStateChange}, ref) => {
    const {theme} = useContext(AppContext);

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

    const renderItem = ({item}) => {
      return (
        <UserCardPress
          userId={item.id}
          avatar={item.avatar}
          name={item.name}
          style={[space(IconSizes.x1).mt]}
          handlerOnPress={() => onPress(item)}
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
          renderItem: renderItem,
          keyExtractor: item => item.friendId,
          showsVerticalScrollIndicator: false,
          ListEmptyComponent: () => (
            <ListEmptyComponent listType="users" spacing={30} />
          ),
        }}
        adjustToContentHeight
      />
    );
  });

export default ConnectionsBottomSheet;
