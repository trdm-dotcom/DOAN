import React, {Ref, forwardRef, useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {FlatGrid} from 'react-native-super-grid';
import EmptyBlockListBanner from '../../../assets/svg/empty-blocklist.svg';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import UserCard from '../user/UserCard';
import SvgBanner from '../SvgBanner';
import ConnectionsPlaceholder from '../placeholder/Connections.Placeholder';
import {getBlockList} from '../../reducers/action/friend';
import {styles} from '../style';
import {Pagination} from 'src/constants/Constants';

interface BlockListBottomSheetProps {
  ref: Ref<any>;
}

const BlockListBottomSheet: React.FC<BlockListBottomSheetProps> = forwardRef(
  (_, ref) => {
    const {theme} = useContext(AppContext);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [blockedUsers, setBlockedUsers] = React.useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);

    useEffect(() => {
      fetchBlockedUsers();
      return () => {};
    }, [pageNumber]);

    const fetchBlockedUsers = () => {
      setLoading(true);
      getBlockList({
        pageNumber: pageNumber,
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

    const renderItem = (item: any) => {
      return (
        <UserCard
          userId={item.id}
          avatar={item.avatar}
          name={item.name}
          onPress={() => null}
        />
      );
    };

    let content =
      loading || error ? (
        <ConnectionsPlaceholder />
      ) : (
        <FlatGrid
          bounces={false}
          itemDimension={responsiveWidth(85)}
          showsVerticalScrollIndicator={false}
          data={blockedUsers}
          itemContainerStyle={styles(theme).listItemContainer}
          contentContainerStyle={styles(theme).listContentContainer}
          ListEmptyComponent={() => (
            <SvgBanner
              Svg={EmptyBlockListBanner}
              placeholder="No users blocked"
              spacing={16}
            />
          )}
          style={styles(theme).listContainer}
          spacing={20}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => setPageNumber(pageNumber + 1)}
        />
      );

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).modalizeContainer}
        adjustToContentHeight>
        <BottomSheetHeader
          heading="Blocked Users"
          subHeading={"Below are the users you've blocked"}
        />
        <View style={styles(theme).modalizeContent}>{content}</View>
      </Modalize>
    );
  },
);

export default BlockListBottomSheet;
