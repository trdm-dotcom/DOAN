import React, {Ref, forwardRef, useContext, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {getBlockList, unblockUser} from '../../reducers/action/friend';
import {space, styles} from '../style';
import {IconSizes, Pagination} from '../../constants/Constants';
import ListEmptyComponent from '../shared/ListEmptyComponent';
import {ThemeStatic} from '../../theme/Colors';
import {Text} from 'react-native';
import Typography from '../../theme/Typography';
import UserCardPress from '../user/UserCardPress';

const {FontWeights, FontSizes} = Typography;

interface BlockListBottomSheetProps {
  ref: Ref<any>;
}

const BlockListBottomSheet: React.FC<BlockListBottomSheetProps> = forwardRef(
  (_, ref) => {
    const {theme} = useContext(AppContext);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [blockedUsers, setBlockedUsers] = React.useState<any[]>([]);
    const [nextPage, setNextPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const handleOpen = () => {
      fetchBlockedUsers(0);
    };

    const fetchBlockedUsers = (page: number) => {
      setLoading(true);
      getBlockList({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      })
        .then(res => {
          if (page === 0) {
            setBlockedUsers(res.datas);
          } else {
            const newUsers = res.datas.filter(
              user => !blockedUsers.some(item => item.id === user.id),
            );
            setBlockedUsers([...blockedUsers, ...newUsers]);
          }
          setNextPage(res.nextPage + 1);
          setTotalPages(res.totalPages);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onUnBlock = async (friendId: number) => {
      await unblockUser(friendId);
      setBlockedUsers(blockedUsers.filter(item => item.friendId !== friendId));
    };

    const renderItem = ({item}) => {
      return (
        <UserCardPress
          userId={item.friendId}
          avatar={item.avatar}
          name={item.name}
          handlerOnPress={() => onUnBlock(item.id)}
          style={[space(IconSizes.x1).mt]}
          ChildrenButton={() => (
            <>
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.accent,
                    marginLeft: 5,
                  },
                ]}>
                Unblock
              </Text>
            </>
          )}
          buttonStyle={{
            paddingHorizontal: IconSizes.x1,
          }}
          indicatorColor={ThemeStatic.accent}
        />
      );
    };

    return (
      <Modalize
        ref={ref}
        modalStyle={styles(theme).modalizeContainer}
        onOpen={handleOpen}
        adjustToContentHeight
        HeaderComponent={
          <BottomSheetHeader
            heading="Blocked Users"
            subHeading={"Below are the people you've blocked"}
          />
        }
        flatListProps={{
          data: blockedUsers,
          renderItem: renderItem,
          keyExtractor: item => item.id,
          onEndReachedThreshold: 0.8,
          onEndReached: () => {
            if (nextPage < totalPages) {
              fetchBlockedUsers(nextPage);
            }
          },
          showsVerticalScrollIndicator: false,
          ListEmptyComponent: () =>
            loading || error ? (
              <ConnectionsPlaceholder />
            ) : (
              <ListEmptyComponent listType="users blocked" spacing={30} />
            ),
        }}
      />
    );
  },
);

export default BlockListBottomSheet;
