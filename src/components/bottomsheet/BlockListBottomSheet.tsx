import React, {forwardRef, useContext, useEffect} from 'react';
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
import {showError} from '../../utils/Toast';
import {getBlockList} from '../../reducers/action/friend';
import {styles} from '../style';

const BlockListBottomSheet = forwardRef<Modalize>(ref => {
  const {theme} = useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = React.useState<any[]>([]);

  let content = <ConnectionsPlaceholder />;

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const responsive = await getBlockList();
      setBlockedUsers(responsive);
    } catch (err: any) {
      setError(true);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ListEmptyComponent = () => (
    <SvgBanner
      Svg={EmptyBlockListBanner}
      placeholder="No users blocked"
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
        onPress={() => null}
      />
    );
  };

  if (!loading && !error) {
    content = (
      <FlatGrid
        bounces={false}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={blockedUsers}
        itemContainerStyle={styles(theme).listItemContainer}
        contentContainerStyle={styles(theme).listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
        style={styles(theme).listContainer}
        spacing={20}
        renderItem={renderItem}
      />
    );
  }

  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{showsVerticalScrollIndicator: false}}
      modalStyle={styles(theme).modalizeContainer}>
      <BottomSheetHeader
        heading="Blocked Users"
        subHeading={"Below are the users you've blocked"}
      />
      <View style={styles(theme).modalizeContent}>{content}</View>
    </Modalize>
  );
});

export default BlockListBottomSheet;
