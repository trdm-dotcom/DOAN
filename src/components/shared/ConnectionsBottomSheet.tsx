import React, {useContext, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {ThemeColors} from '../../constants/Types';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {AppContext} from '../../context';
import {requestAddFriend} from '../../reducers/action/friend';
import UserCardPress from '../user/UserCardPress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';
import {space} from '../style';
import ListEmptyComponent from './ListEmptyComponent';

const {FontWeights, FontSizes} = Typography;

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
    const [friends, setFriends] = useState<any[]>(datas);

    let heading = 'Friends';
    let subHeading = viewMode
      ? `People who are friends with ${name}`
      : 'People who are friends with you';

    const addFriend = async (friend: any) => {
      const response = await requestAddFriend(friend.friendId);
      const updatedFriend = {
        ...friend,
        friendStatus: 'PENDING',
        id: response.id,
      };
      setFriends(
        datas.map(item =>
          item.friendId === updatedFriend.friendId ? friend : item,
        ),
      );
      onStateChange(updatedFriend);
    };

    const renderItem = ({item}) => {
      return (
        <UserCardPress
          userId={item.id}
          avatar={item.avatar}
          name={item.name}
          style={[space(IconSizes.x1).mt]}
          handlerOnPress={() => {
            if (item.friendStatus == null) {
              return addFriend(item);
            }
            return Promise.resolve();
          }}
          ChildrenButton={() =>
            item.friendStatus != null ? (
              <></>
            ) : (
              <>
                <Ionicons
                  name="add"
                  size={IconSizes.x6}
                  color={ThemeStatic.accent}
                />
                <Text
                  style={[
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: ThemeStatic.accent,
                      marginLeft: 5,
                    },
                  ]}>
                  Add Friend
                </Text>
              </>
            )
          }
        />
      );
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        modalStyle={styles(theme).container}
        HeaderComponent={
          <BottomSheetHeader heading={heading} subHeading={subHeading} />
        }
        flatListProps={{
          data: friends,
          renderItem: renderItem,
          keyExtractor: item => item.friendId,
          showsVerticalScrollIndicator: false,
          ListEmptyComponent: () => (
            <ListEmptyComponent listType="users" spacing={30} />
          ),
        }}
      />
    );
  });

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingBottom: responsiveHeight(5),
    },
    listContainer: {
      flex: 1,
    },
    listItemContainer: {
      width: '106%',
    },
    listContentContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

export default ConnectionsBottomSheet;
