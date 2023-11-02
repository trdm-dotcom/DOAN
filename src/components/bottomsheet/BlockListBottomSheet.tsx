import React, {Ref, forwardRef, useContext, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import UserCard from '../user/UserCard';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {getBlockList} from '../../reducers/action/friend';
import {space, styles} from '../style';
import {
  FETCHING_HEIGHT,
  IconSizes,
  Pagination,
} from '../../constants/Constants';
import ListEmptyComponent from '../shared/ListEmptyComponent';

interface BlockListBottomSheetProps {
  ref: Ref<any>;
  onUserPress: (userId: number) => void;
}

const BlockListBottomSheet: React.FC<BlockListBottomSheetProps> = forwardRef(
  ({onUserPress}, ref) => {
    const {theme} = useContext(AppContext);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [blockedUsers, setBlockedUsers] = React.useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [offsetY, setOffsetY] = useState(0);

    const handleOpen = () => {
      setPageNumber(0);
      fetchBlockedUsers(0);
    };

    const fetchBlockedUsers = (page: number) => {
      setLoading(true);
      getBlockList({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      })
        .then(res => {
          setBlockedUsers([...blockedUsers, ...res]);
        })
        .catch(err => {
          console.log(err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    function onScroll(event: any) {
      const {nativeEvent} = event;
      const {contentOffset} = nativeEvent;
      const {y} = contentOffset;
      setOffsetY(y);
    }

    function onScrollEndDrag(event: any) {
      const {nativeEvent} = event;
      const {contentOffset} = nativeEvent;
      const {y} = contentOffset;
      setOffsetY(y);
      if (y <= -FETCHING_HEIGHT && !loading) {
        setPageNumber(pageNumber + 1);
        fetchBlockedUsers(pageNumber + 1);
      }
    }

    function onRelease() {
      if (offsetY <= -FETCHING_HEIGHT && !loading) {
        setPageNumber(pageNumber + 1);
        fetchBlockedUsers(pageNumber + 1);
      }
    }

    const renderItem = (item: any) => {
      return (
        <UserCard
          userId={item.id}
          avatar={item.avatar}
          name={item.name}
          onPress={() => onUserPress(item.id)}
          style={[space(IconSizes.x1).mt]}
        />
      );
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        modalStyle={styles(theme).modalizeContainer}
        onOpen={handleOpen}
        adjustToContentHeight
        HeaderComponent={
          <BottomSheetHeader
            heading="Blocked Users"
            subHeading={"Below are the users you've blocked"}
          />
        }
        flatListProps={{
          data: blockedUsers,
          renderItem: renderItem,
          keyExtractor: item => item.id,
          onScroll: onScroll,
          onScrollEndDrag: onScrollEndDrag,
          onResponderRelease: onRelease,
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
